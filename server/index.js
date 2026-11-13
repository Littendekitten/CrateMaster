// CrateMaster online server (Render): WebSocket trading + Realtime Database presence.
// Env: FIREBASE_SERVICE_ACCOUNT (service account JSON, one line), FIREBASE_DATABASE_URL, PORT (set by Render)
const http = require('http');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
const fs = admin.firestore(), rtdb = admin.database(), FV = admin.firestore.FieldValue;

const LB_FIELDS = { money: 'coins', kills: 'kills', xp: 'xp', wave: 'best' };
const lbCache = new Map();
async function leaderboard(type = 'money', force = false) {
  const field = LB_FIELDS[type] || LB_FIELDS.money;
  const cached = lbCache.get(type);
  if (!force && cached && Date.now() - cached.at < 10000) return cached.data;

  // XP saves were added after the first version of CrateMaster. Firestore
  // orderBy('xp') omits documents that do not contain that field, which made
  // the XP board appear broken for older accounts. Read all saves for XP and
  // rank them in memory; the other boards keep their indexed, bounded query.
  const usersRef = fs.collection('users');
  const snap = field === 'xp'
    ? await usersRef.get()
    : await usersRef.orderBy(field, 'desc').limit(50).get();
  const data = [];
  snap.forEach(d => {
    const x = d.data() || {};
    const coins = Math.max(0, Number(x.coins) || 0);
    const kills = Math.max(0, Number(x.kills) || 0);
    const rawXp = x.xp ?? x.experience ?? x.totalXp ?? x.totalXP ?? 0;
    const xp = Math.max(0, Number(rawXp) || 0);
    const best = Math.max(0, Number(x.best) || 0);
    const score = field === 'coins' ? coins : field === 'kills' ? kills : field === 'xp' ? xp : best;
    // Keep level-1 / 0-XP users visible on the XP board. The other rankings
    // only show players who have actually earned a score.
    if (score <= 0 && field !== 'xp') return;
    data.push({
      uid: d.id,
      name: cleanName(x.username || x.displayName),
      coins: Math.floor(coins),
      kills: Math.floor(kills),
      xp: Math.floor(xp),
      level: Math.floor(Math.sqrt(xp / 60)) + 1,
      best: Math.floor(best)
    });
  });
  const scoreOf = p => field === 'coins' ? p.coins : field === 'kills' ? p.kills : field === 'xp' ? p.xp : p.best;
  data.sort((a, b) => scoreOf(b) - scoreOf(a) || b.kills - a.kills || b.xp - a.xp);
  const result = data.slice(0, 25);
  lbCache.set(type, { at: Date.now(), data: result });
  return result;
}
const CATALOG = require('./catalog.json');
const GUN_CATALOG = CATALOG.guns || {};
const SKIN_CATALOG = CATALOG.skins || {};
const ECON_CRATES = {
  basic: { n: 'Basic Crate', cost: 100, w: [60, 28, 10, 2] },
  elite: { n: 'Elite Crate', cost: 300, w: [0, 50, 35, 15] },
  legend: { n: 'Legendary Crate', cost: 1000, w: [0, 0, 25, 75] },
  spooky: { n: 'Spooky Crate', cost: 500, w: [40, 30, 20, 10], ltd: true },
  og: { n: 'OG Crate', cost: 500, w: [35, 30, 25, 10], ltd: true }
};
const RARITIES = ['common', 'rare', 'epic', 'legendary'];
const GEM_CRATE = { cost: 25, weights: { common: 50, rare: 25, epic: 15, legendary: 8, gem: 2 } };
const activeRuns = new Map();
const actionRates = new Map();

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}
function sendJson(res, status, value) {
  cors(res); res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
}
async function readJson(req) {
  let raw = '';
  for await (const part of req) {
    raw += part;
    if (raw.length > 32 * 1024) throw new Error('Request is too large');
  }
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { throw new Error('Invalid JSON request'); }
}
async function authenticatedUid(req) {
  const match = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i);
  if (!match) throw Object.assign(new Error('Sign in is required'), { status: 401 });
  try { return (await admin.auth().verifyIdToken(match[1])).uid; }
  catch { throw Object.assign(new Error('Your sign-in expired. Please sign in again.'), { status: 401 }); }
}
function rateLimit(uid, key, max = 30, windowMs = 60000) {
  const now = Date.now(), k = uid + ':' + key;
  let item = actionRates.get(k);
  if (!item || now - item.start > windowMs) item = { start: now, count: 0 };
  item.count++; actionRates.set(k, item);
  if (item.count > max) throw Object.assign(new Error('You are doing that too quickly. Please wait a moment.'), { status: 429 });
}
function numberAtLeastZero(v) { return Math.max(0, Math.floor(Number(v) || 0)); }
function isGemGun(g) { return !!(g && (g.gem || g.rank === 'GEM' || g.r === 'gem')); }
function isLimitedGun(g) { return !!(g && (g.limited || g.x)); }
function normalGunIds() { return Object.keys(GUN_CATALOG).filter(id => !isGemGun(GUN_CATALOG[id]) && !isLimitedGun(GUN_CATALOG[id])); }
function normalIndexComplete(data) {
  const found = new Set(Array.isArray(data.discoveredGuns) ? data.discoveredGuns : []);
  const ids = normalGunIds();
  return ids.length > 0 && ids.every(id => found.has(id));
}
function registerDiscoveries(data, ids) {
  // Only catalogue-backed IDs count toward permanent Index milestones.
  const found = new Set((Array.isArray(data.discoveredGuns) ? data.discoveredGuns : []).filter(id => typeof id === 'string' && GUN_CATALOG[id]));
  const before = found.size;
  for (const id of ids) if (GUN_CATALOG[id]) found.add(id);
  data.discoveredGuns = [...found];
  const target = Math.floor(found.size / 10);
  const claimed = numberAtLeastZero(data.indexGemMilestones);
  const milestones = Math.max(claimed, target);
  const earned = Math.max(0, milestones - claimed) * 10;
  if (earned) data.gems = numberAtLeastZero(data.gems) + earned;
  data.indexGemMilestones = milestones;
  return { newDiscoveries: found.size - before, indexGems: earned };
}
function playerView(data) {
  const arrayDefaults = { guns: ['pistol'], skins: ['default'], discoveredGuns: ['pistol'], hotbar: ['pistol', '', '', '', ''] };
  const scalarDefaults = { coins: 250, gems: 0, indexGemMilestones: 0, best: 0, kills: 0, xp: 0, runs: 0, gun: 'pistol', skin: 'default' };
  const out = {};
  for (const [key, fallback] of Object.entries(arrayDefaults)) out[key] = Array.isArray(data[key]) ? [...data[key]] : [...fallback];
  for (const [key, fallback] of Object.entries(scalarDefaults)) out[key] = data[key] ?? fallback;
  return out;
}
async function ensurePlayer(uid) {
  const ref = fs.doc('users/' + uid);
  await fs.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      tx.set(ref, {
        coins: 250, gems: 0, discoveredGuns: ['pistol'], indexGemMilestones: 0,
        guns: ['pistol'], skins: ['default'], gun: 'pistol', skin: 'default', hotbar: ['pistol', '', '', '', ''],
        best: 0, kills: 0, xp: 0, runs: 0, sens: 1, vol: 1, bloom: true,
        username: '', displayName: '', updated: FV.serverTimestamp()
      });
      return;
    }
    const d = snap.data() || {}, patch = {};
    const defaults = { coins: 250, gems: 0, guns: ['pistol'], skins: ['default'], gun: 'pistol', skin: 'default', hotbar: ['pistol', '', '', '', ''], best: 0, kills: 0, xp: 0, runs: 0, sens: 1, vol: 1, bloom: true, username: '', displayName: '' };
    for (const [k, v] of Object.entries(defaults)) if (d[k] === undefined || d[k] === null) patch[k] = v;
    // Sanitize legacy numeric values before the new server-owned economy is used.
    for (const k of ['coins', 'gems', 'best', 'kills', 'xp', 'runs']) {
      const safe = numberAtLeastZero(d[k] === undefined || d[k] === null ? defaults[k] : d[k]);
      if (d[k] !== safe) patch[k] = safe;
    }
    const safeSetting = (value, fallback, min, max) => { const n = Number(value); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback; };
    const sens = safeSetting(d.sens, 1, 0.3, 3), vol = safeSetting(d.vol, 1, 0, 1);
    if (d.sens !== sens) patch.sens = sens;
    if (d.vol !== vol) patch.vol = vol;
    if (typeof d.bloom !== 'boolean') patch.bloom = true;
    if (typeof d.username !== 'string') patch.username = '';
    if (typeof d.displayName !== 'string') patch.displayName = '';
    const owned = Array.isArray(d.guns) ? d.guns.filter(id => typeof id === 'string' && /^[a-z0-9_-]{1,64}$/i.test(id)) : ['pistol'];
    if (!owned.includes('pistol')) owned.unshift('pistol');
    if (!Array.isArray(d.guns) || owned.length !== d.guns.length) patch.guns = owned;
    const skins = Array.isArray(d.skins) ? d.skins.filter(id => typeof id === 'string' && /^[a-z0-9_-]{1,64}$/i.test(id)) : ['default'];
    if (!skins.includes('default')) skins.unshift('default');
    if (!Array.isArray(d.skins) || skins.length !== d.skins.length) patch.skins = skins;
    const equippedGun = owned.includes(d.gun) ? d.gun : 'pistol';
    const equippedSkin = skins.includes(d.skin) ? d.skin : 'default';
    if (d.gun !== equippedGun) patch.gun = equippedGun;
    if (d.skin !== equippedSkin) patch.skin = equippedSkin;
    const hotbar = Array.isArray(d.hotbar) ? d.hotbar.slice(0, 5) : [];
    while (hotbar.length < 5) hotbar.push('');
    const used = {};
    const safeHotbar = hotbar.map(id => {
      if (!id || !owned.includes(id)) return '';
      used[id] = (used[id] || 0) + 1;
      return used[id] <= owned.filter(x => x === id).length ? id : '';
    });
    if (JSON.stringify(safeHotbar) !== JSON.stringify(d.hotbar || [])) patch.hotbar = safeHotbar;
    const found = new Set((Array.isArray(d.discoveredGuns) ? d.discoveredGuns : []).filter(id => typeof id === 'string' && GUN_CATALOG[id]));
    for (const id of owned) if (GUN_CATALOG[id]) found.add(id);
    const target = Math.floor(found.size / 10);
    // Milestones cannot be set above the number of verified discoveries.
    const claimed = Math.min(numberAtLeastZero(d.indexGemMilestones), target);
    const earned = Math.max(0, target - claimed) * 10;
    patch.discoveredGuns = [...found];
    patch.indexGemMilestones = target;
    if (earned) patch.gems = numberAtLeastZero(d.gems) + earned;
    if (Object.keys(patch).length) { patch.updated = FV.serverTimestamp(); tx.set(ref, patch, { merge: true }); }
  });
  const snap = await ref.get();
  return snap.data() || {};
}
function pickWeighted(weights) {
  const total = weights.reduce((a, b) => a + Math.max(0, Number(b) || 0), 0);
  if (!total) return 0;
  let roll = crypto.randomInt(0, 100000) / 100000 * total;
  for (let i = 0; i < weights.length; i++) { roll -= Math.max(0, Number(weights[i]) || 0); if (roll < 0) return i; }
  return weights.length - 1;
}
function rollNormalCrate(crateKey, crate) {
  const rarity = RARITIES[pickWeighted(crate.w)];
  const pool = [];
  for (const [id, gun] of Object.entries(GUN_CATALOG)) {
    if (id === 'pistol' || gun.r !== rarity || isGemGun(gun)) continue;
    if (gun.x && gun.x !== crateKey) continue;
    pool.push({ type: 'guns', id, rarity, name: gun.n, limited: isLimitedGun(gun), gem: false });
  }
  for (const [id, skin] of Object.entries(SKIN_CATALOG)) if (id !== 'default' && skin.r === rarity) pool.push({ type: 'skins', id, rarity, name: skin.n });
  if (!pool.length) throw new Error('This crate has no valid drops. Contact the game owner.');
  return pool[crypto.randomInt(0, pool.length)];
}
function rollGemCrate() {
  const rarities = Object.keys(GEM_CRATE.weights), weights = rarities.map(r => GEM_CRATE.weights[r]);
  const rarity = rarities[pickWeighted(weights)];
  const pool = Object.entries(GUN_CATALOG).filter(([id, gun]) => gun.gemStore && (isGemGun(gun) ? rarity === 'gem' : gun.r === rarity));
  if (!pool.length) throw new Error('The Gem Crate drop pool is not configured correctly.');
  const [id, gun] = pool[crypto.randomInt(0, pool.length)];
  return { type: 'guns', id, rarity, name: gun.n, limited: false, gem: isGemGun(gun) };
}
function itemValue(type, id) {
  if (type === 'guns') {
    const g = GUN_CATALOG[id]; if (!g) return 0;
    if (isLimitedGun(g)) return 100;
    if (isGemGun(g)) return 200;
    return ({ common: 5, rare: 12, epic: 30, legendary: 75 })[g.r] || 5;
  }
  if (type === 'skins') {
    const skin = SKIN_CATALOG[id]; if (!skin) return 0;
    return ({ common: 2, rare: 5, epic: 12, legendary: 25 })[skin.r] || 2;
  }
  return 0;
}
function applyDrop(data, item, completeBefore) {
  if (item.type === 'guns') {
    data.guns = Array.isArray(data.guns) ? data.guns : ['pistol'];
    data.guns.push(item.id);
    const h = Array.isArray(data.hotbar) ? data.hotbar.slice(0, 5) : ['pistol', '', '', '', ''];
    while (h.length < 5) h.push('');
    if (!h.includes(item.id)) { const slot = h.indexOf(''); if (slot >= 0) h[slot] = item.id; }
    data.hotbar = h;
  } else {
    data.skins = Array.isArray(data.skins) ? data.skins : ['default'];
    data.skins.push(item.id);
  }
  const ix = item.type === 'guns' ? registerDiscoveries(data, [item.id]) : { indexGems: 0, newDiscoveries: 0 };
  let bonusGem = false;
  if (completeBefore && item.type === 'guns' && (item.rarity === 'legendary' || item.limited || item.gem) && crypto.randomInt(0, 10000) < 500) {
    data.gems = numberAtLeastZero(data.gems) + 1; bonusGem = true;
  }
  return { ...item, bonusGem, indexGems: ix.indexGems };
}
function requestRef(uid, body, type) {
  const raw = String(body.requestId || '');
  if (!/^[a-zA-Z0-9_-]{12,80}$/.test(raw)) throw Object.assign(new Error('Missing action request ID. Reload the page and try again.'), { status: 400 });
  return fs.collection('economyActions').doc(uid + '_' + type + '_' + raw);
}
async function doEconomyTransaction(uid, body, type, mutator) {
  const userRef = fs.doc('users/' + uid), actionRef = requestRef(uid, body, type);
  return fs.runTransaction(async tx => {
    const [actionSnap, userSnap] = await Promise.all([tx.get(actionRef), tx.get(userRef)]);
    if (actionSnap.exists) return actionSnap.data().result;
    if (!userSnap.exists) throw Object.assign(new Error('Player save not found. Reload the game.'), { status: 404 });
    const data = userSnap.data() || {};
    const outcome = await mutator(data);
    data.updated = FV.serverTimestamp();
    tx.set(userRef, data, { merge: true });
    const result = { ...outcome, player: playerView(data) };
    tx.create(actionRef, { uid, type, result, createdAt: FV.serverTimestamp() });
    return result;
  });
}
async function limitedCrate(uid, key) {
  const base = ECON_CRATES[key];
  if (!base || !base.ltd) return base;
  const snap = await fs.doc('Limited Crates/' + key).get();
  const setting = snap.exists ? snap.data() : null;
  if (!setting || setting.enabled !== true) throw Object.assign(new Error('This Limited Crate is not available right now.'), { status: 404 });
  const cost = Number(setting.cost);
  return { ...base, cost: Number.isFinite(cost) && cost > 0 && cost <= 1000000 ? Math.floor(cost) : base.cost };
}

const server = http.createServer(async (q, r) => {
  const requestUrl = new URL(q.url || '/', 'http://localhost');
  if (q.method === 'OPTIONS') { cors(r); r.writeHead(204); r.end(); return; }
  if (requestUrl.pathname === '/leaderboard' && q.method === 'GET') {
    const type = LB_FIELDS[requestUrl.searchParams.get('type')] ? requestUrl.searchParams.get('type') : 'money';
    try { sendJson(r, 200, await leaderboard(type, requestUrl.searchParams.get('fresh') === '1')); }
    catch (e) { console.error('Leaderboard error:', e); sendJson(r, 500, { error: 'Leaderboard unavailable' }); }
    return;
  }
  if (q.method === 'POST' && requestUrl.pathname.startsWith('/api/')) {
    try {
      const uid = await authenticatedUid(q);
      rateLimit(uid, 'api', 90, 60000);
      const body = await readJson(q);
      const path = requestUrl.pathname;

      if (path === '/api/bootstrap') {
        const player = await ensurePlayer(uid);
        sendJson(r, 200, { ok: true, player: playerView(player) }); return;
      }

      if (path === '/api/run/start') {
        rateLimit(uid, 'run-start', 1, 4000);
        const sessionRef = fs.doc('runSessions/' + uid), runId = crypto.randomUUID(), now = Date.now();
        await fs.runTransaction(async tx => {
          const old = await tx.get(sessionRef);
          if (old.exists && now - numberAtLeastZero(old.data().startedAtMs) < 20 * 60 * 1000) {
            throw Object.assign(new Error('A run is already active. Finish it before starting another.'), { status: 409 });
          }
          tx.set(sessionRef, { runId, startedAtMs: now, startedAt: FV.serverTimestamp() });
        });
        sendJson(r, 200, { ok: true, runId }); return;
      }

      if (path === '/api/run/finish') {
        const runId = String(body.runId || '');
        if (!/^[a-f0-9-]{30,40}$/i.test(runId)) throw Object.assign(new Error('Invalid run ticket.'), { status: 400 });
        const actionRef = fs.collection('economyActions').doc(uid + '_run_' + runId);
        const sessionRef = fs.doc('runSessions/' + uid), userRef = fs.doc('users/' + uid);
        const previous = await actionRef.get();
        if (previous.exists) { sendJson(r, 200, previous.data().result); return; }
        const sessionSnap = await sessionRef.get();
        if (!sessionSnap.exists || sessionSnap.data().runId !== runId) throw Object.assign(new Error('Run ticket expired or not found. Start a new run.'), { status: 409 });
        const startedAtMs = numberAtLeastZero(sessionSnap.data().startedAtMs), elapsed = Math.max(0, (Date.now() - startedAtMs) / 1000);
        if (elapsed < 5) { await sessionRef.delete(); throw Object.assign(new Error('Run was too short to verify rewards.'), { status: 400 }); }
        if (elapsed > 20 * 60) { await sessionRef.delete(); throw Object.assign(new Error('Run ticket expired. Start a new run.'), { status: 409 }); }
        const claimedWave = numberAtLeastZero(body.wave), claimedKills = numberAtLeastZero(body.kills), claimedClears = numberAtLeastZero(body.wavesCleared);
        // Time, wave and spawn caps make client-submitted stats bounded rather than trusted.
        const maxWaveByTime = Math.max(1, Math.min(60, 1 + Math.floor(elapsed / 8)));
        const acceptedWave = Math.min(claimedWave, maxWaveByTime);
        const maxSpawned = acceptedWave * acceptedWave + 4 * acceptedWave;
        const acceptedKills = Math.min(claimedKills, maxSpawned, Math.floor(elapsed * 3.2) + 1, 5000);
        const acceptedClears = Math.min(claimedClears, acceptedWave, 60);
        const coinReward = acceptedKills * 15 + Array.from({ length: acceptedClears }, (_, i) => 20 + (i + 1) * 5).reduce((a, b) => a + b, 0);
        const xpReward = acceptedKills * 10 + acceptedClears * 25;
        const result = await fs.runTransaction(async tx => {
          const [userSnap, actionSnap, currentSession] = await Promise.all([tx.get(userRef), tx.get(actionRef), tx.get(sessionRef)]);
          if (actionSnap.exists) return actionSnap.data().result;
          if (!currentSession.exists || currentSession.data().runId !== runId) throw Object.assign(new Error('This run was already submitted.'), { status: 409 });
          if (!userSnap.exists) throw new Error('Player save not found.');
          const d = userSnap.data() || {};
          d.coins = numberAtLeastZero(d.coins) + coinReward;
          d.xp = numberAtLeastZero(d.xp) + xpReward;
          d.kills = numberAtLeastZero(d.kills) + acceptedKills;
          d.runs = numberAtLeastZero(d.runs) + 1;
          d.best = Math.max(numberAtLeastZero(d.best), acceptedWave);
          d.updated = FV.serverTimestamp();
          const out = { ok: true, accepted: { wave: acceptedWave, kills: acceptedKills, wavesCleared: acceptedClears, elapsedSeconds: Math.floor(elapsed) }, reward: { coins: coinReward, xp: xpReward }, player: playerView(d) };
          tx.set(userRef, d, { merge: true }); tx.create(actionRef, { uid, type: 'run', result: out, createdAt: FV.serverTimestamp() }); tx.delete(sessionRef);
          return out;
        });
        lbCache.clear(); sendJson(r, 200, result); return;
      }

      if (path === '/api/economy/sell') {
        rateLimit(uid, 'sell', 30, 60000);
        const type = body.type === 'skins' ? 'skins' : body.type === 'guns' ? 'guns' : '';
        const id = String(body.id || ''), quantity = numberAtLeastZero(body.quantity);
        if (!type || !/^[a-z0-9_-]{1,64}$/i.test(id) || quantity < 1 || quantity > 5000) throw Object.assign(new Error('Invalid sale request.'), { status: 400 });
        const value = itemValue(type, id);
        if (!value || id === 'pistol' || id === 'default') throw Object.assign(new Error('That item cannot be sold.'), { status: 400 });
        const item = type === 'guns' ? GUN_CATALOG[id] : SKIN_CATALOG[id];
        const limited = type === 'guns' && isLimitedGun(item);
        if (limited && String(body.typedName || '').trim() !== String(item.n)) throw Object.assign(new Error('Type the exact Limited item name to confirm this sale.'), { status: 400 });
        const result = await doEconomyTransaction(uid, body, 'sell', async d => {
          const key = type, arr = Array.isArray(d[key]) ? [...d[key]] : [];
          const owned = cnt(arr, id);
          if (owned < quantity) throw Object.assign(new Error('You no longer own that many copies.'), { status: 409 });
          let left = quantity;
          for (let i = arr.length - 1; i >= 0 && left > 0; i--) if (arr[i] === id) { arr.splice(i, 1); left--; }
          d[key] = arr;
          if (type === 'guns') {
            let hotbar = Array.isArray(d.hotbar) ? d.hotbar.slice(0, 5) : [];
            const used = {}; d.hotbar = hotbar.map(g => { if (!g) return ''; used[g] = (used[g] || 0) + 1; return used[g] <= cnt(arr, g) ? g : ''; });
            while (d.hotbar.length < 5) d.hotbar.push('');
            if (!arr.includes(d.gun)) d.gun = arr.includes('pistol') ? 'pistol' : (arr[0] || 'pistol');
          } else if (!arr.includes(d.skin)) d.skin = 'default';
          const earned = quantity * value; d.coins = numberAtLeastZero(d.coins) + earned;
          return { ok: true, coinsEarned: earned, quantity, itemName: item.n };
        });
        lbCache.delete('money'); sendJson(r, 200, result); return;
      }

      if (path === '/api/economy/open-crate') {
        rateLimit(uid, 'crate-open', 25, 60000);
        const key = String(body.crate || ''), quantity = numberAtLeastZero(body.quantity);
        if (![1, 10, 100].includes(quantity)) throw Object.assign(new Error('You can open 1, 10 or 100 crates at a time.'), { status: 400 });
        const crate = await limitedCrate(uid, key);
        if (!crate) throw Object.assign(new Error('Unknown crate.'), { status: 404 });
        const items = Array.from({ length: quantity }, () => rollNormalCrate(key, crate));
        const result = await doEconomyTransaction(uid, body, 'crate-' + key, async d => {
          const total = crate.cost * quantity;
          if (numberAtLeastZero(d.coins) < total) throw Object.assign(new Error('Not enough KittyCoins.'), { status: 409 });
          d.coins = numberAtLeastZero(d.coins) - total;
          const rewards = { indexGems: 0, bonusGems: 0 };
          const awarded = items.map(item => { const out = applyDrop(d, item, normalIndexComplete(d)); rewards.indexGems += out.indexGems || 0; if (out.bonusGem) rewards.bonusGems++; return out; });
          return { ok: true, crate: key, quantity, cost: total, items: awarded, rewards };
        });
        lbCache.delete('money'); sendJson(r, 200, result); return;
      }

      if (path === '/api/economy/open-gem-crate') {
        rateLimit(uid, 'gem-crate-open', 20, 60000);
        const quantity = numberAtLeastZero(body.quantity || 1);
        if (![1, 10, 100].includes(quantity)) throw Object.assign(new Error('Gem Crates can be opened 1, 10 or 100 at a time.'), { status: 400 });
        const items = Array.from({ length: quantity }, () => rollGemCrate());
        const result = await doEconomyTransaction(uid, body, 'gem-crate', async d => {
          const total = GEM_CRATE.cost * quantity;
          if (numberAtLeastZero(d.gems) < total) throw Object.assign(new Error('Not enough KittyGems.'), { status: 409 });
          d.gems = numberAtLeastZero(d.gems) - total;
          const rewards = { indexGems: 0, bonusGems: 0 };
          const awarded = items.map(item => { const out = applyDrop(d, item, normalIndexComplete(d)); rewards.indexGems += out.indexGems || 0; if (out.bonusGem) rewards.bonusGems++; return out; });
          return { ok: true, quantity, cost: total, items: awarded, rewards };
        });
        sendJson(r, 200, result); return;
      }

      sendJson(r, 404, { error: 'Unknown API endpoint.' }); return;
    } catch (e) {
      console.error('API error:', e);
      sendJson(r, e.status || 500, { error: e.message || 'Server error' }); return;
    }
  }
  r.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); r.end('CrateMaster server ok');
});
const wss = new WebSocketServer({ server, maxPayload: 8192 });

const users = new Map();   // uid -> { ws, name, trade }
const trades = new Map();  // id  -> { id, a, b, active, offers, ready, to, busy }
const send = (ws, o) => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); };
const cleanName = s => String(s || '').replace(/[<>&"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'Player';
const gfirst = new Map(); // uid -> first name of the Google account
// Display/lookup name = chosen username, otherwise the first name of the Google account
async function resolveName(uid) {
  let n = '';
  try { const s = await fs.doc('users/' + uid).get(); if (s.exists) n = String(s.data().username || '').trim(); } catch (e) {}
  return cleanName(n || gfirst.get(uid) || 'Player');
}
const other = (tr, uid) => (uid === tr.a ? tr.b : tr.a);

function pushState(tr) {
  for (const uid of [tr.a, tr.b]) {
    const u = users.get(uid); if (!u) continue;
    const o = other(tr, uid);
    send(u.ws, { t: 'state', id: tr.id, offers: { me: tr.offers[uid], them: tr.offers[o] }, ready: { me: tr.ready[uid], them: tr.ready[o] } });
  }
}
function endTrade(tr, why) {
  clearTimeout(tr.to); trades.delete(tr.id);
  for (const uid of [tr.a, tr.b]) {
    const u = users.get(uid);
    if (u && u.trade === tr.id) { u.trade = null; send(u.ws, { t: 'cancelled', id: tr.id, why }); }
  }
}
const cnt = (arr, id) => arr.reduce((n, x) => n + (x === id ? 1 : 0), 0);
const removeMulti = (arr, items) => { const r = [...arr]; for (const g of items) { const i = r.indexOf(g); if (i >= 0) r.splice(i, 1); } return r; };
const hasAll = (own, items) => [...new Set(items)].every(g => cnt(items, g) <= cnt(own, g));
const isSk = x => String(x).startsWith('s:');
const gunsOf = a => a.filter(x => !isSk(x));
const skinsOf = a => a.filter(isSk).map(x => x.slice(2));
const fixDoc = (D, ng, recv, nsk) => {
  let h = Array.isArray(D.hotbar) ? D.hotbar.slice(0, 5) : [];
  while (h.length < 5) h.push('');
  const used = {};
  h = h.map(g => { if (!g) return ''; used[g] = (used[g] || 0) + 1; return used[g] <= cnt(ng, g) ? g : ''; });
  for (const g of recv) { if (h.includes(g)) continue; const i = h.indexOf(''); if (i >= 0) h[i] = g; }
  return { guns: ng, skins: nsk, hotbar: h, gun: ng.includes(D.gun) ? D.gun : 'pistol', skin: nsk.includes(D.skin) ? D.skin : 'default' };
};
async function execute(tr) {
  tr.busy = true;
  try {
    const ra = fs.doc('users/' + tr.a), rb = fs.doc('users/' + tr.b);
    await fs.runTransaction(async t => {
      const [sa, sb] = await Promise.all([t.get(ra), t.get(rb)]);
      if (!sa.exists || !sb.exists) throw new Error('A player save was not found');
      const A = sa.data(), B = sb.data(), ga = [...(A.guns || []), ...(A.skins || []).map(x => 's:' + x)], gb = [...(B.guns || []), ...(B.skins || []).map(x => 's:' + x)];
      const oa = tr.offers[tr.a], ob = tr.offers[tr.b];
      if (!oa.length && !ob.length) throw new Error('Nothing to trade');
      if ([...oa, ...ob].some(x => x === 'pistol' || x === 's:default')) throw new Error('The starter pistol cannot be traded');
      if (!hasAll(ga, oa) || !hasAll(gb, ob)) throw new Error('A player no longer owns an offered item');
      const remA = removeMulti(ga, oa), remB = removeMulti(gb, ob);
      const na = [...remA, ...ob], nb = [...remB, ...oa];
      const nextA = { ...A, ...fixDoc(A, gunsOf(na), gunsOf(ob), skinsOf(na)) };
      const nextB = { ...B, ...fixDoc(B, gunsOf(nb), gunsOf(oa), skinsOf(nb)) };
      const gotA = ob.filter(x => !isSk(x)), gotB = oa.filter(x => !isSk(x));
      registerDiscoveries(nextA, gotA); registerDiscoveries(nextB, gotB);
      t.update(ra, { ...fixDoc(A, gunsOf(na), gunsOf(ob), skinsOf(na)), discoveredGuns: nextA.discoveredGuns, indexGemMilestones: nextA.indexGemMilestones, gems: nextA.gems ?? numberAtLeastZero(A.gems), updated: FV.serverTimestamp() });
      t.update(rb, { ...fixDoc(B, gunsOf(nb), gunsOf(oa), skinsOf(nb)), discoveredGuns: nextB.discoveredGuns, indexGemMilestones: nextB.indexGemMilestones, gems: nextB.gems ?? numberAtLeastZero(B.gems), updated: FV.serverTimestamp() });
    });
    clearTimeout(tr.to); trades.delete(tr.id);
    for (const uid of [tr.a, tr.b]) { const u = users.get(uid); if (u) { u.trade = null; send(u.ws, { t: 'done', id: tr.id }); } }
  } catch (e) {
    tr.busy = false; tr.ready[tr.a] = tr.ready[tr.b] = false;
    for (const uid of [tr.a, tr.b]) send(users.get(uid)?.ws, { t: 'err', m: e.message || 'Trade failed' });
    pushState(tr);
  }
}
async function ownedGuns(uid) {
  const s = await fs.doc('users/' + uid).get();
  if (!s.exists) return [];
  const d = s.data();
  return [...(Array.isArray(d.guns) ? d.guns : []), ...(Array.isArray(d.skins) ? d.skins : []).map(x => 's:' + x)];
}

async function onMsg(ws, m) {
  if (m.t === 'auth') {
    if (ws.uid) return;
    let dec; try { dec = await admin.auth().verifyIdToken(String(m.token)); } catch (e) { send(ws, { t: 'err', m: 'Auth failed' }); return ws.close(); }
    const uid = dec.uid;
    gfirst.set(uid, cleanName(String(dec.name || '').trim().split(' ')[0]));
    let name = await resolveName(uid);
    const old = users.get(uid); if (old && old.ws !== ws) { try { old.ws.close(); } catch (e) {} }
    ws.uid = uid; users.set(uid, { ws, name, trade: null });
    rtdb.ref('presence/' + uid).set({ name, ts: Date.now() }).catch(() => {});
    return send(ws, { t: 'ready', name });
  }
  const uid = ws.uid, me = users.get(uid); if (!uid || !me) return;

  if (m.t === 'name') {  // client changed username: refresh
    me.name = await resolveName(uid);
    rtdb.ref('presence/' + uid).set({ name: me.name, ts: Date.now() }).catch(() => {});
    return send(ws, { t: 'ready', name: me.name });
  }
  if (m.t === 'invite') {
    const q = cleanName(m.name).toLowerCase();
    if (!String(m.name || '').trim()) return send(ws, { t: 'err', m: 'Type a player name first' });
    const hits = [...users.entries()].filter(([id, u]) => id !== uid && u.name.toLowerCase() === q);
    if (hits.length > 1) return send(ws, { t: 'err', m: 'More than one player has that name - ask them to set a unique username' });
    if (!hits.length) return send(ws, { t: 'err', m: 'No online player named "' + cleanName(m.name) + '"' });
    const to = hits[0][0], you = hits[0][1];
    if (me.trade || you.trade) return send(ws, { t: 'err', m: 'You or that player is already in a trade' });
    const tr = { id: crypto.randomBytes(6).toString('hex'), a: uid, b: to, active: false, offers: { [uid]: [], [to]: [] }, ready: { [uid]: false, [to]: false }, busy: false };
    tr.to = setTimeout(() => endTrade(tr, 'Invite expired'), 60000);
    trades.set(tr.id, tr); me.trade = you.trade = tr.id;
    send(ws, { t: 'sent', id: tr.id, name: you.name });
    return send(you.ws, { t: 'invite', id: tr.id, from: uid, name: me.name });
  }
  const tr = trades.get(String(m.id));
  if (!tr || (tr.a !== uid && tr.b !== uid)) return;
  if (tr.busy) return;
  if (m.t === 'cancel' || (m.t === 'decline' && tr.b === uid && !tr.active)) return endTrade(tr, m.t === 'decline' ? 'Invite declined' : 'Trade cancelled');
  if (m.t === 'accept' && tr.b === uid && !tr.active) {
    tr.active = true; clearTimeout(tr.to); tr.to = setTimeout(() => endTrade(tr, 'Trade timed out'), 10 * 60000);
    for (const id of [tr.a, tr.b]) send(users.get(id)?.ws, { t: 'start', id: tr.id, with: other(tr, id), name: users.get(other(tr, id))?.name || 'Player' });
    return pushState(tr);
  }
  if (!tr.active || tr.busy) return;
  if (m.t === 'offer') {
    const g = Array.isArray(m.guns) ? m.guns.map(String).slice(0, 8) : [];
    if (g.includes('pistol') || g.includes('s:default')) return send(ws, { t: 'err', m: 'The starter pistol and default skin cannot be traded' });
    const own = await ownedGuns(uid);
    if (!hasAll(own, g)) return send(ws, { t: 'err', m: 'You do not own one of those items' });
    tr.offers[uid] = g; tr.ready[tr.a] = tr.ready[tr.b] = false;
    return pushState(tr);
  }
  if (m.t === 'ready') {
    tr.ready[uid] = !!m.v;
    pushState(tr);
    if (tr.ready[tr.a] && tr.ready[tr.b]) execute(tr);
  }
}

wss.on('connection', ws => {
  ws.alive = true; ws.on('pong', () => { ws.alive = true; });
  const authT = setTimeout(() => { if (!ws.uid) ws.close(); }, 10000);
  ws.on('message', d => { let m; try { m = JSON.parse(d); } catch (e) { return; } onMsg(ws, m).catch(e => console.error(e)); });
  ws.on('close', () => {
    clearTimeout(authT);
    const uid = ws.uid, u = uid && users.get(uid);
    if (u && u.ws === ws) {
      if (u.trade) { const tr = trades.get(u.trade); if (tr && !tr.busy) endTrade(tr, 'The other player disconnected'); }
      users.delete(uid); rtdb.ref('presence/' + uid).remove().catch(() => {});
    }
  });
});
setInterval(() => wss.clients.forEach(ws => { if (!ws.alive) return ws.terminate(); ws.alive = false; ws.ping(); }), 25000);

rtdb.ref('presence').remove().catch(() => {});  // clear stale presence from before a restart
server.listen(process.env.PORT || 8080, () => console.log('CrateMaster server listening'));
