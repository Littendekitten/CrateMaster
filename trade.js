// Online trading client: talks to the Render server (WebSocket); online players come from Realtime Database presence.
// >>> Set this to your Render service URL (wss://...) <<<
const TRADE_URL='wss://cratemaster.onrender.com';

let tws=null,tUp=false,tOnline={},tInv=null,tTrade=null,tMsg='',tRetry=0,tUnsub=null,tTimer=null,tInvPage=0;
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
    tInv=null;tShowInv();tMsg='';tInvPage=0;
    if(window.cloud&&cloud.user)cloud.save(S,true); // flush, then freeze saves so a stale save can't overwrite the trade
    window.tradeLock=true;
    tTrade={id:m.id,active:true,name:m.name,offers:{me:[],them:[]},ready:{me:false,them:false}};tab='trade';break;
   case 'state':if(tTrade&&tTrade.id==m.id){tTrade.offers=m.offers;tTrade.ready=m.ready}break;
   case 'done':
    toast('Trade complete!');tTrade=null;
    try{const d=await cloud.load();if(d)S=clean(d);cloud.save(S,true)}catch(e){console.error(e)}
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
function tInvite(){if(playing&&!paused)return;const v=(document.getElementById('t-name')||{}).value||'';if(!v.trim()){toast('Type a player name first');return}tMsg='';tSend({t:'invite',name:v.trim()})}
function tRename(){setTimeout(()=>tSend({t:'name'}),1800)}
if(typeof saveNick=='function'){const _sn=saveNick;window.saveNick=function(){_sn.apply(this,arguments);tRename()}}
function tCancel(){if(tTrade)tSend({t:'cancel',id:tTrade.id})}
const tOwn=id=>id.startsWith('s:')?S.skins.filter(x=>x==id.slice(2)):S.guns.filter(x=>x==id);
function tAdd(id){if(!tTrade||!tTrade.active)return;const o=tTrade.offers.me;if(cnt(o,id)>=tOwn(id).length)return;if(o.length>=8){toast('Max 8 guns per trade');return}tSend({t:'offer',id:tTrade.id,guns:[...o,id]})}
function tRem(id){if(!tTrade||!tTrade.active)return;const o=[...tTrade.offers.me],i=o.indexOf(id);if(i<0)return;o.splice(i,1);tSend({t:'offer',id:tTrade.id,guns:o})}
function tReadyBtn(){if(!tTrade||!tTrade.active)return;tSend({t:'ready',id:tTrade.id,v:!tTrade.ready.me})}

function tradeItemCard(id,{count=1,selected=false,action='',total=0,muted=false}={}){
 const isSkin=id.startsWith('s:'),key=isSkin?id.slice(2):id,G=isSkin?SKINS[key]:GUNS[key];
 if(!G)return '';
 const rarity=G.r||'common',rank=isSkin?rarity:rankKeyOf(G),tone=isSkin?(R[rarity]||'#9aa4c4'):rankColorOf(G),rankLabel=isSkin?String(rarity).toUpperCase():(isLimitedGun(G)?'COLLECTOR EXCLUSIVE':isGemRank(G)?'GEM EXCLUSIVE':rankLabelOf(G)),art=isSkin
  ?`<span class="trade-swatch" style="--skin-main:${hexc(G.c)};--skin-accent:${hexc(G.a||G.c)}"></span>`
  :`<span class="trade-gun-art">${gunArt(key)}</span>`;
 const isNew=!isSkin&&Array.isArray(S.newGuns)&&S.newGuns.includes(key);
 const label=isSkin?'Weapon finish':gunFamily(key,G);
 const click=action?`onclick="${action}('${id}')"`:'';
 return `<button type="button" class="trade-item ${selected?'is-selected':''} ${muted?'is-muted':''}" style="--tier:${tone}" ${click} ${action?'':'disabled'}>
  <span class="trade-item-art">${art}${count>1?`<i class="trade-count">×${count}</i>`:''}</span>
  <span class="trade-item-name">${esc(G.n)}${isSkin?' · Skin':''}${!isSkin?(isLimitedGun(G)?LT(G):isGemRank(G)?GT(G):''):''}${isNew?'<i class="new-gun-badge trade-new-badge">NEW</i>':''}</span>
  <span class="trade-item-meta"><span>${esc(label)}</span><b>${rankLabel}</b></span>
  ${total?`<span class="trade-item-foot">${count}/${total} copies offered</span>`:''}
 </button>`;
}
function tradeItems(items,opts={}){return items.map(id=>tradeItemCard(id,opts(id))).join('')||'<p class="trade-empty">No items here yet</p>'}
function tShowMoreInventory(){tInvPage++;renderTrade()}
function renderTrade(){
 const el=document.getElementById('trade');if(!el||tab!='trade')return;
 if(!tCfg()){el.innerHTML='<div class="trade-shell"><div class="trade-empty-state"><span class="trade-eyebrow">CRATEMASTER EXCHANGE</span><h3>Trading is not configured</h3><p>Set the trade server URL at the top of trade.js before using player-to-player trades.</p></div></div>';return}
 tConnect();
 const status=`<div class="trade-status ${tUp?'is-online':'is-connecting'}"><span class="trade-status-dot"></span><span>${tUp?'Trade server connected':'Connecting to trade server…'}</span>${tMsg?`<small>${esc(tMsg)}</small>`:''}</div>`;
 if(tTrade&&tTrade.active){
  const T=tTrade,mine=[...new Set(S.guns.filter(g=>g!=='pistol'&&GUNS[g]))].sort(gSort),mineS=[...new Set(S.skins.filter(k=>k!=='default'&&SKINS[k]))].sort(sSort).map(k=>'s:'+k);
  const myOffered=[...T.offers.me],theirOffered=[...T.offers.them],group=a=>{const map={};a.forEach(id=>map[id]=(map[id]||0)+1);return Object.entries(map)};
  const myOfferHTML=group(myOffered).map(([id,n])=>tradeItemCard(id,{count:n,selected:true,action:'tRem'})).join('')||'<p class="trade-empty">Your offer is empty. Choose items from your inventory below.</p>';
  const theirOfferHTML=group(theirOffered).map(([id,n])=>tradeItemCard(id,{count:n,muted:true})).join('')||'<p class="trade-empty">Waiting for their offer…</p>';
  const allInventory=[...mine,...mineS],visibleInventory=allInventory.slice(0,(tInvPage+1)*36);
  const inventoryHTML=visibleInventory.map(id=>tradeItemCard(id,{selected:cnt(T.offers.me,id)>0,action:'tAdd',total:tOwn(id).length,count:cnt(T.offers.me,id)})).join('')||'<p class="trade-empty">You do not have any tradable items yet.</p>';
  const inventoryMore=visibleInventory.length<allInventory.length?`<button class="trade-load-more" onclick="tShowMoreInventory()">SHOW ${Math.min(36,allInventory.length-visibleInventory.length)} MORE · ${allInventory.length-visibleInventory.length} LEFT</button>`:'';
  el.innerHTML=`<div class="trade-shell">
   <div class="trade-heading"><div><span class="trade-eyebrow">CRATEMASTER EXCHANGE · LIVE SESSION</span><h3>Trade with ${esc(T.name)}</h3><p>Review both offers carefully before confirming.</p></div><span class="trade-live-pill"><i></i> LIVE</span></div>
   ${status}
   <div class="trade-columns">
    <section class="trade-panel trade-panel-mine">
     <div class="trade-panel-head"><div><span class="trade-eyebrow">YOUR SIDE</span><h4>Your offer</h4></div><span class="trade-item-total">${myOffered.length} / 8</span></div>
     <div class="trade-offer-grid">${myOfferHTML}</div>
     <div class="trade-divider"></div>
     <div class="trade-panel-head trade-inventory-head"><div><span class="trade-eyebrow">YOUR COLLECTION</span><h4>Choose items</h4></div><span class="trade-item-total">${mine.length+mineS.length} available</span></div>
     <p class="trade-help">Select an item to add one copy. Select it again in your offer to remove it.</p>
     <div class="trade-inventory-grid">${inventoryHTML}</div>${inventoryMore}
    </section>
    <section class="trade-panel trade-panel-them">
     <div class="trade-panel-head"><div><span class="trade-eyebrow">${esc(T.name.toUpperCase())}’S SIDE</span><h4>Their offer</h4></div><span class="trade-item-total">${theirOffered.length} / 8</span></div>
     <div class="trade-offer-grid">${theirOfferHTML}</div>
     <div class="trade-divider"></div>
     <div class="trade-readiness">
      <div class="trade-ready-row"><span class="trade-player-dot"></span><span>You</span><b class="${T.ready.me?'ready':''}">${T.ready.me?'READY':'NOT READY'}</b></div>
      <div class="trade-ready-row"><span class="trade-player-dot other"></span><span>${esc(T.name)}</span><b class="${T.ready.them?'ready':''}">${T.ready.them?'READY':'NOT READY'}</b></div>
     </div>
     <p class="trade-help">Any change to an offer resets both ready states. The exchange completes only after both players are ready.</p>
     <div class="trade-actions"><button class="trade-ready-button ${T.ready.me?'is-ready':''}" onclick="tReadyBtn()">${T.ready.me?'CANCEL READY':'CONFIRM OFFER'}</button><button class="trade-cancel-button" onclick="tCancel()">Cancel trade</button></div>
    </section>
   </div>
   <p class="trade-safety-note">The starter pistol and Factory Gray skin cannot be traded. Check item names and quantities before confirming.</p>
  </div>`;
  return;
 }
 if(tTrade&&!tTrade.active){
  el.innerHTML=`<div class="trade-shell"><div class="trade-empty-state"><span class="trade-eyebrow">CRATEMASTER EXCHANGE</span><span class="trade-wait-icon">⇄</span><h3>Invitation sent</h3><p>Waiting for <b>${esc(tTrade.name)}</b> to accept your trade request.</p>${status}<button class="trade-cancel-button" onclick="tCancel()">Cancel invitation</button></div></div>`;return;
 }
 const keep=(document.getElementById('t-name')||{}).value||'',foc=document.activeElement&&document.activeElement.id==='t-name';
 el.innerHTML=`<div class="trade-shell trade-lobby">
  <div class="trade-heading"><div><span class="trade-eyebrow">CRATEMASTER EXCHANGE</span><h3>Trade with a player</h3><p>Swap duplicate weapons and cosmetic finishes with players who are online.</p></div><span class="trade-live-pill"><i></i> PLAYER TRADING</span></div>
  ${status}
  <div class="trade-find-card"><div class="trade-find-icon">⇄</div><div class="trade-find-copy"><h4>Find a trading partner</h4><p>Enter their CrateMaster username. Both players need to be online.</p></div><div class="trade-find-controls"><input id="t-name" maxlength="16" placeholder="Player username" autocomplete="off" onkeydown="if(event.key==='Enter')tInvite()"><button class="trade-ready-button" onclick="tInvite()">SEND INVITE <span>→</span></button></div></div>
  <div class="trade-feature-grid"><div class="trade-feature"><span>01</span><b>Choose items</b><small>Offer weapons and unlocked skins you own.</small></div><div class="trade-feature"><span>02</span><b>Review both sides</b><small>Check the exact items and copy counts.</small></div><div class="trade-feature"><span>03</span><b>Both confirm</b><small>The trade completes when both players are ready.</small></div></div>
  <p class="trade-safety-note">The starter pistol and Factory Gray skin cannot be traded. Set a username in Options so other players can find you.</p>
 </div>`;
 const ni=document.getElementById('t-name');if(ni){ni.value=keep;if(foc)ni.focus()}
}

addEventListener('cm-auth',e=>{
 if(e.detail){tConnect();}
 else{if(tUnsub){tUnsub();tUnsub=null}tOnline={};clearTimeout(tTimer);if(tws){const w=tws;tws=null;w.close()}tTrade=null;tInv=null;tShowInv();window.tradeLock=false}
});
