// Online trading client: talks to the Render server (WebSocket); online players come from Realtime Database presence.
// >>> Set this to your Render service URL (wss://...) <<<
const TRADE_URL='wss://cratemaster.onrender.com';

let tws=null,tUp=false,tOnline={},tInv=null,tTrade=null,tMsg='',tRetry=0,tUnsub=null,tTimer=null;
window.tradeLock=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tSend=o=>{if(tws&&tws.readyState===1)tws.send(JSON.stringify(o))};
const tCfg=()=>!TRADE_URL.includes('YOUR-SERVICE');
function tRefresh(){if(tab=='trade'&&(!playing||paused))menu()}

function tConnect(){
 if(!cu||tws||!tCfg())return;
 let w;try{w=tws=new WebSocket(TRADE_URL)}catch(e){return}
 w.onopen=async()=>{try{tSend({t:'auth',token:await cloud.token()})}catch(e){w.close()}};
 w.onmessage=async ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}
  switch(m.t){
   case 'ready':tUp=true;tRetry=0;tMsg='';break;
   case 'err':tMsg=m.m;toast(m.m);break;
   case 'sent':tMsg='Invite sent to '+m.name+'… waiting for them to accept.';tTrade={id:m.id,active:false,name:m.name,offers:{me:[],them:[]},ready:{me:false,them:false}};break;
   case 'invite':tInv=m;toast(m.name+' wants to trade');tShowInv();break;
   case 'start':
    tInv=null;tShowInv();tMsg='';
    if(window.cloud&&cloud.user)cloud.save(S,true); // flush, then freeze saves so a stale save can't overwrite the trade
    window.tradeLock=true;
    tTrade={id:m.id,active:true,name:m.name,offers:{me:[],them:[]},ready:{me:false,them:false}};tab='trade';break;
   case 'state':if(tTrade&&tTrade.id==m.id){tTrade.offers=m.offers;tTrade.ready=m.ready}break;
   case 'done':
    toast('Trade complete!');tTrade=null;
    try{const d=await cloud.load();if(d)S=clean(d)}catch(e){console.error(e)}
    window.tradeLock=false;applyGun();break;
   case 'cancelled':
    if(tInv&&tInv.id==m.id){tInv=null;tShowInv()}
    if(tTrade&&tTrade.id==m.id){tTrade=null;window.tradeLock=false}
    tMsg=m.why;toast(m.why);break;
  }
  tRefresh();if(m.t=='done'||m.t=='start')menu()};
 w.onclose=()=>{if(tws===w)tws=null;tUp=false;tTrade=null;tInv=null;tShowInv();window.tradeLock=false;
  clearTimeout(tTimer);if(cu&&tCfg())tTimer=setTimeout(tConnect,Math.min(15000,2000*++tRetry));tRefresh()};
 w.onerror=()=>{};
}
function tShowInv(){
 let el=document.getElementById('tinv');
 if(!tInv){if(el)el.remove();return}
 if(!el){el=document.createElement('div');el.id='tinv';document.body.appendChild(el)}
 el.innerHTML=`<b>${esc(tInv.name)}</b> wants to trade <button class="sm" onclick="tAnswer(true)">Accept</button><button class="sm" onclick="tAnswer(false)">Decline</button>`;
}
function tAnswer(ok){if(!tInv)return;if(ok&&playing&&!paused){toast('End or pause your run first');return}tSend({t:ok?'accept':'decline',id:tInv.id});if(!ok){tInv=null;tShowInv()}}
function tInvite(uid){if(playing&&!paused)return;tMsg='';tSend({t:'invite',to:uid})}
function tCancel(){if(tTrade)tSend({t:'cancel',id:tTrade.id})}
function tAdd(id){if(!tTrade||!tTrade.active)return;const o=tTrade.offers.me;if(cnt(o,id)>=cnt(S.guns,id))return;if(o.length>=8){toast('Max 8 guns per trade');return}tSend({t:'offer',id:tTrade.id,guns:[...o,id]})}
function tRem(id){if(!tTrade||!tTrade.active)return;const o=[...tTrade.offers.me],i=o.indexOf(id);if(i<0)return;o.splice(i,1);tSend({t:'offer',id:tTrade.id,guns:o})}
function tReadyBtn(){if(!tTrade||!tTrade.active)return;tSend({t:'ready',id:tTrade.id,v:!tTrade.ready.me})}

function renderTrade(){
 const el=document.getElementById('trade');if(!el||tab!='trade')return;
 if(!tCfg()){el.innerHTML='<div class="opt"><label>Trading is not set up yet<small>Set TRADE_URL at the top of trade.js to your Render server address.</small></label></div>';return}
 tConnect();
 const status=`<p class="hint">${tUp?'🟢 Connected':'🟡 Connecting to trade server… (it can take up to a minute to wake up)'}${tMsg?' · '+esc(tMsg):''}</p>`;
 if(tTrade&&tTrade.active){
  const T=tTrade,mine=[...new Set(S.guns.filter(g=>g!='pistol'&&GUNS[g]))].sort(gSort);
  const card=(g,n,sel,click,tot)=>{const G=GUNS[g]||{n:'?',r:'common'};return `<div class="tg ${sel?'sel':''}" style="--c:${R[G.r]||'#999'}" ${click?`onclick="${click}('${g}')"`:''}><b>${esc(G.n)}${n>1?' ×'+n:''}${tot?` <span class="note">(${sel}/${tot} offered)</span>`:''}</b>${LT(G)}<small>${G.r}</small></div>`};
  const grp=a=>{const m={};a.forEach(g=>m[g]=(m[g]||0)+1);return Object.entries(m)};
  el.innerHTML=status+`<div class="tw"><div class="tcol"><h4>You offer (${T.offers.me.length})</h4><div class="tl">${grp(T.offers.me).map(([g,n])=>card(g,n,0,'tRem')).join('')||'<em>nothing yet</em>'}</div><h4>Your guns — click to offer one copy (click an offered gun to take it back)</h4><div class="tl">${mine.map(g=>card(g,1,cnt(T.offers.me,g),'tAdd',cnt(S.guns,g))).join('')||'<em>no tradable guns</em>'}</div></div>
  <div class="tcol"><h4>${esc(T.name)} offers (${T.offers.them.length})</h4><div class="tl">${grp(T.offers.them).map(([g,n])=>card(g,n,0,0)).join('')||'<em>nothing yet</em>'}</div>
  <p class="hint">You: ${T.ready.me?'✅ ready':'⏳ not ready'} · ${esc(T.name)}: ${T.ready.them?'✅ ready':'⏳ not ready'}<br>Changing any offer un-readies both players. The trade happens when both are ready.</p>
  <div class="row"><button class="big" onclick="tReadyBtn()">${T.ready.me?'Unready':'READY'}</button><button onclick="tCancel()">Cancel trade</button></div></div></div>`;
  return}
 if(tTrade&&!tTrade.active){el.innerHTML=status+`<div class="opt"><label>Invite sent to ${esc(tTrade.name)}</label><button onclick="tCancel()">Cancel</button></div>`;return}
 const list=Object.entries(tOnline).filter(([u])=>cu&&u!=cu.uid);
 el.innerHTML=status+`<h3>Online players</h3>`+(list.length?list.map(([u,p])=>`<div class="opt"><label>${esc(p.name||'Player')}</label><button class="sm" onclick="tInvite('${esc(u)}')">Invite to trade</button></div>`).join(''):'<p class="hint">Nobody else is online right now.</p>')+`<p class="hint">The starter pistol can’t be traded. Tip: set a username in Options so players know who you are.</p>`;
}

addEventListener('cm-auth',e=>{
 if(e.detail){tConnect();if(window.cloud&&!tUnsub)tUnsub=cloud.presence(v=>{tOnline=v;tRefresh()})}
 else{if(tUnsub){tUnsub();tUnsub=null}tOnline={};clearTimeout(tTimer);if(tws){const w=tws;tws=null;w.close()}tTrade=null;tInv=null;tShowInv();window.tradeLock=false}
});
