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
const LB_FIELDS = { money: 'coins', gems: 'gems', kills: 'kills', xp: 'xp', wave: 'best' };
const lbCache = new Map();
async function leaderboard(type = 'money', force = false) {
  const field = LB_FIELDS[type] || LB_FIELDS.money;
  const cached = lbCache.get(type);
  if (!force && cached && Date.now() - cached.at < 10000) return cached.data;

  // XP and KittyGems were added after the first player saves. Firestore
  // orderBy() omits documents missing that field, so read all saves for both
  // boards and rank them in memory. Other boards keep their bounded query.
  const usersRef = fs.collection('users');
  const snap = (field === 'xp' || field === 'gems')
    ? await usersRef.get()
    : await usersRef.orderBy(field, 'desc').limit(50).get();
  const data = [];
  snap.forEach(d => {
    const x = d.data() || {};
    const coins = Math.max(0, Number(x.coins) || 0);
    const kills = Math.max(0, Number(x.kills) || 0);
    const rawXp = x.xp ?? x.experience ?? x.totalXp ?? x.totalXP ?? 0;
    const xp = Math.max(0, Number(rawXp) || 0);
    const gems = Math.max(0, Number(x.gems) || 0);
    const best = Math.max(0, Number(x.best) || 0);
    const score = field === 'coins' ? coins : field === 'gems' ? gems : field === 'kills' ? kills : field === 'xp' ? xp : best;
    // Keep level-1 / 0-XP users visible on the XP board. The other rankings
    // only show players who have actually earned a score.
    if (score <= 0 && field !== 'xp') return;
    data.push({
      uid: d.id,
      name: cleanName(x.username || x.displayName),
      coins: Math.floor(coins),
      gems: Math.floor(gems),
      kills: Math.floor(kills),
      xp: Math.floor(xp),
      level: Math.floor(Math.sqrt(xp / 60)) + 1,
      best: Math.floor(best)
    });
  });
  const scoreOf = p => field === 'coins' ? p.coins : field === 'gems' ? p.gems : field === 'kills' ? p.kills : field === 'xp' ? p.xp : p.best;
  data.sort((a, b) => scoreOf(b) - scoreOf(a) || b.kills - a.kills || b.xp - a.xp);
  const result = data.slice(0, 25);
  lbCache.set(type, { at: Date.now(), data: result });
  return result;
}
const CATALOG = require('./catalog.json');
const EVENT_GUN_CATALOG = CATALOG.eventGuns || {};
// ADMIN-rank weapons: only dropped by the Admin Crate (needs Admin Keys + the AdminLuck event). Keep identical to app.js.
const ADMIN_GUN_CATALOG = {
  admin_banhammer: { n: 'Ban Hammer', r: 'legendary', rank: 'ADMIN', admin: true, d: 38, f: 0.7, p: 9, s: 0.07, a: 0, l: 1.2, family: 'shotgun', design: 5400, series: 'admin-exclusive' },
  admin_sudo_rifle: { n: 'Sudo Rifle', r: 'legendary', rank: 'ADMIN', admin: true, d: 46, f: 0.1, p: 1, s: 0.008, a: 1, l: 1.3, family: 'rifle', design: 5401, series: 'admin-exclusive' },
  admin_root_access: { n: 'Root Access', r: 'legendary', rank: 'ADMIN', admin: true, d: 30, f: 0.06, p: 1, s: 0.012, a: 1, l: 1.0, family: 'smg', design: 5402, series: 'admin-exclusive' },
  admin_kernel_panic: { n: 'Kernel Panic', r: 'legendary', rank: 'ADMIN', admin: true, d: 34, f: 0.07, p: 1, s: 0.02, a: 1, l: 1.45, family: 'lmg', design: 5403, series: 'admin-exclusive' },
  admin_decree: { n: "Admin's Decree", r: 'legendary', rank: 'ADMIN', admin: true, d: 120, f: 0.8, p: 1, s: 0.001, a: 0, l: 1.6, family: 'sniper', design: 5404, series: 'admin-exclusive' }
};
const GUN_CATALOG = { ...(CATALOG.guns || {}), ...EVENT_GUN_CATALOG, ...ADMIN_GUN_CATALOG };
const SKIN_CATALOG = CATALOG.skins || {};
const ECON_CRATES = {
  basic: { n: 'Basic Crate', cost: 100, w: [60, 28, 10, 2] },
  elite: { n: 'Elite Crate', cost: 300, w: [0, 50, 35, 15] },
  legend: { n: 'Legendary Crate', cost: 1000, w: [0, 0, 25, 75] },
  spooky: { n: 'Spooky Crate', cost: 500, w: [40, 30, 20, 10], ltd: true },
  og: { n: 'OG Crate', cost: 500, w: [35, 30, 25, 10], ltd: true },
  easter: { n: 'Easter Crate', cost: 650, w: [50, 30, 15, 5], ltd: true },
  popsicle: { n: 'Popsicle Crate', cost: 700, w: [45, 30, 20, 5], ltd: true },
  clover: { n: 'Clover Crate', cost: 750, w: [40, 30, 20, 10], ltd: true },
  christmas: { n: 'Christmas Crate', cost: 900, w: [30, 30, 25, 15], ltd: true }
};

// Ensure every Limited Crates config document exists automatically. Existing
// prices and enabled flags are preserved; only missing/invalid fields are filled
// with safe defaults. Admin SDK writes bypass client Firestore rules.
async function ensureLimitedCrateDocuments() {
  const limitedEntries = Object.entries(ECON_CRATES).filter(([, crate]) => crate.ltd);
  const outcomes = await Promise.all(limitedEntries.map(async ([id, crate]) => {
    const ref = fs.collection('Limited Crates').doc(id);
    return fs.runTransaction(async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        tx.create(ref, { enabled: false, cost: crate.cost });
        return 'created';
      }
      const current = snap.data() || {};
      const patch = {};
      if (typeof current.enabled !== 'boolean') patch.enabled = false;
      if (!Number.isSafeInteger(current.cost) || current.cost < 1 || current.cost > 1000000) {
        patch.cost = crate.cost;
      }
      if (Object.keys(patch).length) {
        tx.set(ref, patch, { merge: true });
        return 'repaired';
      }
      return 'unchanged';
    });
  }));
  return {
    created: outcomes.filter(x => x === 'created').length,
    repaired: outcomes.filter(x => x === 'repaired').length,
    existing: outcomes.filter(x => x === 'unchanged').length
  };
}
const RARITIES = ['common', 'rare', 'epic', 'legendary'];
const GEM_CRATE = { cost: 25, weights: { common: 50, rare: 25, epic: 15, legendary: 8, gem: 2 } };
const WEB_CRATES = { basic:{name:'Basic Web Crate',cost:100,weights:[65,25,9,1]}, elite:{name:'Elite Web Crate',cost:350,weights:[0,55,32,13]}, legendary:{name:'Legendary Web Crate',cost:1000,weights:[0,0,25,75]}, limited_spooky:{name:'Spooky Web Crate',cost:700,weights:[35,30,23,12],limited:true,source:'spooky'}, limited_og:{name:'OG Web Crate',cost:700,weights:[30,30,25,15],limited:true,source:'og'}, limited_easter:{name:'Easter Web Crate',cost:800,weights:[35,30,23,12],limited:true,source:'easter'}, limited_popsicle:{name:'Popsicle Web Crate',cost:850,weights:[35,30,22,13],limited:true,source:'popsicle'}, limited_clover:{name:'Clover Web Crate',cost:900,weights:[30,30,25,15],limited:true,source:'clover'}, limited_christmas:{name:'Christmas Web Crate',cost:1100,weights:[25,30,25,20],limited:true,source:'christmas'} };
async function webCrateConfig(key){const base=WEB_CRATES[key];if(!base)throw Object.assign(new Error('Unknown Web Crate.'),{status:404});if(base.limited){const snap=await fs.doc('Limited Crates/'+base.source).get();if(!snap.exists||snap.data().enabled!==true)throw Object.assign(new Error('This limited Web Crate is not active.'),{status:404});return {...base,cost:base.cost};}return base;}
function rollWebCrate(crate){const normalIds=Object.keys(GUN_CATALOG).filter(id=>{const g=GUN_CATALOG[id]||{};return !g.admin&&!g.secret&&!g.gem&&!g.x;});const eventIds=crate.limited?Object.keys(GUN_CATALOG).filter(id=>(GUN_CATALOG[id]||{}).x===crate.source):[];const bands=['common','rare','epic','legendary'];let roll=crypto.randomInt(0,10000)/100,rarity='common';for(let i=0;i<4;i++){roll-=crate.weights[i]||0;if(roll<0){rarity=bands[i];break;}}let pool=crate.limited&&rarity==='legendary'&&eventIds.length?eventIds.filter(id=>String(GUN_CATALOG[id].r||'common').toLowerCase()===rarity):[];if(!pool.length)pool=normalIds.filter(id=>String(GUN_CATALOG[id].r||'common').toLowerCase()===rarity);if(!pool.length)pool=normalIds.filter(id=>String(GUN_CATALOG[id].r||'common').toLowerCase()==='common');if(!pool.length)pool=eventIds;if(!pool.length)throw new Error('This Web Crate has no valid weapon drops.');const id=pool[crypto.randomInt(pool.length)];return {type:'guns',id,name:GUN_CATALOG[id].n,rarity:GUN_CATALOG[id].r||rarity};}
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
function catalogueList(values, catalogue, fallback) {
  // Preserve duplicate copies in inventories; only remove IDs outside the catalogue.
  const valid = (Array.isArray(values) ? values : []).filter(id => typeof id === 'string' && Object.prototype.hasOwnProperty.call(catalogue, id));
  if (fallback && Object.prototype.hasOwnProperty.call(catalogue, fallback) && !valid.includes(fallback)) valid.unshift(fallback);
  return valid;
}
function sanitizePlayerCatalogue(data) {
  data.guns = catalogueList(data.guns, GUN_CATALOG, 'pistol');
  data.skins = catalogueList(data.skins, SKIN_CATALOG, 'default');
  if (!data.guns.includes(data.gun)) data.gun = 'pistol';
  if (!data.skins.includes(data.skin)) data.skin = 'default';
  const hotbar = Array.isArray(data.hotbar) ? data.hotbar.slice(0, 5) : [];
  while (hotbar.length < 5) hotbar.push('');
  const used = {};
  data.hotbar = hotbar.map(id => {
    if (!id || !data.guns.includes(id)) return '';
    used[id] = (used[id] || 0) + 1;
    return used[id] <= data.guns.filter(x => x === id).length ? id : '';
  });
  const discovered = new Set((Array.isArray(data.discoveredGuns) ? data.discoveredGuns : []).filter(id => typeof id === 'string' && Object.prototype.hasOwnProperty.call(GUN_CATALOG, id)));
  for (const id of data.guns) discovered.add(id);
  data.discoveredGuns = [...discovered];
  delete data.newGuns;
}
function isGemGun(g) { return !!(g && (g.gem || g.rank === 'GEM' || g.r === 'gem')); }
function isSecretGun(g) { return !!(g && (g.secret || g.rank === 'SECRET' || g.r === 'secret')); }
function isAdminGun(g) { return !!(g && (g.admin || g.rank === 'ADMIN')); }
function isLimitedGun(g) { return !!(g && !isSecretGun(g) && !isAdminGun(g) && (g.limited || g.rank === 'LIMITED' || g.x)); }
function normalGunIds() { return Object.keys(GUN_CATALOG).filter(id => !isGemGun(GUN_CATALOG[id]) && !isLimitedGun(GUN_CATALOG[id]) && !isSecretGun(GUN_CATALOG[id]) && !isAdminGun(GUN_CATALOG[id])); }
function collectionBoostUnlocked(data) {
  // Any 500 distinct, valid catalogue weapons count: normal, GEM, LIMITED or SECRET.
  // Unknown/stale IDs and duplicate copies never increase the discovery count.
  const found = new Set((Array.isArray(data.discoveredGuns) ? data.discoveredGuns : [])
    .filter(id => typeof id === 'string' && Object.prototype.hasOwnProperty.call(GUN_CATALOG, id)));
  return found.size >= 500;
}
function registerDiscoveries(data, ids) {
  // Only catalogue-backed IDs count toward permanent Index milestones.
  const found = new Set((Array.isArray(data.discoveredGuns) ? data.discoveredGuns : []).filter(id => typeof id === 'string' && GUN_CATALOG[id]));
  const fresh = [];
  for (const id of ids) {
    if (!GUN_CATALOG[id] || found.has(id)) continue;
    found.add(id);
    fresh.push(id);
  }
  data.discoveredGuns = [...found];
  const target = Math.floor(found.size / 10);
  const claimed = numberAtLeastZero(data.indexGemMilestones);
  const milestones = Math.max(claimed, target);
  const earned = Math.max(0, milestones - claimed) * 10;
  if (earned) data.gems = numberAtLeastZero(data.gems) + earned;
  data.indexGemMilestones = milestones;
  return { indexGems: earned };
}
function playerView(data) {
  const clean = { ...data };
  sanitizePlayerCatalogue(clean);
  const scalarDefaults = { coins: 250, gems: 0, webCredits: 0, multiplayerWins: 0, multiplayerLosses: 0, multiplayerKills: 0, multiplayerHeadshots: 0, adminKeys: 0, indexGemMilestones: 0, best: 0, kills: 0, xp: 0, runs: 0, gun: 'pistol', skin: 'default' };
  const out = {
    guns: [...clean.guns], skins: [...clean.skins], discoveredGuns: [...clean.discoveredGuns],
    hotbar: [...clean.hotbar]
  };
  for (const [key, fallback] of Object.entries(scalarDefaults)) out[key] = clean[key] ?? fallback;
  return out;
}
async function ensurePlayer(uid) {
  const ref = fs.doc('users/' + uid);
  await fs.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      tx.set(ref, {
        coins: 250, gems: 0, webCredits: 0, multiplayerWins: 0, multiplayerLosses: 0, multiplayerKills: 0, multiplayerHeadshots: 0, adminKeys: 0, discoveredGuns: ['pistol'], indexGemMilestones: 0,
        guns: ['pistol'], skins: ['default'], gun: 'pistol', skin: 'default', hotbar: ['pistol', '', '', '', ''],
        best: 0, kills: 0, xp: 0, runs: 0, sens: 1, vol: 1, bloom: true,
        username: '', displayName: '', updated: FV.serverTimestamp()
      });
      return;
    }
    const d = snap.data() || {}, patch = {};
    if (Object.prototype.hasOwnProperty.call(d, 'newGuns')) patch.newGuns = FV.delete();
    const defaults = { coins: 250, gems: 0, webCredits: 0, multiplayerWins: 0, multiplayerLosses: 0, multiplayerKills: 0, multiplayerHeadshots: 0, adminKeys: 0, guns: ['pistol'], skins: ['default'], gun: 'pistol', skin: 'default', hotbar: ['pistol', '', '', '', ''], best: 0, kills: 0, xp: 0, runs: 0, sens: 1, vol: 1, bloom: true, username: '', displayName: '' };
    for (const [k, v] of Object.entries(defaults)) if (d[k] === undefined || d[k] === null) patch[k] = v;
    // Sanitize existing numeric values before the server-owned economy is used.
    for (const k of ['coins', 'gems', 'webCredits', 'multiplayerWins', 'multiplayerLosses', 'multiplayerKills', 'multiplayerHeadshots', 'adminKeys', 'best', 'kills', 'xp', 'runs']) {
      const safe = numberAtLeastZero(d[k] === undefined || d[k] === null ? defaults[k] : d[k]);
      if (d[k] !== safe) patch[k] = safe;
    }
    const safeSetting = (value, fallback, min, max) => { const n = Number(value); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback; };
    const sens = safeSetting(d.sens, 1, 0.3, 3), vol = safeSetting(d.vol, 1, 0, 1);
    if (d.sens !== sens) patch.sens = sens;
    if (d.vol !== vol) patch.vol = vol;
    if (typeof d.bloom !== 'boolean') patch.bloom = true;
    if (typeof d.username !== 'string') patch.username = '';
    const lowerName = String(typeof d.username === 'string' ? d.username : '').trim().toLowerCase();
    if (d.usernameLower !== lowerName) patch.usernameLower = lowerName;
    if (typeof d.displayName !== 'string') patch.displayName = '';
    // Permanently prune every weapon that is not in the exact 500-gun catalogue.
    const owned = catalogueList(d.guns, GUN_CATALOG, 'pistol');
    if (JSON.stringify(owned) !== JSON.stringify(d.guns || [])) patch.guns = owned;
    const skins = catalogueList(d.skins, SKIN_CATALOG, 'default');
    if (JSON.stringify(skins) !== JSON.stringify(d.skins || [])) patch.skins = skins;
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
    // Preserve previously credited milestones while preventing unknown IDs from counting going forward.
    const claimed = numberAtLeastZero(d.indexGemMilestones);
    const milestones = Math.max(claimed, target);
    const earned = Math.max(0, milestones - claimed) * 10;
    patch.discoveredGuns = [...found];
    patch.indexGemMilestones = milestones;
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
function eventDropPool(crateKey, kind) {
  return Object.entries(GUN_CATALOG).filter(([id, gun]) => gun.x === crateKey && (kind === 'secret' ? isSecretGun(gun) : isLimitedGun(gun)));
}
function rollNormalCrate(crateKey, crate, luck = false) {
  // Hidden event outcomes are separate from the public rarity meter:
  // Secret = 0.001% and Limited = 2.000% total per Limited Crate.
  // Ranges are exclusive: 10 / 1,000,000 Secret, then 20,000 / 1,000,000 Limited.
  if (crate.ltd) {
    const special = crypto.randomInt(0, 1000000);
    // AdminLuck event: Secret 0.5% (normally 0.001%), Limited 3% (normally 2%).
    const secretCut = luck ? 5000 : 10, limitedCut = secretCut + (luck ? 30000 : 20000);
    if (special < secretCut) {
      const pool = eventDropPool(crateKey, 'secret');
      if (pool.length) {
        const [id, gun] = pool[crypto.randomInt(0, pool.length)];
        return { type: 'guns', id, rarity: 'secret', name: gun.n, secret: true, limited: false, gem: false };
      }
    } else if (special < limitedCut) {
      const pool = eventDropPool(crateKey, 'limited');
      if (pool.length) {
        const [id, gun] = pool[crypto.randomInt(0, pool.length)];
        return { type: 'guns', id, rarity: 'limited', name: gun.n, secret: false, limited: true, gem: false };
      }
    }
  }

  // AdminLuck event: Legendary weight +30%.
  const rarity = RARITIES[pickWeighted(luck ? crate.w.map((v, i) => (i === 3 ? v * 1.3 : v)) : crate.w)];
  const pool = [];
  for (const [id, gun] of Object.entries(GUN_CATALOG)) {
    if (id === 'pistol' || gun.r !== rarity || isGemGun(gun) || isLimitedGun(gun) || isSecretGun(gun) || isAdminGun(gun)) continue;
    pool.push({ type: 'guns', id, rarity, name: gun.n, limited: false, secret: false, gem: false });
  }
  for (const [id, skin] of Object.entries(SKIN_CATALOG)) if (id !== 'default' && skin.r === rarity) pool.push({ type: 'skins', id, rarity, name: skin.n });
  if (!pool.length) throw new Error('This crate has no valid standard drops. Contact the game owner.');
  return pool[crypto.randomInt(0, pool.length)];
}
function rollGemCrate(luck = false) {
  // Hidden Gem Crate Secret: 0.01% per opening (1 in 10,000).
  // This roll is separate from GEM_CRATE.weights, so it never appears in the public rarity meter.
  const secretPool = Object.entries(GUN_CATALOG).filter(([id, gun]) => gun.x === 'gem' && isSecretGun(gun));
  if (secretPool.length && crypto.randomInt(0, 10000) < (luck ? 50 : 1)) { // AdminLuck: 0.5% instead of 0.01%
    const [id, gun] = secretPool[crypto.randomInt(0, secretPool.length)];
    return { type: 'guns', id, rarity: 'secret', name: gun.n, secret: true, limited: false, gem: false };
  }
  const rarities = Object.keys(GEM_CRATE.weights), weights = rarities.map(r => GEM_CRATE.weights[r] * (luck && r === 'legendary' ? 1.3 : 1));
  const rarity = rarities[pickWeighted(weights)];
  const pool = Object.entries(GUN_CATALOG).filter(([id, gun]) => gun.gemStore && (isGemGun(gun) ? rarity === 'gem' : gun.r === rarity));
  if (!pool.length) throw new Error('The Gem Crate drop pool is not configured correctly.');
  const [id, gun] = pool[crypto.randomInt(0, pool.length)];
  return { type: 'guns', id, rarity, name: gun.n, limited: false, secret: false, gem: isGemGun(gun) };
}
// ---------------------------------------------------------------------------
// Events: Firestore collection "Events", one doc per event, field enabled:true/false.
// Currently: "AdminLuck". Created automatically (disabled) on server start.
// ---------------------------------------------------------------------------
const EVENT_NAMES = ['AdminLuck'], eventCache = new Map();
async function eventActive(name) {
  const hit = eventCache.get(name);
  if (hit && Date.now() - hit.at < 15000) return hit.on;
  let on = false;
  try { const snap = await fs.doc('Events/' + name).get(); on = !!(snap.exists && (snap.data() || {}).enabled === true); }
  catch (e) { console.error('Event lookup failed:', name, e.message); on = hit ? hit.on : false; }
  eventCache.set(name, { at: Date.now(), on });
  return on;
}
async function ensureEventDocuments() {
  for (const name of EVENT_NAMES) {
    const ref = fs.doc('Events/' + name);
    await fs.runTransaction(async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists) tx.create(ref, { enabled: false });
      else if (typeof (snap.data() || {}).enabled !== 'boolean') tx.set(ref, { enabled: false }, { merge: true });
    });
  }
}
async function eventsView() { return { adminLuck: await eventActive('AdminLuck') }; }
// Admin Crate: costs 1 Admin Key per opening, only while AdminLuck is active.
const ADMIN_CRATE_WEIGHTS = { epic: 35, legendary: 60, gem: 3, admin: 2 };
function rollAdminCrate() {
  const ranks = Object.keys(ADMIN_CRATE_WEIGHTS), rank = ranks[pickWeighted(ranks.map(k => ADMIN_CRATE_WEIGHTS[k]))];
  const pool = Object.entries(GUN_CATALOG).filter(([id, gun]) => {
    if (id === 'pistol') return false;
    if (rank === 'admin') return isAdminGun(gun);
    if (rank === 'gem') return isGemGun(gun) && gun.gemStore;
    return gun.r === rank && !isGemGun(gun) && !isLimitedGun(gun) && !isSecretGun(gun) && !isAdminGun(gun);
  });
  if (!pool.length) throw new Error('The Admin Crate drop pool is not configured correctly.');
  const [id, gun] = pool[crypto.randomInt(0, pool.length)];
  return { type: 'guns', id, rarity: rank, name: gun.n, limited: false, secret: false, gem: rank === 'gem', admin: rank === 'admin' };
}
function itemValue(type, id) {
  if (type === 'guns') {
    const g = GUN_CATALOG[id]; if (!g) return 0;
    if (isAdminGun(g)) return 1000;
    if (isSecretGun(g)) return 500;
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
  if (completeBefore && item.type === 'guns' && (item.rarity === 'legendary' || item.limited || item.secret || item.gem || item.admin) && crypto.randomInt(0, 10000) < 500) {
    data.gems = numberAtLeastZero(data.gems) + 1; bonusGem = true;
  }
  return { ...item, bonusGem, indexGems: ix.indexGems };
}
// Economy changes are applied atomically to the player save. If a client
// repeats a request after an ambiguous timeout, it is treated as a new action.
async function updatePlayerEconomy(uid, mutator) {
  const userRef = fs.doc('users/' + uid);
  const result = await fs.runTransaction(async tx => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) throw Object.assign(new Error('Player save not found. Reload the game.'), { status: 404 });
    const data = userSnap.data() || {};
    sanitizePlayerCatalogue(data);
    const outcome = await mutator(data, tx);
    data.updated = FV.serverTimestamp();
    const writeData = { ...data, newGuns: FV.delete() };
    tx.set(userRef, writeData, { merge: true });
    return { ...outcome, player: playerView(data) };
  });
  lbCache.delete('gems');
  return result;
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

// ---------------------------------------------------------------------------
// Buying KittyGems with Tikkie (manual approval)
//   Firestore  "Gem Shop/tikkie"  -> { url: "https://tikkie.me/pay/..." }  (you replace it every ~2 weeks)
//   Firestore  "gemOrders/{id}"   -> created by this server only (Admin SDK)
//   Env: FORMSPREE_ENDPOINT (https://formspree.io/f/xxxx), GEM_APPROVE_SECRET (long random string),
//        PUBLIC_SERVER_URL (default https://cratemaster.onrender.com)
// Order status: pending -> completed (you approve, or 30 days pass) | rejected
//   Setting status to "approved" by hand in the Firestore console also works; it is credited on the next sweep.
// ---------------------------------------------------------------------------
const GEM_PACK = { gems: 200, euro: 2 };
const GEM_ORDERS = 'gemOrders', DAY_MS = 86400000, GEM_AUTO_DAYS = 30, GEM_MAX_OPEN_ORDERS = 3;
const PUBLIC_SERVER_URL = (process.env.PUBLIC_SERVER_URL || 'https://cratemaster.onrender.com').replace(/\/+$/, '');
const APPROVE_SECRET = process.env.GEM_APPROVE_SECRET || '';
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || '';
const approveSig = id => crypto.createHmac('sha256', APPROVE_SECRET).update('gem-order:' + id).digest('hex');
function validApproveSig(id, sig) {
  if (!APPROVE_SECRET || !/^[a-f0-9]{64}$/i.test(String(sig || ''))) return false;
  return crypto.timingSafeEqual(Buffer.from(approveSig(id)), Buffer.from(String(sig).toLowerCase()));
}
const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function newOrderCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'CM-' + Array.from({ length: 6 }, () => alphabet[crypto.randomInt(0, alphabet.length)]).join('');
}
async function currentTikkieUrl() {
  const snap = await fs.doc('Gem Shop/tikkie').get();
  let url; try { url = new URL(String((snap.exists && (snap.data() || {}).url) || '').trim()); } catch { return ''; }
  return url.protocol === 'https:' && /^(www\.)?tikkie\.me$/i.test(url.hostname) ? url.toString() : '';
}
async function emailGemOrder(order) {
  if (!FORMSPREE_ENDPOINT) { console.warn('FORMSPREE_ENDPOINT is not set; order email not sent'); return false; }
  const lines = [
    `New KittyGem order ${order.code}: ${order.gems} gems for EUR ${order.euro}`,
    '',
    `Payer name (as in Tikkie/bank): ${order.payerName}`,
    `Google account: ${order.email || '(unknown)'}`,
    `In-game name: ${order.gameName || '(none)'}`,
    `User id: ${order.uid}`,
    `Ordered: ${new Date(order.createdAtMs).toISOString()}`,
    `Auto-credited on: ${new Date(order.createdAtMs + GEM_AUTO_DAYS * DAY_MS).toISOString()}`,
    '',
    APPROVE_SECRET
      ? `When the money is in your account, approve or reject here:\n${PUBLIC_SERVER_URL}/gems/approve?order=${order.id}&sig=${approveSig(order.id)}`
      : `Approve in the Firestore console: collection ${GEM_ORDERS}, document ${order.id}, set status to "approved".`
  ];
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: `CrateMaster gem order ${order.code} (EUR ${order.euro})`, email: order.email || undefined, name: order.payerName, message: lines.join('\n') }),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) console.error('Formspree rejected the order email:', res.status, (await res.text()).slice(0, 300));
    return res.ok;
  } catch (e) { console.error('Formspree request failed:', e.message); return false; }
}
// decision: 'approve' (owner), 'auto' (30 days passed) or 'reject'. Idempotent: an order is only ever credited once.
async function settleGemOrder(orderId, decision) {
  const orderRef = fs.doc(GEM_ORDERS + '/' + orderId);
  const out = await fs.runTransaction(async tx => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) return { status: 'missing', changed: false };
    const o = snap.data() || {};
    if (o.status !== 'pending' && o.status !== 'approved') return { status: o.status, changed: false };
    if (decision === 'reject') { tx.update(orderRef, { status: 'rejected', resolvedAtMs: Date.now() }); return { status: 'rejected', changed: true }; }
    const userRef = fs.doc('users/' + o.uid), userSnap = await tx.get(userRef);
    if (!userSnap.exists) return { status: o.status, changed: false };
    tx.update(userRef, { gems: numberAtLeastZero((userSnap.data() || {}).gems) + numberAtLeastZero(o.gems), updated: FV.serverTimestamp() });
    tx.update(orderRef, { status: 'completed', completedAtMs: Date.now(), completedBy: decision === 'auto' ? 'auto-30-days' : 'owner' });
    return { status: 'completed', changed: true };
  });
  if (out.changed) lbCache.delete('gems');
  return out;
}
function gemOrderDue(o, now) {
  if (o.status === 'approved') return 'approve';
  if (o.status === 'pending' && now - numberAtLeastZero(o.createdAtMs) >= GEM_AUTO_DAYS * DAY_MS) return 'auto';
  return '';
}
async function settleDueGemOrders(docs) {
  const now = Date.now();
  for (const d of docs) {
    const how = gemOrderDue(d.data() || {}, now);
    if (how) await settleGemOrder(d.id, how).catch(e => console.error('Gem order settle failed:', d.id, e));
  }
}
async function userGemOrderDocs(uid) { return (await fs.collection(GEM_ORDERS).where('uid', '==', uid).get()).docs; }
// Global sweep: credits approved / 30-day-old orders and re-sends emails that failed.
async function sweepGemOrders() {
  const snap = await fs.collection(GEM_ORDERS).where('status', 'in', ['pending', 'approved']).get();
  await settleDueGemOrders(snap.docs);
  for (const d of snap.docs) {
    const o = d.data() || {};
    if (o.status === 'pending' && o.emailed !== true && (await emailGemOrder({ ...o, id: d.id }))) await d.ref.update({ emailed: true }).catch(() => {});
  }
}
function gemOrderView(d) {
  const o = d.data() || {};
  return {
    id: d.id, code: o.code, status: o.status, gems: o.gems, euro: o.euro, createdAtMs: o.createdAtMs,
    autoAtMs: numberAtLeastZero(o.createdAtMs) + GEM_AUTO_DAYS * DAY_MS,
    tikkieUrl: o.status === 'pending' ? o.tikkieUrl || '' : ''
  };
}
async function gemOrdersResponse(uid) {
  const docs = await userGemOrderDocs(uid);
  await settleDueGemOrders(docs);
  const fresh = await userGemOrderDocs(uid);
  const orders = fresh.map(gemOrderView).sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 10);
  const player = playerView(await ensurePlayer(uid));
  return { ok: true, orders, player, pack: GEM_PACK, autoDays: GEM_AUTO_DAYS };
}
async function readRawBody(req) {
  let raw = '';
  for await (const part of req) { raw += part; if (raw.length > 4096) throw new Error('Request is too large'); }
  return raw;
}
function sendHtml(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' });
  res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CrateMaster order</title><body style="font:16px system-ui,sans-serif;max-width:480px;margin:40px auto;padding:0 16px;background:#0e1421;color:#e8eefc">${body}</body>`);
}
// Approve page. GET only shows the order (email scanners can prefetch links); the buttons POST.
async function handleGemApprovePage(q, r, requestUrl) {
  const isPost = q.method === 'POST';
  let id, sig, action = '';
  if (isPost) {
    const form = new URLSearchParams(await readRawBody(q));
    id = String(form.get('order') || ''); sig = form.get('sig'); action = String(form.get('action') || '');
  } else { id = String(requestUrl.searchParams.get('order') || ''); sig = requestUrl.searchParams.get('sig'); }
  if (!/^[A-Za-z0-9]{10,40}$/.test(id) || !validApproveSig(id, sig)) return sendHtml(r, 403, '<h2>Invalid or expired link</h2>');
  if (isPost) {
    if (action !== 'approve' && action !== 'reject') return sendHtml(r, 400, '<h2>Unknown action</h2>');
    const out = await settleGemOrder(id, action === 'approve' ? 'approve' : 'reject');
    const text = out.changed ? (out.status === 'completed' ? 'Approved. The gems were added to the player.' : 'Order rejected.')
      : out.status === 'missing' ? 'Order not found.' : `Nothing changed. This order is already "${escHtml(out.status)}".`;
    return sendHtml(r, 200, `<h2>${text}</h2>`);
  }
  const snap = await fs.doc(GEM_ORDERS + '/' + id).get();
  if (!snap.exists) return sendHtml(r, 404, '<h2>Order not found</h2>');
  const o = snap.data() || {};
  const form = act => `<form method="post" style="display:inline"><input type="hidden" name="order" value="${escHtml(id)}"><input type="hidden" name="sig" value="${escHtml(sig)}"><input type="hidden" name="action" value="${act}"><button style="padding:12px 20px;font-size:16px;border-radius:10px;border:0;margin-right:10px;cursor:pointer;background:${act === 'approve' ? '#2fd08a' : '#ff6b81'}">${act === 'approve' ? 'I received the money: approve' : 'Reject'}</button></form>`;
  return sendHtml(r, 200, `<h2>Order ${escHtml(o.code)}</h2><p>${escHtml(o.gems)} KittyGems for EUR ${escHtml(o.euro)}<br>Payer: <b>${escHtml(o.payerName)}</b><br>Account: ${escHtml(o.email)}<br>Status: <b>${escHtml(o.status)}</b></p>${o.status === 'pending' || o.status === 'approved' ? form('approve') + form('reject') : ''}`);
}

// ---------------------------------------------------------------------------
// Mailbox: Firestore collection "Mail" (server-only). Gifts are taken from the sender when sending
// (escrow) and given to the recipient when they claim, so the recipient can be offline.
// Anyone who owns Admin Keys can mail them (taken from their balance). ADMIN_UIDS (env, comma separated Firebase user ids) can also create keys for free.
// ---------------------------------------------------------------------------
const MAIL = 'Mail', MAIL_MAX_ITEMS = 10, MAIL_MAX_UNCLAIMED = 50, MAIL_KEEP_CLAIMED_MS = 7 * 86400000;
const ADMIN_UIDS = new Set(String(process.env.ADMIN_UIDS || '').split(',').map(x => x.trim()).filter(Boolean));
const cleanMailText = (v, max) => String(v || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
function removeOwnedItem(d, type, id) {
  const arr = Array.isArray(d[type]) ? [...d[type]] : [], at = arr.lastIndexOf(id);
  if (at < 0) throw Object.assign(new Error('You no longer own one of the items you are sending.'), { status: 409 });
  arr.splice(at, 1); d[type] = arr;
  if (type === 'guns') {
    const used = {}; let hotbar = Array.isArray(d.hotbar) ? d.hotbar.slice(0, 5) : [];
    d.hotbar = hotbar.map(g => { if (!g) return ''; used[g] = (used[g] || 0) + 1; return used[g] <= arr.filter(x => x === g).length ? g : ''; });
    while (d.hotbar.length < 5) d.hotbar.push('');
    if (!arr.includes(d.gun)) d.gun = arr.includes('pistol') ? 'pistol' : (arr[0] || 'pistol');
  } else if (!arr.includes(d.skin)) d.skin = 'default';
}
// Usernames are stored exactly as typed, so try the common letter-case spellings and then compare case-insensitively.
async function findPlayersByName(raw) {
  const name = String(raw || '').replace(/[<>&"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
  if (!name) throw Object.assign(new Error('Type a username first.'), { status: 400 });
  const variants = [...new Set([name, name.toLowerCase(), name.toUpperCase(), name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()])];
  // usernameLower is kept up to date by the server (login / rename); the letter-case variants cover saves that were not indexed yet.
  const snaps = await Promise.all([
    fs.collection('users').where('usernameLower', '==', name.toLowerCase()).limit(5).get(),
    ...variants.map(v => fs.collection('users').where('username', '==', v).limit(5).get())
  ]);
  const hits = new Map();
  for (const snap of snaps) for (const d of snap.docs) {
    const u = String((d.data() || {}).username || '').trim();
    if (u.toLowerCase() === name.toLowerCase()) hits.set(d.id, { uid: d.id, name: u });
  }
  return [...hits.values()];
}
function mailSummary(m) {
  return { coins: numberAtLeastZero(m.coins), gems: numberAtLeastZero(m.gems), guns: Array.isArray(m.guns) ? m.guns : [], skins: Array.isArray(m.skins) ? m.skins : [], adminKeys: numberAtLeastZero(m.adminKeys) };
}
async function mailboxResponse(uid) {
  const [inSnap, outSnap] = await Promise.all([
    fs.collection(MAIL).where('to', '==', uid).get(),
    fs.collection(MAIL).where('from', '==', uid).get()
  ]);
  const now = Date.now();
  const inbox = inSnap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }))
    .filter(m => !m.claimed || now - numberAtLeastZero(m.claimedAtMs) < MAIL_KEEP_CLAIMED_MS)
    .sort((a, b) => numberAtLeastZero(b.createdAtMs) - numberAtLeastZero(a.createdAtMs)).slice(0, 60)
    .map(m => ({ id: m.id, fromName: m.fromName, message: m.message || '', createdAtMs: m.createdAtMs, claimed: !!m.claimed, ...mailSummary(m) }));
  const sent = outSnap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }))
    .sort((a, b) => numberAtLeastZero(b.createdAtMs) - numberAtLeastZero(a.createdAtMs)).slice(0, 15)
    .map(m => ({ id: m.id, toName: m.toName, message: m.message || '', createdAtMs: m.createdAtMs, claimed: !!m.claimed, ...mailSummary(m) }));
  const player = playerView(await ensurePlayer(uid));
  return { ok: true, inbox, sent, unclaimed: inbox.filter(m => !m.claimed).length, canSendKeys: ADMIN_UIDS.has(uid), player };
}
async function sendMail(uid, body) {
  const hits = await findPlayersByName(body.to);
  if (!hits.length) throw Object.assign(new Error('No player has that username.'), { status: 404 });
  if (hits.length > 1) throw Object.assign(new Error('More than one player has that username. Ask them to pick a unique one.'), { status: 409 });
  const target = hits[0], isAdmin = ADMIN_UIDS.has(uid);
  if (target.uid === uid && !isAdmin) throw Object.assign(new Error('You cannot send mail to yourself.'), { status: 400 });
  const message = cleanMailText(body.message, 140);
  const coins = numberAtLeastZero(body.coins), gems = numberAtLeastZero(body.gems);
  const adminKeys = Math.min(100000, numberAtLeastZero(body.adminKeys)); // anyone who owns keys can send them; admins (ADMIN_UIDS) create them for free
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, MAIL_MAX_ITEMS + 1) : [];
  if (rawItems.length > MAIL_MAX_ITEMS) throw Object.assign(new Error(`You can attach at most ${MAIL_MAX_ITEMS} items per mail.`), { status: 400 });
  if (coins > 1e9 || gems > 1e7) throw Object.assign(new Error('That amount is too large.'), { status: 400 });
  const items = rawItems.map(it => ({ type: it && it.type === 'skins' ? 'skins' : it && it.type === 'guns' ? 'guns' : '', id: String((it && it.id) || '') }));
  for (const it of items) {
    const known = it.type === 'guns' ? GUN_CATALOG[it.id] : it.type === 'skins' ? SKIN_CATALOG[it.id] : null;
    if (!known || !/^[a-z0-9_-]{1,64}$/i.test(it.id) || it.id === 'pistol' || it.id === 'default') throw Object.assign(new Error('One of the selected items cannot be sent.'), { status: 400 });
  }
  if (!message && !coins && !gems && !adminKeys && !items.length) throw Object.assign(new Error('Write a message or attach something.'), { status: 400 });
  const waiting = (await fs.collection(MAIL).where('to', '==', target.uid).get()).docs.filter(d => !(d.data() || {}).claimed).length;
  if (waiting >= MAIL_MAX_UNCLAIMED) throw Object.assign(new Error('That player\'s mailbox is full.'), { status: 409 });
  const mailRef = fs.collection(MAIL).doc();
  const result = await updatePlayerEconomy(uid, async (d, tx) => {
    if (numberAtLeastZero(d.coins) < coins) throw Object.assign(new Error('Not enough KittyCoins.'), { status: 409 });
    if (numberAtLeastZero(d.gems) < gems) throw Object.assign(new Error('Not enough KittyGems.'), { status: 409 });
    d.coins = numberAtLeastZero(d.coins) - coins; d.gems = numberAtLeastZero(d.gems) - gems;
    if (adminKeys && !isAdmin) {
      const have = numberAtLeastZero(d.adminKeys);
      if (have < 1) throw Object.assign(new Error('Invalid request.'), { status: 400 });
      if (have < adminKeys) throw Object.assign(new Error('Not enough Admin Keys.'), { status: 409 });
      d.adminKeys = have - adminKeys;
    }
    for (const it of items) removeOwnedItem(d, it.type, it.id);
    tx.create(mailRef, {
      to: target.uid, toName: target.name, from: uid,
      fromName: cleanName(d.username || String(d.displayName || '').split(' ')[0]),
      message, coins, gems, adminKeys,
      guns: items.filter(i => i.type === 'guns').map(i => i.id), skins: items.filter(i => i.type === 'skins').map(i => i.id),
      claimed: false, createdAtMs: Date.now()
    });
    return { ok: true, sentTo: target.name };
  });
  lbCache.clear();
  return result;
}
async function claimMail(uid, id) {
  if (!/^[A-Za-z0-9]{10,40}$/.test(id)) throw Object.assign(new Error('Invalid mail.'), { status: 400 });
  const mailRef = fs.doc(MAIL + '/' + id);
  const result = await updatePlayerEconomy(uid, async (d, tx) => {
    const snap = await tx.get(mailRef), m = snap.exists ? snap.data() || {} : null;
    if (!m || m.to !== uid) throw Object.assign(new Error('Mail not found.'), { status: 404 });
    if (m.claimed) throw Object.assign(new Error('Already claimed.'), { status: 409 });
    d.coins = numberAtLeastZero(d.coins) + numberAtLeastZero(m.coins);
    d.gems = numberAtLeastZero(d.gems) + numberAtLeastZero(m.gems);
    d.adminKeys = numberAtLeastZero(d.adminKeys) + numberAtLeastZero(m.adminKeys);
    const guns = (Array.isArray(m.guns) ? m.guns : []).filter(g => GUN_CATALOG[g]);
    const skins = (Array.isArray(m.skins) ? m.skins : []).filter(k => SKIN_CATALOG[k]);
    d.guns = [...(Array.isArray(d.guns) ? d.guns : ['pistol']), ...guns];
    d.skins = [...(Array.isArray(d.skins) ? d.skins : ['default']), ...skins];
    const ix = registerDiscoveries(d, guns);
    tx.update(mailRef, { claimed: true, claimedAtMs: Date.now() });
    return { ok: true, claimed: { ...mailSummary(m), fromName: m.fromName }, indexGems: ix.indexGems };
  });
  lbCache.clear();
  return result;
}

const server = http.createServer(async (q, r) => {
  const requestUrl = new URL(q.url || '/', 'http://localhost');
  if (q.method === 'OPTIONS') { cors(r); r.writeHead(204); r.end(); return; }
  if (requestUrl.pathname === '/gems/approve' && (q.method === 'GET' || q.method === 'POST')) {
    try { await handleGemApprovePage(q, r, requestUrl); }
    catch (e) { console.error('Gem approve error:', e); sendHtml(r, 500, '<h2>Something went wrong</h2>'); }
    return;
  }
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
        lbCache.delete('gems');
        sendJson(r, 200, { ok: true, player: playerView(player), events: await eventsView() }); return;
      }

      if (path === '/api/gems/orders') {
        rateLimit(uid, 'gem-orders', 30, 60000);
        sendJson(r, 200, await gemOrdersResponse(uid)); return;
      }

      if (path === '/api/gems/order') {
        rateLimit(uid, 'gem-order', 5, 3600000);
        const payerName = String(body.payerName || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
        if (payerName.length < 2) throw Object.assign(new Error('Enter the name you will pay with (at least 2 characters).'), { status: 400 });
        const userSnap = await fs.doc('users/' + uid).get();
        if (!userSnap.exists) throw Object.assign(new Error('Player save not found. Reload the game.'), { status: 404 });
        await settleDueGemOrders(await userGemOrderDocs(uid));
        const open = (await userGemOrderDocs(uid)).filter(d => ['pending', 'approved'].includes((d.data() || {}).status));
        if (open.length >= GEM_MAX_OPEN_ORDERS) throw Object.assign(new Error(`You already have ${GEM_MAX_OPEN_ORDERS} pending orders. Wait until one is approved.`), { status: 409 });
        const tikkieUrl = await currentTikkieUrl();
        if (!tikkieUrl) throw Object.assign(new Error('Buying gems is not available right now. Please try again later.'), { status: 503 });
        let authUser = {}; try { authUser = await admin.auth().getUser(uid); } catch {}
        const ref = fs.collection(GEM_ORDERS).doc();
        const order = {
          id: ref.id, uid, code: newOrderCode(), status: 'pending', gems: GEM_PACK.gems, euro: GEM_PACK.euro,
          payerName, email: authUser.email || '', gameName: String((userSnap.data() || {}).username || '').slice(0, 16),
          tikkieUrl, createdAtMs: Date.now(), emailed: false
        };
        const { id: _id, ...stored } = order;
        await ref.set(stored);
        if (await emailGemOrder(order)) await ref.update({ emailed: true }).catch(() => {});
        sendJson(r, 200, { ...(await gemOrdersResponse(uid)), created: gemOrderView({ id: ref.id, data: () => stored }) }); return;
      }

      if (path === '/api/events') {
        rateLimit(uid, 'events', 30, 60000);
        sendJson(r, 200, { ok: true, events: await eventsView() }); return;
      }

      if (path === '/api/economy/open-admin-crate') {
        rateLimit(uid, 'admin-crate-open', 20, 60000);
        const quantity = numberAtLeastZero(body.quantity || 1);
        if (![1, 10, 100].includes(quantity)) throw Object.assign(new Error('Admin Crates can be opened 1, 10 or 100 at a time.'), { status: 400 });
        const unavailable = () => Object.assign(new Error('This crate is not available right now.'), { status: 404 });
        if (!(await eventActive('AdminLuck'))) throw unavailable();
        const items = Array.from({ length: quantity }, () => rollAdminCrate());
        const result = await updatePlayerEconomy(uid, async d => {
          const keys = numberAtLeastZero(d.adminKeys);
          if (keys < 1) throw unavailable();
          if (keys < quantity) throw Object.assign(new Error('Not enough Admin Keys.'), { status: 409 });
          d.adminKeys = keys - quantity;
          const rewards = { indexGems: 0, bonusGems: 0 };
          const awarded = items.map(item => { const out = applyDrop(d, item, collectionBoostUnlocked(d)); rewards.indexGems += out.indexGems || 0; if (out.bonusGem) rewards.bonusGems++; return out; });
          return { ok: true, quantity, cost: quantity, items: awarded, rewards };
        });
        sendJson(r, 200, result); return;
      }

      if (path === '/api/mail/lookup') {
        rateLimit(uid, 'mail-lookup', 30, 60000);
        const hits = await findPlayersByName(body.name);
        if (!hits.length) throw Object.assign(new Error('No player has that username.'), { status: 404 });
        if (hits.length > 1) throw Object.assign(new Error('More than one player has that username. Ask them to pick a unique one.'), { status: 409 });
        sendJson(r, 200, { ok: true, name: hits[0].name }); return;
      }

      if (path === '/api/mail/inbox') {
        rateLimit(uid, 'mail-inbox', 40, 60000);
        sendJson(r, 200, await mailboxResponse(uid)); return;
      }

      if (path === '/api/mail/send') {
        rateLimit(uid, 'mail-send', 10, 60000);
        sendJson(r, 200, await sendMail(uid, body)); return;
      }

      if (path === '/api/mail/claim') {
        rateLimit(uid, 'mail-claim', 60, 60000);
        sendJson(r, 200, await claimMail(uid, String(body.id || ''))); return;
      }

      if (path === '/api/run/recover') {
        rateLimit(uid, 'run-recover', 3, 60000);
        // Run tickets live inside the player's existing users/{uid} document.
        // This keeps Firestore limited to the users and Limited Crates collections.
        const userRef = fs.doc('users/' + uid);
        const recovered = await fs.runTransaction(async tx => {
          const snap = await tx.get(userRef);
          if (!snap.exists) return false;
          const data = snap.data() || {};
          if (!data.activeRunId) return false;
          tx.update(userRef, {
            activeRunId: FV.delete(),
            activeRunStartedAtMs: FV.delete(),
            updated: FV.serverTimestamp()
          });
          return true;
        });
        sendJson(r, 200, { ok: true, recovered, message: recovered ? 'Unfinished run ticket cleared.' : 'No stuck run ticket was found.' }); return;
      }

      if (path === '/api/run/start') {
        rateLimit(uid, 'run-start', 3, 15000);
        const userRef = fs.doc('users/' + uid), runId = crypto.randomUUID(), now = Date.now();
        await fs.runTransaction(async tx => {
          const userSnap = await tx.get(userRef);
          if (!userSnap.exists) throw Object.assign(new Error('Player save not found. Reload the game.'), { status: 404 });
          const data = userSnap.data() || {};
          const previousStart = numberAtLeastZero(data.activeRunStartedAtMs);
          if (data.activeRunId && previousStart && now - previousStart < 20 * 60 * 1000) {
            throw Object.assign(new Error('A run is already active. Finish it before starting another.'), { status: 409 });
          }
          tx.set(userRef, {
            activeRunId: runId,
            activeRunStartedAtMs: now,
            updated: FV.serverTimestamp()
          }, { merge: true });
        });
        sendJson(r, 200, { ok: true, runId }); return;
      }

      if (path === '/api/run/finish') {
        const runId = String(body.runId || '');
        if (!/^[a-f0-9-]{30,40}$/i.test(runId)) throw Object.assign(new Error('Invalid run ticket.'), { status: 400 });
        const userRef = fs.doc('users/' + uid);
        const outcome = await fs.runTransaction(async tx => {
          const userSnap = await tx.get(userRef);
          if (!userSnap.exists) throw Object.assign(new Error('Player save not found.'), { status: 404 });
          const d = userSnap.data() || {};
          if (d.activeRunId !== runId) {
            throw Object.assign(new Error('This run was already submitted or its ticket has expired.'), { status: 409 });
          }

          const startedAtMs = numberAtLeastZero(d.activeRunStartedAtMs);
          const elapsed = Math.max(0, (Date.now() - startedAtMs) / 1000);
          if (elapsed < 5 || elapsed > 20 * 60) {
            tx.update(userRef, {
              activeRunId: FV.delete(),
              activeRunStartedAtMs: FV.delete(),
              updated: FV.serverTimestamp()
            });
            return { error: elapsed < 5 ? 'Run was too short to verify rewards.' : 'Run ticket expired. Start a new run.', status: elapsed < 5 ? 400 : 409 };
          }

          // Time, wave and spawn caps make client-submitted stats bounded rather than trusted.
          const claimedWave = numberAtLeastZero(body.wave), claimedKills = numberAtLeastZero(body.kills), claimedClears = numberAtLeastZero(body.wavesCleared);
          const maxWaveByTime = Math.max(1, Math.min(60, 1 + Math.floor(elapsed / 8)));
          const acceptedWave = Math.min(claimedWave, maxWaveByTime);
          const maxSpawned = acceptedWave * acceptedWave + 4 * acceptedWave;
          const acceptedKills = Math.min(claimedKills, maxSpawned, Math.floor(elapsed * 3.2) + 1, 5000);
          const acceptedClears = Math.min(claimedClears, acceptedWave, 60);
          const coinReward = acceptedKills * 15 + Array.from({ length: acceptedClears }, (_, i) => 20 + (i + 1) * 5).reduce((a, b) => a + b, 0);
          const xpReward = acceptedKills * 10 + acceptedClears * 25;

          d.coins = numberAtLeastZero(d.coins) + coinReward;
          d.xp = numberAtLeastZero(d.xp) + xpReward;
          d.kills = numberAtLeastZero(d.kills) + acceptedKills;
          d.runs = numberAtLeastZero(d.runs) + 1;
          d.best = Math.max(numberAtLeastZero(d.best), acceptedWave);
          d.activeRunId = FV.delete();
          d.activeRunStartedAtMs = FV.delete();
          d.updated = FV.serverTimestamp();
          const result = {
            ok: true,
            accepted: { wave: acceptedWave, kills: acceptedKills, wavesCleared: acceptedClears, elapsedSeconds: Math.floor(elapsed) },
            reward: { coins: coinReward, xp: xpReward },
            player: playerView(d)
          };
          tx.set(userRef, d, { merge: true });
          return result;
        });
        if (outcome.error) throw Object.assign(new Error(outcome.error), { status: outcome.status });
        lbCache.clear(); sendJson(r, 200, outcome); return;
      }

      if (path === '/api/economy/sell') {
        rateLimit(uid, 'sell', 30, 60000);
        const type = body.type === 'skins' ? 'skins' : body.type === 'guns' ? 'guns' : '';
        const id = String(body.id || ''), quantity = numberAtLeastZero(body.quantity);
        if (!type || !/^[a-z0-9_-]{1,64}$/i.test(id) || quantity < 1 || quantity > 5000) throw Object.assign(new Error('Invalid sale request.'), { status: 400 });
        const value = itemValue(type, id);
        if (!value || id === 'pistol' || id === 'default') throw Object.assign(new Error('That item cannot be sold.'), { status: 400 });
        const item = type === 'guns' ? GUN_CATALOG[id] : SKIN_CATALOG[id];
        const protectedItem = type === 'guns' && (isLimitedGun(item) || isSecretGun(item));
        if (protectedItem && String(body.typedName || '').trim() !== String(item.n)) throw Object.assign(new Error('Type the exact special item name to confirm this sale.'), { status: 400 });
        const result = await updatePlayerEconomy(uid, async d => {
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
        const luck = await eventActive('AdminLuck');
        const items = Array.from({ length: quantity }, () => rollNormalCrate(key, crate, luck));
        const result = await updatePlayerEconomy(uid, async d => {
          const total = crate.cost * quantity;
          if (numberAtLeastZero(d.coins) < total) throw Object.assign(new Error('Not enough KittyCoins.'), { status: 409 });
          d.coins = numberAtLeastZero(d.coins) - total;
          const rewards = { indexGems: 0, bonusGems: 0 };
          const awarded = items.map(item => { const out = applyDrop(d, item, collectionBoostUnlocked(d)); rewards.indexGems += out.indexGems || 0; if (out.bonusGem) rewards.bonusGems++; return out; });
          return { ok: true, crate: key, quantity, cost: total, items: awarded, rewards };
        });
        lbCache.delete('money'); sendJson(r, 200, result); return;
      }

      if (path === '/api/webcredits/open-crate') {
        rateLimit(uid, 'webcrate-open', 20, 60000);
        const key=String(body.crate||'');
        const crate=await webCrateConfig(key);
        const item=rollWebCrate(crate);
        const result=await updatePlayerEconomy(uid, async d=>{
          if(numberAtLeastZero(d.webCredits)<crate.cost)throw Object.assign(new Error('Not enough WebCredits.'),{status:409});
          d.webCredits=numberAtLeastZero(d.webCredits)-crate.cost;
          const ownedBefore=collectionBoostUnlocked(d);
          const awarded=applyDrop(d,item,ownedBefore);
          return {ok:true,crate:key,cost:crate.cost,item:awarded,rewards:{indexGems:awarded.indexGems||0}};
        });
        sendJson(r,200,result);return;
      }

      if (path === '/api/economy/open-gem-crate') {
        rateLimit(uid, 'gem-crate-open', 20, 60000);
        const quantity = numberAtLeastZero(body.quantity || 1);
        if (![1, 10, 100].includes(quantity)) throw Object.assign(new Error('Gem Crates can be opened 1, 10 or 100 at a time.'), { status: 400 });
        const luck = await eventActive('AdminLuck');
        const items = Array.from({ length: quantity }, () => rollGemCrate(luck));
        const result = await updatePlayerEconomy(uid, async d => {
          const total = GEM_CRATE.cost * quantity;
          if (numberAtLeastZero(d.gems) < total) throw Object.assign(new Error('Not enough KittyGems.'), { status: 409 });
          d.gems = numberAtLeastZero(d.gems) - total;
          const rewards = { indexGems: 0, bonusGems: 0 };
          const awarded = items.map(item => { const out = applyDrop(d, item, collectionBoostUnlocked(d)); rewards.indexGems += out.indexGems || 0; if (out.bonusGem) rewards.bonusGems++; return out; });
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
const matchQueue=[];
const matches=new Map();
const MP_GOAL=5, MP_DURATION=180000;
const MP_OBSTACLES=[[-21,-20,1.2,1.5,3.1],[-11,-21,1.6,1.1,2.8],[2,-21,1.1,1.7,3.3],[16,-20,1.7,1.2,2.7],[23,-10,1.1,1.5,3.5],[18,5,1.4,1.1,2.5],[20,20,1.7,1.5,3.2],[7,21,1.2,1.8,2.8],[-8,21,1.8,1.1,3.4],[-22,19,1.2,1.5,2.6],[-23,5,1.8,1.2,3.0],[-15,-5,1.1,1.6,2.6],[15,-5,1.3,1.6,3.2],[0,13,1.7,1.2,2.9],[0,-13,1.5,1.1,2.7],[-5,4,1.1,1.1,3.1],[-19,-8,1.1,1.1,2.2],[-9,-12,1.1,1.1,2.2],[10,-12,1.1,1.1,2.2],[19,10,1.1,1.1,2.2],[9,12,1.1,1.1,2.2],[-18,11,1.1,1.1,2.2]];
function mpCollide(p){for(let it=0;it<2;it++){p.x=Math.max(-29,Math.min(29,p.x));p.z=Math.max(-29,Math.min(29,p.z));for(const [x,z,w,d] of MP_OBSTACLES){const dx=p.x-x,dz=p.z-z,ox=w+.4-Math.abs(dx),oz=d+.4-Math.abs(dz);if(ox>0&&oz>0){if(ox<oz)p.x+=ox*(dx<0?-1:1);else p.z+=oz*(dz<0?-1:1);}}}}
function mpLineBlocked(a,b){const dx=b.x-a.x,dz=b.z-a.z;for(const [x,z,w,d,h] of MP_OBSTACLES){if(h<1.7)continue;const minX=x-w-.12,maxX=x+w+.12,minZ=z-d-.12,maxZ=z+d+.12;let t0=0,t1=1;for(const [origin,delta,min,max] of [[a.x,dx,minX,maxX],[a.z,dz,minZ,maxZ]]){if(Math.abs(delta)<1e-8){if(origin<min||origin>max){t0=2;break;}}else{let u0=(min-origin)/delta,u1=(max-origin)/delta;if(u0>u1)[u0,u1]=[u1,u0];t0=Math.max(t0,u0);t1=Math.min(t1,u1);}}if(t0<=t1&&t1>0.02&&t0<0.98)return true;}return false;}
function mpSend(uid,payload){const u=users.get(uid);if(u)send(u.ws,payload);}
function mpState(m){for(const uid of [m.a,m.b]){const p=m.players[uid];mpSend(uid,{t:'mp-state',id:m.id,players:[m.players[m.a],m.players[m.b]].map(x=>({id:x.uid===m.a?'a':'b',name:x.name,x:x.x,z:x.z,yaw:x.yaw,hp:x.hp,kills:x.kills,deaths:x.deaths,headshots:x.headshots,alive:x.alive})),self:uid===m.a?'a':'b',endsAt:m.endsAt,goal:MP_GOAL});}}
function mpFinish(m,winner,reason='complete'){if(!m||m.ended)return;m.ended=true;matches.delete(m.id);for(const uid of [m.a,m.b]){const p=m.players[uid],won=uid===winner,participation=reason==='opponent-left'&&!won?0:10,reward=participation+p.kills*5+p.headshots*3+(won?25:0);updatePlayerEconomy(uid,async d=>{d.webCredits=numberAtLeastZero(d.webCredits)+reward;d.multiplayerKills=numberAtLeastZero(d.multiplayerKills)+p.kills;d.multiplayerHeadshots=numberAtLeastZero(d.multiplayerHeadshots)+p.headshots;if(won)d.multiplayerWins=numberAtLeastZero(d.multiplayerWins)+1;else if(winner!==null)d.multiplayerLosses=numberAtLeastZero(d.multiplayerLosses)+1;return {ok:true};}).then(r=>mpSend(uid,{t:'mp-end',id:m.id,result:winner===null?'draw':won?'win':'loss',reason,reward,stats:{kills:p.kills,deaths:p.deaths,headshots:p.headshots},player:r.player})).catch(e=>{console.error('MP reward failed',e);mpSend(uid,{t:'mp-end',id:m.id,result:'unranked',reason,reward:0,error:'Rewards could not be saved'});});const u=users.get(uid);if(u)u.match=null;} }
async function mpStart(a,b,reservation){const [sa,sb]=await Promise.all([fs.doc('users/'+a).get(),fs.doc('users/'+b).get()]);if(!users.has(a)||!users.has(b)||users.get(a).match!==reservation||users.get(b).match!==reservation){for(const uid of [a,b]){const u=users.get(uid);if(u&&u.match===reservation){u.match=null;mpSend(uid,{t:'err',m:'Your opponent disconnected while the match was starting.'});}}return;}const da=sa.data()||{},db=sb.data()||{},id=crypto.randomBytes(8).toString('hex'),now=Date.now(),m={id,a,b,startedAt:now,endsAt:now+MP_DURATION,ended:false,players:{}};for(const uid of [a,b]){const u=users.get(uid),d=uid===a?da:db,gun=Array.isArray(d.guns)&&d.guns.includes(d.gun)?d.gun:'pistol';m.players[uid]={uid,name:u?.name||'Player',x:uid===a?-8:8,z:0,yaw:uid===a?-Math.PI/2:Math.PI/2,gun,ownedGuns:(Array.isArray(d.guns)?d.guns.filter(id=>GUN_CATALOG[id]):['pistol']),hp:100,kills:0,deaths:0,headshots:0,alive:true,lastInput:now,lastShot:0,respawnAt:0,move:{f:0,r:0},pitch:0};if(u)u.match=id;}matches.set(id,m);for(const uid of [a,b])mpSend(uid,{t:'mp-start',id,endsAt:m.endsAt,goal:MP_GOAL,spawn:{x:m.players[uid].x,z:m.players[uid].z,yaw:m.players[uid].yaw}});mpState(m);}
function mpQueue(uid){const u=users.get(uid);if(!u||u.trade||u.match)return false;const i=matchQueue.indexOf(uid);if(i>=0)return true;matchQueue.push(uid);while(matchQueue.length){const a=matchQueue.shift();if(!users.has(a)||users.get(a).match)continue;const b=matchQueue.shift();if(!b){matchQueue.unshift(a);break;}if(!users.has(b)||users.get(b).match){matchQueue.unshift(a);continue;}const reservation='starting:'+crypto.randomBytes(6).toString('hex');users.get(a).match=reservation;users.get(b).match=reservation;mpStart(a,b,reservation).catch(e=>{console.error('Match start failed',e);for(const id of [a,b]){const x=users.get(id);if(x&&x.match===reservation)x.match=null;mpSend(id,{t:'err',m:'Could not start match'});}});return true;}return true;}
function mpLeave(uid){const i=matchQueue.indexOf(uid);if(i>=0)matchQueue.splice(i,1);const u=users.get(uid);if(u?.match){const m=matches.get(u.match);if(m&&!m.ended)mpFinish(m,uid===m.a?m.b:m.a,'opponent-left');u.match=null;}}
function mpInput(uid,m){const u=users.get(uid),match=u?.match,game=match&&matches.get(match);if(!game||game.ended)return;const p=game.players[uid],now=Date.now();if(now-(p.lastPacketAt||0)<25)return;p.lastPacketAt=now;const dt=Math.min(.08,Math.max(.005,(now-p.lastInput)/1000));p.lastInput=now;p.yaw=Number.isFinite(+m.yaw)?Math.atan2(Math.sin(+m.yaw),Math.cos(+m.yaw)):p.yaw;p.pitch=Math.max(-1.35,Math.min(1.35,Number(m.pitch)||0));p.move={f:Math.max(-1,Math.min(1,Number(m.f)||0)),r:Math.max(-1,Math.min(1,Number(m.r)||0))};if(typeof m.gun==='string'&&p.ownedGuns.includes(m.gun))p.gun=m.gun;if(p.alive){const f=p.move.f,r=p.move.r,l=Math.hypot(f,r)||1,speed=(m.sprint?10:7.2)*dt;p.x+=(-Math.sin(p.yaw)*f+Math.cos(p.yaw)*r)/l*speed;p.z+=(-Math.cos(p.yaw)*f-Math.sin(p.yaw)*r)/l*speed;mpCollide(p);p.x=Math.max(-29,Math.min(29,p.x));p.z=Math.max(-29,Math.min(29,p.z));}if(m.fire)mpFire(game,p);}
function mpFire(game,p){const now=Date.now(),weapon=GUN_CATALOG[p.gun]||GUN_CATALOG.pistol,rate=Math.max(120,Math.min(1100,(Number(weapon.f)||.24)*1000));if(!p.alive||now-p.lastShot<rate)return;p.lastShot=now;const target=game.players[p.uid===game.a?game.b:game.a];if(!target?.alive)return;const dx=target.x-p.x,dz=target.z-p.z,dist=Math.hypot(dx,dz);if(dist>65||dist<.1||mpLineBlocked(p,target))return;const fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw),dot=(dx/dist)*fx+(dz/dist)*fz;if(dot<.994)return;const cross=Math.abs(dx*fz-dz*fx);if(cross>Math.max(.65,dist*.055))return;const aimHeight=Math.tan(p.pitch)*dist;if(aimHeight<-.9||aimHeight>.5)return;const head=aimHeight>.05,damage=head?100:Math.max(15,Math.min(55,Number(weapon.d)||24));target.hp-=damage;mpSend(p.uid,{t:'mp-hit',damage,head});mpSend(target.uid,{t:'mp-damaged',damage,head,by:p.name});if(target.hp<=0){target.alive=false;target.deaths++;p.kills++;if(head)p.headshots++;mpSend(p.uid,{t:'mp-feed',text:(head?'HEADSHOT':'ELIMINATION')+' · +'+(head?8:5)+' WebCredits (pending)'});if(p.kills>=MP_GOAL){mpFinish(game,p.uid);return;}target.respawnAt=now+2200;target.hp=0;}mpState(game);}
setInterval(()=>{const now=Date.now();for(const m of matches.values()){if(now>=m.endsAt){const a=m.players[m.a],b=m.players[m.b];mpFinish(m,a.kills===b.kills?null:(a.kills>b.kills?m.a:m.b),'time');continue;}for(const uid of [m.a,m.b]){const p=m.players[uid];if(!p.alive&&p.respawnAt&&now>=p.respawnAt){p.alive=true;p.hp=100;p.x=uid===m.a?-8:8;p.z=0;}}mpState(m);}},100);
const send = (ws, o) => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); };
const cleanName = s => String(s || '').replace(/[<>&"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'Player';
const gfirst = new Map(); // uid -> first name of the Google account
// Display/lookup name = chosen username, otherwise the first name of the Google account
async function resolveName(uid) {
  let n = '';
  try {
    const s = await fs.doc('users/' + uid).get();
    if (s.exists) {
      n = String(s.data().username || '').trim();
      if (s.data().usernameLower !== n.toLowerCase()) s.ref.set({ usernameLower: n.toLowerCase() }, { merge: true }).catch(() => {});
    }
  } catch (e) {}
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
      const A = sa.data(), B = sb.data(), ga = [...catalogueList(A.guns, GUN_CATALOG, 'pistol'), ...catalogueList(A.skins, SKIN_CATALOG, 'default').map(x => 's:' + x)], gb = [...catalogueList(B.guns, GUN_CATALOG, 'pistol'), ...catalogueList(B.skins, SKIN_CATALOG, 'default').map(x => 's:' + x)];
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
      t.update(ra, { ...fixDoc(A, gunsOf(na), gunsOf(ob), skinsOf(na)), discoveredGuns: nextA.discoveredGuns, newGuns: FV.delete(), indexGemMilestones: nextA.indexGemMilestones, gems: nextA.gems ?? numberAtLeastZero(A.gems), updated: FV.serverTimestamp() });
      t.update(rb, { ...fixDoc(B, gunsOf(nb), gunsOf(oa), skinsOf(nb)), discoveredGuns: nextB.discoveredGuns, newGuns: FV.delete(), indexGemMilestones: nextB.indexGemMilestones, gems: nextB.gems ?? numberAtLeastZero(B.gems), updated: FV.serverTimestamp() });
    });
    lbCache.delete('gems');
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
  return [...catalogueList(d.guns, GUN_CATALOG, 'pistol'), ...catalogueList(d.skins, SKIN_CATALOG, 'default').map(x => 's:' + x)];
}

async function onMsg(ws, m) {
  if (m.t === 'auth') {
    if (ws.uid) return;
    let dec; try { dec = await admin.auth().verifyIdToken(String(m.token)); } catch (e) { send(ws, { t: 'err', m: 'Auth failed' }); return ws.close(); }
    const uid = dec.uid;
    gfirst.set(uid, cleanName(String(dec.name || '').trim().split(' ')[0]));
    let name = await resolveName(uid);
    const old = users.get(uid); if (old && old.ws !== ws) { mpLeave(uid); if(old.trade){const activeTrade=trades.get(old.trade);if(activeTrade&&!activeTrade.busy)endTrade(activeTrade,'Account reconnected');} try { old.ws.close(); } catch (e) {} }
    ws.uid = uid; users.set(uid, { ws, name, trade: null });
    rtdb.ref('presence/' + uid).set({ name, ts: Date.now() }).catch(() => {});
    return send(ws, { t: 'ready', name });
  }
  const uid = ws.uid, me = users.get(uid); if (!uid || !me) return;
  if(m.t==='mp-queue'){if(me.trade||me.match)return send(ws,{t:'err',m:'Finish your trade or current match first'});mpQueue(uid);if(!me.match)return send(ws,{t:'mp-queued',position:Math.max(1,matchQueue.indexOf(uid)+1)});return;}
  if(m.t==='mp-cancel'){mpLeave(uid);return send(ws,{t:'mp-cancelled'});}
  if(m.t==='mp-input'){mpInput(uid,m);return;}
  if(m.t==='mp-fire'){const game=me.match&&matches.get(me.match);if(game)mpFire(game,game.players[uid]);return;}

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
    const validOffer = g.every(item => item.startsWith('s:')
      ? Object.prototype.hasOwnProperty.call(SKIN_CATALOG, item.slice(2))
      : Object.prototype.hasOwnProperty.call(GUN_CATALOG, item));
    if (!validOffer) return send(ws, { t: 'err', m: 'That item is no longer in the CrateMaster catalogue' });
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
      mpLeave(uid);
      if (u.trade) { const tr = trades.get(u.trade); if (tr && !tr.busy) endTrade(tr, 'The other player disconnected'); }
      users.delete(uid); rtdb.ref('presence/' + uid).remove().catch(() => {});
    }
  });
});
setInterval(() => wss.clients.forEach(ws => { if (!ws.alive) return ws.terminate(); ws.alive = false; ws.ping(); }), 25000);

async function startServer() {
  // Create missing Limited Crates documents before accepting traffic. This is
  // idempotent: it never overwrites a price or enabled flag that already exists.
  try {
    const result = await ensureLimitedCrateDocuments();
    
    console.log('Limited Crates config ready:', result);
  } catch (error) {
    // Keep the service online if Firestore is temporarily unavailable. Missing
    // Limited Crates stay unavailable until the next Render restart.
    console.error('Could not initialize Limited Crates config:', error);
  }
  try { await ensureEventDocuments(); console.log('Events config ready'); } catch (error) { console.error('Could not initialize Events config:', error); }
  await rtdb.ref('presence').remove().catch(() => {}); // clear stale presence from before a restart
  setTimeout(() => sweepGemOrders().catch(e => console.error('Gem sweep failed:', e)), 30000);
  setInterval(() => sweepGemOrders().catch(e => console.error('Gem sweep failed:', e)), 10 * 60000);
  server.listen(process.env.PORT || 8080, () => console.log('CrateMaster server listening'));
}
startServer().catch(error => {
  console.error('CrateMaster startup failed:', error);
  process.exit(1);
});
