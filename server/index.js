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

let lbCache = { at: 0, data: [] };
async function leaderboard() {
  if (Date.now() - lbCache.at < 30000) return lbCache.data;
  const snap = await fs.collection('users').orderBy('best', 'desc').limit(25).get();
  const data = [];
  snap.forEach(d => { const x = d.data(); if ((x.best || 0) > 0) data.push({ uid: d.id, name: cleanName(x.username), best: x.best | 0, kills: x.kills | 0 }); });
  data.sort((a, b) => b.best - a.best || b.kills - a.kills);
  lbCache = { at: Date.now(), data };
  return data;
}
const server = http.createServer(async (q, r) => {
  if (q.url && q.url.split('?')[0] === '/leaderboard') {
    try { const d = await leaderboard(); r.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); r.end(JSON.stringify(d)); }
    catch (e) { console.error(e); r.writeHead(500, { 'Access-Control-Allow-Origin': '*' }); r.end('[]'); }
    return;
  }
  r.writeHead(200); r.end('CrateMaster server ok');
});
const wss = new WebSocketServer({ server, maxPayload: 8192 });

const users = new Map();   // uid -> { ws, name, trade }
const trades = new Map();  // id  -> { id, a, b, active, offers, ready, to, busy }
const send = (ws, o) => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); };
const cleanName = s => String(s || '').replace(/[<>&"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'Player';
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
const fixDoc = (D, ng, recv) => {
  let h = Array.isArray(D.hotbar) ? D.hotbar.slice(0, 5) : [];
  while (h.length < 5) h.push('');
  const used = {};
  h = h.map(g => { if (!g) return ''; used[g] = (used[g] || 0) + 1; return used[g] <= cnt(ng, g) ? g : ''; });
  for (const g of recv) { if (h.includes(g)) continue; const i = h.indexOf(''); if (i >= 0) h[i] = g; }
  return { guns: ng, hotbar: h, gun: ng.includes(D.gun) ? D.gun : 'pistol' };
};
async function execute(tr) {
  tr.busy = true;
  try {
    const ra = fs.doc('users/' + tr.a), rb = fs.doc('users/' + tr.b);
    await fs.runTransaction(async t => {
      const [sa, sb] = await Promise.all([t.get(ra), t.get(rb)]);
      if (!sa.exists || !sb.exists) throw new Error('A player save was not found');
      const A = sa.data(), B = sb.data(), ga = A.guns || [], gb = B.guns || [];
      const oa = tr.offers[tr.a], ob = tr.offers[tr.b];
      if (!oa.length && !ob.length) throw new Error('Nothing to trade');
      if (oa.includes('pistol') || ob.includes('pistol')) throw new Error('The starter pistol cannot be traded');
      if (!hasAll(ga, oa) || !hasAll(gb, ob)) throw new Error('A player no longer owns an offered gun');
      const remA = removeMulti(ga, oa), remB = removeMulti(gb, ob);
      t.update(ra, { ...fixDoc(A, [...remA, ...ob], ob), updated: FV.serverTimestamp() });
      t.update(rb, { ...fixDoc(B, [...remB, ...oa], oa), updated: FV.serverTimestamp() });
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
  return s.exists && Array.isArray(s.data().guns) ? s.data().guns : [];
}

async function onMsg(ws, m) {
  if (m.t === 'auth') {
    if (ws.uid) return;
    let dec; try { dec = await admin.auth().verifyIdToken(String(m.token)); } catch (e) { send(ws, { t: 'err', m: 'Auth failed' }); return ws.close(); }
    const uid = dec.uid;
    let name = 'Player';  // never use the Google account name; only the player's chosen username
    try { const s = await fs.doc('users/' + uid).get(); if (s.exists) name = cleanName(s.data().username); } catch (e) {}
    const old = users.get(uid); if (old && old.ws !== ws) { try { old.ws.close(); } catch (e) {} }
    ws.uid = uid; users.set(uid, { ws, name, trade: null });
    rtdb.ref('presence/' + uid).set({ name, ts: Date.now() }).catch(() => {});
    return send(ws, { t: 'ready', name });
  }
  const uid = ws.uid, me = users.get(uid); if (!uid || !me) return;

  if (m.t === 'invite') {
    const to = String(m.to), you = users.get(to);
    if (to === uid || !you) return send(ws, { t: 'err', m: 'Player is not online' });
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
    if (g.includes('pistol')) return send(ws, { t: 'err', m: 'The starter pistol cannot be traded' });
    const own = await ownedGuns(uid);
    if (!hasAll(own, g)) return send(ws, { t: 'err', m: 'You do not own one of those guns' });
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
