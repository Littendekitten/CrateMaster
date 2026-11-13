const $=id=>document.getElementById(id);
const R={common:'#9aa4c4',rare:'#3b9cff',epic:'#b45cff',legendary:'#ffb81f'};
const RK=['common','rare','epic','legendary'];
const GUNS={pistol:{n:'Pistol',r:'common',d:25,f:.3,p:1,s:.004,a:0,l:.6},smg:{n:'Viper SMG',r:'common',d:11,f:.08,p:1,s:.03,a:1,l:.9},shotgun:{n:'Boomstick',r:'rare',d:13,f:.8,p:8,s:.09,a:0,l:1.1},rifle:{n:'Striker AR',r:'epic',d:24,f:.13,p:1,s:.012,a:1,l:1.2},sniper:{n:'Longshot',r:'legendary',d:110,f:1.1,p:1,s:0,a:0,l:1.5},
 revolver:{n:'Deputy',r:'common',d:42,f:.5,p:1,s:.008,a:0,l:.7},scrapper:{n:'Scrapper',r:'common',d:8,f:.06,p:1,s:.05,a:1,l:.65},
 carbine:{n:'Burst Carbine',r:'rare',d:19,f:.1,p:1,s:.018,a:1,l:1.1},dmr:{n:'Hunter DMR',r:'rare',d:58,f:.55,p:1,s:.004,a:0,l:1.3},
 lmg:{n:'Thunder LMG',r:'epic',d:21,f:.08,p:1,s:.03,a:1,l:1.4},ripper:{n:'Ripper',r:'epic',d:11,f:.38,p:7,s:.08,a:1,l:1.0},
 rail:{n:'Railgun',r:'legendary',d:170,f:1.4,p:1,s:0,a:0,l:1.6},minigun:{n:'Inferno Minigun',r:'legendary',d:15,f:.045,p:1,s:.035,a:1,l:1.5},
 mac:{n:'Mac-10',r:'common',d:10,f:.07,p:1,s:.04,a:1,l:.75},sawed:{n:'Sawed-Off',r:'common',d:11,f:.9,p:6,s:.12,a:0,l:.8},
 scout:{n:'Scout Rifle',r:'rare',d:40,f:.4,p:1,s:.003,a:0,l:1.25},pump:{n:'Riot Pump',r:'rare',d:15,f:.65,p:9,s:.08,a:0,l:1.15},
 blaster:{n:'Plasma Blaster',r:'epic',d:30,f:.16,p:1,s:.01,a:1,l:1.1},marksman:{n:'Viper Marksman',r:'epic',d:85,f:.8,p:1,s:.001,a:0,l:1.45},
 doom:{n:'Doomsday Cannon',r:'legendary',d:22,f:.9,p:14,s:.07,a:0,l:1.3},reaper:{n:'Reaper AR',r:'legendary',d:34,f:.09,p:1,s:.008,a:1,l:1.3},
 rustbucketx:{n:'Rustbucket',r:'common',d:27,f:0.315,p:1,s:0.0066,a:0,l:0.65}, alleycatx:{n:'Alley Cat',r:'common',d:9,f:0.074,p:1,s:0.0385,a:1,l:0.85}, patchworkx:{n:'Patchwork',r:'common',d:19,f:0.126,p:1,s:0.0154,a:1,l:1.2}, dustdevilx:{n:'Dustdevil',r:'common',d:11,f:0.788,p:8,s:0.099,a:0,l:1.05},
 tinstarx:{n:'Tin Star',r:'common',d:40,f:0.578,p:1,s:0.0077,a:0,l:0.8}, pocketrocketx:{n:'Pocket Rocket',r:'common',d:9,f:0.074,p:1,s:0.0385,a:1,l:0.85}, oldfaithfulx:{n:'Old Faithful',r:'common',d:27,f:0.315,p:1,s:0.0066,a:0,l:0.65}, junkyardarx:{n:'Junkyard AR',r:'common',d:19,f:0.126,p:1,s:0.0154,a:1,l:1.2},
 gutterblasterx:{n:'Gutter Blaster',r:'common',d:9,f:0.42,p:6,s:0.088,a:1,l:1.0}, hobohunterx:{n:'Hobo Hunter',r:'common',d:45,f:0.525,p:1,s:0.0044,a:0,l:1.3}, pipedreamx:{n:'Pipe Dream',r:'common',d:11,f:0.788,p:8,s:0.099,a:0,l:1.05}, sparkplugx:{n:'Spark Plug',r:'common',d:9,f:0.074,p:1,s:0.0385,a:1,l:0.85},
 steelrainx:{n:'Steel Rain',r:'rare',d:11,f:0.07,p:1,s:0.035,a:1,l:0.85}, nightfallx:{n:'Nightfall',r:'rare',d:55,f:0.5,p:1,s:0.004,a:0,l:1.3}, bulldogx:{n:'Bulldog',r:'rare',d:11,f:0.4,p:6,s:0.08,a:1,l:1.0}, cobrax:{n:'Cobra',r:'rare',d:33,f:0.3,p:1,s:0.006,a:0,l:0.65},
 hammerheadx:{n:'Hammerhead',r:'rare',d:13,f:0.75,p:8,s:0.09,a:0,l:1.05}, rangerarx:{n:'Ranger AR',r:'rare',d:23,f:0.12,p:1,s:0.014,a:1,l:1.2}, wraithsmgx:{n:'Wraith SMG',r:'rare',d:11,f:0.07,p:1,s:0.035,a:1,l:0.85}, galeforcex:{n:'Gale Force',r:'rare',d:23,f:0.12,p:1,s:0.014,a:1,l:1.2},
 lockjawx:{n:'Lockjaw',r:'rare',d:50,f:0.55,p:1,s:0.007,a:0,l:0.8}, pathfinderx:{n:'Pathfinder',r:'rare',d:55,f:0.5,p:1,s:0.004,a:0,l:1.3}, stingerx:{n:'Stinger',r:'rare',d:33,f:0.3,p:1,s:0.006,a:0,l:0.65}, backdraftx:{n:'Backdraft',r:'rare',d:11,f:0.4,p:6,s:0.08,a:1,l:1.0},
 ironcladlmgx:{n:'Ironclad LMG',r:'rare',d:19,f:0.08,p:1,s:0.03,a:1,l:1.4}, valkyriex:{n:'Valkyrie',r:'epic',d:27,f:0.114,p:1,s:0.0119,a:1,l:1.2}, tempestx:{n:'Tempest',r:'epic',d:13,f:0.067,p:1,s:0.0298,a:1,l:0.85}, bansheex:{n:'Banshee',r:'epic',d:130,f:1.045,p:1,s:0.0,a:0,l:1.5},
 hellhoundx:{n:'Hellhound',r:'epic',d:13,f:0.38,p:6,s:0.068,a:1,l:1.0}, archammerx:{n:'Arc Hammer',r:'epic',d:58,f:0.522,p:1,s:0.0059,a:0,l:0.8}, gravediggerx:{n:'Gravedigger',r:'epic',d:16,f:0.712,p:8,s:0.0765,a:0,l:1.05}, phantomx:{n:'Phantom',r:'epic',d:65,f:0.475,p:1,s:0.0034,a:0,l:1.3},
 cyclonelmgx:{n:'Cyclone LMG',r:'epic',d:22,f:0.076,p:1,s:0.0255,a:1,l:1.4}, voltaicx:{n:'Voltaic',r:'epic',d:27,f:0.114,p:1,s:0.0119,a:1,l:1.2}, dragonflyx:{n:'Dragonfly',r:'epic',d:13,f:0.067,p:1,s:0.0298,a:1,l:0.85}, obsidianx:{n:'Obsidian',r:'epic',d:130,f:1.045,p:1,s:0.0,a:0,l:1.5},
 warlordx:{n:'Warlord',r:'epic',d:22,f:0.076,p:1,s:0.0255,a:1,l:1.4}, sirenx:{n:'Siren',r:'epic',d:39,f:0.285,p:1,s:0.0051,a:0,l:0.65}, excaliburx:{n:'Excalibur',r:'legendary',d:78,f:0.44,p:1,s:0.0028,a:0,l:1.3}, ragnarokx:{n:'Ragnarok',r:'legendary',d:19,f:0.66,p:8,s:0.063,a:0,l:1.05},
 supernovax:{n:'Supernova',r:'legendary',d:33,f:0.106,p:1,s:0.0098,a:1,l:1.2}, oblivionx:{n:'Oblivion',r:'legendary',d:155,f:0.968,p:1,s:0.0,a:0,l:1.5}, hydrax:{n:'Hydra',r:'legendary',d:16,f:0.352,p:6,s:0.056,a:1,l:1.0}, zeuscannonx:{n:'Zeus Cannon',r:'legendary',d:70,f:0.484,p:1,s:0.0049,a:0,l:0.8},
 apexpredatorx:{n:'Apex Predator',r:'legendary',d:16,f:0.062,p:1,s:0.0245,a:1,l:0.85}, titanlmgx:{n:'Titan LMG',r:'legendary',d:26,f:0.07,p:1,s:0.021,a:1,l:1.4}, eclipsex:{n:'Eclipse',r:'legendary',d:78,f:0.44,p:1,s:0.0028,a:0,l:1.3}, wyrmfangx:{n:'Wyrmfang',r:'legendary',d:46,f:0.264,p:1,s:0.0042,a:0,l:0.65},
 singularityx:{n:'Singularity',r:'legendary',d:155,f:0.968,p:1,s:0.0,a:0,l:1.5}, armageddonx:{n:'Armageddon',r:'legendary',d:16,f:0.352,p:6,s:0.056,a:1,l:1.0},
 dumpsterfirex:{n:'Dumpster Fire',r:'common',d:9,f:0.42,p:6,s:0.088,a:1,l:1.0}, scrapsniperx:{n:'Scrap Sniper',r:'common',d:90,f:1.155,p:1,s:0.0,a:0,l:1.5}, bentbarrelx:{n:'Bent Barrel',r:'common',d:19,f:0.126,p:1,s:0.0154,a:1,l:1.2}, budgetlmgx:{n:'Budget LMG',r:'common',d:15,f:0.084,p:1,s:0.033,a:1,l:1.4},
 peashooterx:{n:'Peashooter',r:'common',d:27,f:0.315,p:1,s:0.0066,a:0,l:0.65}, longbowx:{n:'Longbow',r:'rare',d:110,f:1.1,p:1,s:0,a:0,l:1.5}, riotcontrolx:{n:'Riot Control',r:'rare',d:11,f:0.4,p:6,s:0.08,a:1,l:1.0}, falconx:{n:'Falcon',r:'rare',d:23,f:0.12,p:1,s:0.014,a:1,l:1.2},
 tomcatx:{n:'Tomcat',r:'rare',d:11,f:0.07,p:1,s:0.035,a:1,l:0.85}, gunslingerx:{n:'Gunslinger',r:'rare',d:50,f:0.55,p:1,s:0.007,a:0,l:0.8}, neonreaperx:{n:'Neon Reaper',r:'epic',d:13,f:0.067,p:1,s:0.0298,a:1,l:0.85}, stormbringerx:{n:'Stormbringer',r:'epic',d:27,f:0.114,p:1,s:0.0119,a:1,l:1.2},
 thunderclapx:{n:'Thunderclap',r:'epic',d:16,f:0.712,p:8,s:0.0765,a:0,l:1.05}, eagleeyex:{n:'Eagle Eye',r:'epic',d:65,f:0.475,p:1,s:0.0034,a:0,l:1.3}, juggernautx:{n:'Juggernaut',r:'epic',d:22,f:0.076,p:1,s:0.0255,a:1,l:1.4}, dragonbreathx:{n:'Dragonbreath',r:'legendary',d:19,f:0.66,p:8,s:0.063,a:0,l:1.05},
 voidwalkerx:{n:'Void Walker',r:'legendary',d:33,f:0.106,p:1,s:0.0098,a:1,l:1.2}, starfallx:{n:'Starfall',r:'legendary',d:155,f:0.968,p:1,s:0.0,a:0,l:1.5}, chaosenginex:{n:'Chaos Engine',r:'legendary',d:26,f:0.07,p:1,s:0.021,a:1,l:1.4}, judgmentx:{n:'Judgment',r:'legendary',d:70,f:0.484,p:1,s:0.0049,a:0,l:0.8},
 candycornx:{n:'Candy Corn Blaster',r:'common',d:11,f:.07,p:1,s:.035,a:1,l:.9,x:'spooky'},
 pumpkinsmasherx:{n:'Pumpkin Smasher',r:'rare',d:15,f:.7,p:9,s:.085,a:0,l:1.1,x:'spooky'},
 witchfirex:{n:'Witchfire',r:'epic',d:28,f:.11,p:1,s:.01,a:1,l:1.25,x:'spooky'},
 ghoulgatlingx:{n:'Ghoul Gatling',r:'legendary',d:17,f:.05,p:1,s:.03,a:1,l:1.5,x:'spooky'},
 headlesshorsemanx:{n:'Headless Horseman',r:'legendary',d:175,f:1.2,p:1,s:0,a:0,l:1.6,x:'spooky'},
 pixelpistolx:{n:'Pixel Pistol',r:'common',d:30,f:.28,p:1,s:.007,a:0,l:.7,x:'og',px:1},
 bitblasterx:{n:'8-Bit Blaster',r:'rare',d:11,f:.065,p:1,s:.03,a:1,l:.95,x:'og',px:1},
 arcadearx:{n:'Arcade AR',r:'epic',d:27,f:.11,p:1,s:.01,a:1,l:1.25,x:'og',px:1},
 gameoverx:{n:'Game Over',r:'legendary',d:180,f:1.15,p:1,s:0,a:0,l:1.6,x:'og',px:1},
 finalbossx:{n:'Final Boss',r:'legendary',d:15,f:.045,p:1,s:.03,a:1,l:1.5,x:'og',px:1}};
const SKINS={default:{n:'Factory Gray',r:'common',c:0x777b88},neon:{n:'Neon Green',r:'common',c:0x39ff14},crimson:{n:'Crimson',r:'rare',c:0xdc143c},ice:{n:'Glacier',r:'epic',c:0x66ccff},gold:{n:'Midas Gold',r:'legendary',c:0xffd23f},void:{n:'Void Purple',r:'legendary',c:0x8a2be2}};
const CR={basic:{n:'Basic Crate',col:'#ff8a1f',cost:100,w:[60,28,10,2]},elite:{n:'Elite Crate',col:'#b45cff',cost:300,w:[0,50,35,15]},legend:{n:'Legendary Crate',col:'#ffb81f',cost:1000,w:[0,0,25,75]}};
const LIM={spooky:{n:'Spooky Crate',col:'#ff6a00',cost:500,w:[40,30,20,10],ltd:1},og:{n:'OG Crate',col:'#39ff14',cost:500,w:[35,30,25,10],ltd:1}};
let limOn={};
const allCR=()=>{const o={...CR};for(const k in LIM){const d=limOn[k];if(d&&d.enabled===true)o[k]={...LIM[k],cost:+d.cost>0?+d.cost:LIM[k].cost}}return o};
async function refreshLim(){try{if(window.cloud&&cloud.user&&cloud.limited){limOn=await cloud.limited();if(!rolling&&(!playing||paused))menu()}}catch(e){console.warn('limited crates',e)}}
let S={coins:250,guns:['pistol'],skins:['default'],gun:'pistol',skin:'default',best:0,kills:0,xp:0,runs:0,sens:1,vol:1,bloom:true,nick:'',hot:['pistol']};

const save=()=>{if(window.cloud&&cloud.user&&!window.tradeLock)cloud.save(S)};
let AC;function beep(f,d,t,v){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=t||'square';o.frequency.value=f;g.gain.value=(v||.04)*(S.vol==null?1:S.vol);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}

/* ---------- menu / shop / locker ---------- */
let tab='play',cu=null,sync='',gateDone=false;
const cleanNick=s=>String(s||'').replace(/[<>&"'`]/g,'').replace(/\s+/g,' ').trim().slice(0,16);
const shown=()=>S.nick||(cu&&cu.name)||'Player';
let hsel=0;
const cnt=(arr,id)=>{let n=0;for(const x of arr)if(x==id)n++;return n};
let curSlot=-1;
const csz=()=>{try{return +localStorage.getItem('cm_cw')||150}catch(e){return 150}};
function setCw(v){try{localStorage.setItem('cm_cw',v)}catch(e){}applyCw()}
function applyCw(){const v=csz(),g=$('inv');if(g){g.style.setProperty('--cw',v+'px');g.classList.toggle('tiny',v<140)}const r=$('cw');if(r&&+r.value!=v)r.value=v}
function fixHot(h,own){h=(h||[]).slice(0,5);while(h.length<5)h.push('');const used={};return h.map(g=>{if(!g||!GUNS[g])return '';used[g]=(used[g]||0)+1;return used[g]<=cnt(own,g)?g:''})}
const gScore=g=>g.d*g.p/g.f;
const gSort=(x,y)=>{const A=GUNS[x],B=GUNS[y];return (!!B.x-!!A.x)||(RK.indexOf(B.r)-RK.indexOf(A.r))||(gScore(B)-gScore(A))};
const sSort=(x,y)=>RK.indexOf(SKINS[y].r)-RK.indexOf(SKINS[x].r);
const LT=g=>g&&g.x?'<span class="ltag">LIMITED</span>':'';
const hexc=c=>'#'+c.toString(16).padStart(6,'0'),lvOf=x=>Math.floor(Math.sqrt((x||0)/60))+1;
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;$('toasts').appendChild(d);setTimeout(()=>d.remove(),2600)}
function feed(t){const d=document.createElement('div');d.textContent=t;$('feed').appendChild(d);setTimeout(()=>d.remove(),1600)}
function setTab(t){tab=t;menu();if(t=='crates')refreshLim();if(t=='lb')loadLb()}
function showMenu(){$('sub').textContent='Fight the bots. Earn coins. Crack crates.';menu();$('menu').style.display='flex'}
function closeRs(){$('results').style.display='none'}
function closeRv(){$('reveal').style.display='none';rolling=false;menu()}
function endRun(){if(playing&&paused)over()}
function saveNick(){const v=cleanNick($('o-nick').value);S.nick=v;$('o-nick').value=v;save();menu();toast(v?'Username saved: '+v:'Username cleared - showing your account name')}
function opt(){S.sens=+$('o-sens').value;S.vol=+$('o-vol').value;S.bloom=$('o-bloom').checked;$('v-sens').textContent=S.sens.toFixed(1);save()}
const pixSvg=(id,col)=>{const l=GUNS[id].l,n=Math.round(9+l*7),u=3,r=[];
 const px=(x,y,w,h,f)=>r.push(`<rect x="${x*u}" y="${y*u}" width="${w*u}" height="${h*u}" fill="${f}"/>`);
 const k='#14161d',s=col,lt='#ffffff55';
 px(2,5,n,1,k);px(2,6,n,3,s);px(2,9,n,1,k);px(2,6,n,1,lt); // body
 px(2+n,6,3+Math.round(l*2),1,k);px(2+n,7,3+Math.round(l*2),1,s); // barrel
 px(2,6,2,1,k);px(0,7,2,3,k); // stock
 px(4,10,2,3,k);px(6,13,1,1,k);px(5,9,1,1,s); // grip steps
 px(n-3,10,2,2,k);px(Math.round(n/2),4,2,1,'#38e1ff');px(n,4,1,1,'#38e1ff'); // mag + sights
 return `<svg viewBox="0 0 ${(n+10)*u} ${15*u}" shape-rendering="crispEdges" style="image-rendering:pixelated">${r.join('')}</svg>`};
const gunSvg=(id,col)=>{if(GUNS[id].px)return pixSvg(id,col);const l=GUNS[id].l,w=60+l*70;return `<svg viewBox="0 0 220 90"><rect x="20" y="30" width="${w}" height="20" rx="5" fill="${col}"/><rect x="${20+w}" y="35" width="${20+l*10}" height="9" fill="#14161d"/><rect x="30" y="50" width="16" height="32" rx="4" fill="#14161d" transform="rotate(14 38 50)"/><rect x="${w-10}" y="50" width="14" height="14" fill="#14161d"/><rect x="24" y="35" width="${w-8}" height="3" fill="#38e1ff"/></svg>`};
const stat=(n,v)=>`<div class="bar"><em>${n}</em><i><u style="width:${Math.max(4,Math.min(100,v))}%"></u></i></div>`;
function menu(){
 const xp=S.xp||0,lv=lvOf(xp),lo=60*(lv-1)**2,hi=60*lv*lv;
 $('coins').textContent=S.coins.toLocaleString();
 $('chip').innerHTML=`<div class="av">${shown()[0].toUpperCase()}</div><div class="who"><b>${shown()}</b><small>LV ${lv} · ${sync||'synced'}</small><div class="xp"><i style="width:${Math.round((xp-lo)/(hi-lo)*100)}%"></i></div></div><button class="sm" onclick="cloud.logout()">Sign out</button>`;
 document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.t==tab));
 document.querySelectorAll('.pane').forEach(p=>p.style.display=p.id=='p-'+tab?'block':'none');
 $('play').textContent=playing&&paused?'RESUME':'PLAY';$('endrun').style.display=playing&&paused?'inline-block':'none';
 $('stats').innerHTML=[['Best wave',S.best||0],['Total kills',S.kills||0],['Runs',S.runs||0],['Level',lv]].map(a=>`<div><b>${a[1]}</b>${a[0]}</div>`).join('');
 $('crates').innerHTML=Object.entries(allCR()).map(([k,c])=>{return `<div class="crate ${c.ltd?'ltd':''}" style="--c:${c.col}">${c.ltd?'<span class="tag">LIMITED</span>':''}<div class="cbox"></div><b>${c.n}</b><div class="odds">${RK.map((r,i)=>c.w[i]?`<div><span style="color:${R[r]}">${r}</span><i><u style="width:${c.w[i]}%;background:${R[r]}"></u></i><em>${c.w[i]}%</em></div>`:'').join('')}</div><div class="cbtns"><button class="big" onclick="openCrate('${k}')">OPEN · <i class="coin"></i>${c.cost}</button><button class="big ten" onclick="openTen('${k}')">OPEN ×10 · <i class="coin"></i>${c.cost*10}</button></div></div>`}).join('');
 const sk=hexc(SKINS[S.skin].c);
 S.hot=fixHot(S.hot,S.guns);
 $('hotl').innerHTML=S.hot.map((g,i)=>{const G=GUNS[g];return `<div class="hs ${hsel==i?'sel':''}" style="--c:${G?R[G.r]:'#555'}" onclick="hset(${i})"><em>${i+1}</em>${G?`<b>${G.n}</b>${LT(G)}<small>${G.r}</small><button class="x" onclick="event.stopPropagation();hclr(${i})">✕</button>`:'<small>empty</small>'}</div>`}).join('');
 const grp={};S.guns.forEach(id=>{if(GUNS[id])grp[id]=(grp[id]||0)+1});
 $('inv').innerHTML=Object.keys(grp).sort(gSort).map(id=>{const G=GUNS[id],n=grp[id],hs=S.hot.map((g,i)=>g==id?i+1:0).filter(Boolean);return `<div class="wcard ${S.gun==id?'on':''}" style="--c:${R[G.r]}">${n>1?`<i class="cnt">×${n}</i>`:''}${gunSvg(id,sk)}<b>${G.n}</b>${LT(G)}<small>${G.r}</small><div class="bars">${stat('DMG',G.d*G.p*.9)}${stat('RATE',10/G.f)}${stat('ACC',100-G.s*600)}</div><button onclick="eq('guns','${id}')">${S.gun==id?'Equipped':'Equip'}</button><button class="ghost" onclick="toSlot('${id}')">${hs.length?'Slot '+hs.join(',')+' · '+(hs.includes(hsel+1)?'in '+(hsel+1):(hs.length<n?'add to ':'move to ')+(hsel+1)):'Put in slot '+(hsel+1)}</button></div>`}).join('');
 applyCw();
 $('skins').innerHTML=S.skins.filter(id=>SKINS[id]).sort(sSort).map(id=>{const K=SKINS[id],own=true;return `<button class="sw2 ${own?'':'lock'} ${S.skin==id?'on':''}" style="--c:${R[K.r]}" ${own?`onclick="eq('skins','${id}')"`:'disabled'}><span style="background:${hexc(K.c)}"></span>${K.n}<small>${own?K.r:'locked'}</small></button>`}).join('');
 if(document.activeElement!==$('o-nick'))$('o-nick').value=S.nick||'';$('o-sens').value=S.sens||1;$('o-vol').value=S.vol==null?1:S.vol;$('o-bloom').checked=S.bloom!==false;$('v-sens').textContent=(S.sens||1).toFixed(1);
 if(typeof renderTrade=='function')renderTrade();
 if(tab=='lb')renderLb();
}
let rolling=false;
function openCrate(k){
 if(rolling)return;if(window.tradeLock){toast('Finish your trade first');return}const c=allCR()[k];if(!c){toast('This crate is no longer available');menu();return}if(S.coins<c.cost){toast('Not enough coins - win some in a match!');return}
 rolling=true;S.coins-=c.cost;
 const pick=w=>{let x=Math.random()*100,i=0;for(;i<3;i++){if((x-=w[i])<0)break}return i};
 const rar=RK[pick(c.w)],pool=[];
 for(const g in GUNS)if(g!='pistol'&&GUNS[g].r==rar&&(!GUNS[g].x||GUNS[g].x==k)){pool.push(['guns',g]);if(GUNS[g].x)pool.push(['guns',g])}
 for(const q in SKINS)if(q!='default'&&SKINS[q].r==rar)pool.push(['skins',q]);
 const [t,id]=pool[Math.random()*pool.length|0],it=(t=='guns'?GUNS:SKINS)[id],dup=S[t].includes(id),bk=Math.round(c.cost*.4);
 if(t=='skins'&&dup)S.coins+=bk;else{S[t].push(id);if(t=='guns'){S.hot=fixHot(S.hot,S.guns);if(!dup){const e=S.hot.indexOf('');if(e>=0)S.hot[e]=id}}}
 save();$('coins').textContent=S.coins.toLocaleString();
 const rv=$('reveal');rv.style.display='flex';rv.className='';
 rv.innerHTML=`<div class="shake" style="--c:${c.col}"><div class="cbox" style="transform:scale(2)"></div></div>`;beep(180,.8,'sawtooth',.06);
 setTimeout(()=>{
  const W=54,N=64,cards=[];for(let i=0;i<N;i++)cards.push(RK[pick(c.w)]);cards[W]=rar;if(rar!='legendary'&&Math.random()<.6)cards[W+1]='legendary';
  rv.innerHTML=`<div class="rtitle">OPENING ${c.n.toUpperCase()}</div><div class="roll"><div class="marker"></div><div class="strip" id="strip">${cards.map(r=>`<div class="rc" style="--c:${R[r]}"><b>?</b><small>${r}</small></div>`).join('')}</div></div><button class="link" id="skip">Skip</button>`;
  const strip=$('strip'),vw=strip.parentElement.clientWidth,tx=W*140+65+(Math.random()*80-40)-vw/2;
  let done=false,last=-1,raf;
  const tick=()=>{const x=-new DOMMatrixReadOnly(getComputedStyle(strip).transform).m41,i=Math.floor((x+vw/2)/140);if(i!=last){last=i;beep(260+(i%5)*25,.03,'square',.03)}if(!done)raf=requestAnimationFrame(tick)};
  const fin=skip=>{if(done)return;done=true;cancelAnimationFrame(raf);
   if(skip){strip.style.transition='none';strip.style.transform=`translateX(${-tx}px)`}
   const wc=strip.children[W];wc.classList.add('win');
   wc.innerHTML=(t=='guns'?gunSvg(id,hexc(SKINS[S.skin].c)):`<div class="swc" style="background:${hexc(it.c)}"></div>`)+`<small>${it.n}</small>${LT(it)}`;
   strip.classList.add('done');rv.className='hit';const sk=$('skip');if(sk)sk.remove();
   beep(rar=='legendary'?880:rar=='epic'?660:440,.5,'triangle',.09);
   setTimeout(()=>{rv.className='r-'+rar;
    rv.innerHTML=`<div class="beam"></div><div class="rcard" style="--c:${R[rar]}"><small>${rar.toUpperCase()} ${t=='guns'?'WEAPON':'SKIN'}</small>${t=='guns'?gunSvg(id,hexc(SKINS[S.skin].c)):`<div class="swc" style="background:${hexc(it.c)}"></div>`}<h2>${it.n}</h2>${LT(it)}<p>${dup?(t=='guns'?'Duplicate · you now own ×'+cnt(S.guns,id):'Duplicate · +'+bk+' <i class="coin"></i> back'):'NEW ITEM UNLOCKED!'}</p><button class="big" onclick="closeRv()">NICE</button></div>`},1500)};
  setTimeout(()=>{strip.style.transition='transform 6.5s cubic-bezier(.08,.6,.12,1)';strip.style.transform=`translateX(${-tx}px)`;tick()},60);
  strip.addEventListener('transitionend',()=>fin(false),{once:true});
  $('skip').onclick=()=>fin(true);
 },900);
}
function rollItem(c,k){
 const pick=w=>{let x=Math.random()*100,i=0;for(;i<3;i++){if((x-=w[i])<0)break}return i};
 const rar=RK[pick(c.w)],pool=[];
 for(const g in GUNS)if(g!='pistol'&&GUNS[g].r==rar&&(!GUNS[g].x||GUNS[g].x==k)){pool.push(['guns',g]);if(GUNS[g].x)pool.push(['guns',g])}
 for(const q in SKINS)if(q!='default'&&SKINS[q].r==rar)pool.push(['skins',q]);
 const [t,id]=pool[Math.random()*pool.length|0],it=(t=='guns'?GUNS:SKINS)[id],dup=S[t].includes(id),bk=Math.round(c.cost*.4);
 if(t=='skins'&&dup)S.coins+=bk;else{S[t].push(id);if(t=='guns'&&!dup){S.hot=fixHot(S.hot,S.guns);const e=S.hot.indexOf('');if(e>=0)S.hot[e]=id}}
 return{t,id,it,rar,dup,bk}}
function openTen(k){
 if(rolling)return;if(window.tradeLock){toast('Finish your trade first');return}const c=allCR()[k];if(!c){toast('This crate is no longer available');menu();return}
 const cost=c.cost*10;if(S.coins<cost){toast('Not enough coins for 10 crates');return}
 rolling=true;S.coins-=cost;
 const res=[];for(let i=0;i<10;i++)res.push(rollItem(c,k));
 save();$('coins').textContent=S.coins.toLocaleString();
 const sk=hexc(SKINS[S.skin].c),back=res.reduce((n,r)=>n+(r.t=='skins'&&r.dup?r.bk:0),0),best=res.reduce((b,r)=>Math.max(b,RK.indexOf(r.rar)),0);
 const sorted=[...res].sort((x,y)=>RK.indexOf(y.rar)-RK.indexOf(x.rar));
 const rv=$('reveal');rv.style.display='flex';rv.className='r-'+RK[best];
 rv.innerHTML=`<div class="beam"></div><div class="tenp"><h2>${c.n} ×10</h2><div class="teng">${sorted.map(r=>`<div class="tc" style="--c:${R[r.rar]}">${r.t=='guns'?gunSvg(r.id,sk):`<div class="swc" style="background:${hexc(r.it.c)}"></div>`}<b>${r.it.n}</b>${LT(r.it)}<small>${r.rar}</small><em>${r.t=='guns'?(r.dup?'×'+cnt(S.guns,r.id):'NEW'):(r.dup?'+'+r.bk+' back':'NEW')}</em></div>`).join('')}</div>${back?`<p class="note">Duplicate skins refunded <i class="coin"></i>${back}</p>`:''}<button class="big" onclick="closeRv()">NICE</button></div>`;
 beep(RK[best]=='legendary'?880:660,.5,'triangle',.09)}
function hset(i){hsel=i;menu()}
let lb=null,lbErr='',lbAt=0;
const lbUrl=()=>(typeof TRADE_URL=='string'?TRADE_URL:'').replace(/^ws/,'http')+'/leaderboard';
function loadLb(){if(Date.now()-lbAt<15000&&lb)return;lbAt=Date.now();lbErr='';
 fetch(lbUrl()).then(r=>r.json()).then(d=>{lb=d;renderLb()}).catch(()=>{lbErr='Could not reach the server (it may be waking up) - try again in a moment.';renderLb()})}
function renderLb(){const el=$('lb');if(!el)return;
 const esc2=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 if(!lb){el.innerHTML=`<p class="hint">${lbErr||'Loading leaderboard…'}</p>`;return}
 el.innerHTML=`<div class="lbh"><span>#</span><span>Player</span><span>Best wave</span><span>Kills</span></div>`+(lb.length?lb.map((p,i)=>`<div class="lbr ${cu&&p.uid==cu.uid?'me':''}"><span>${i+1}</span><span>${esc2(p.name)}</span><span>${p.best}</span><span>${p.kills}</span></div>`).join(''):'<p class="hint">No scores yet.</p>')+`<p class="hint">${lbErr?esc2(lbErr)+' · ':''}Ranked by best wave, then total kills. <button class="sm" onclick="lbAt=0;loadLb()">Refresh</button></p>`}
function hclr(i){S.hot[i]='';if(curSlot==i)curSlot=-1;save();menu();applyGun()}
function toSlot(id){S.hot=fixHot(S.hot,S.guns);const at=hsel;
 if(S.hot[at]!=id){const o=S.hot.indexOf(id);
  if(cnt(S.hot,id)>=cnt(S.guns,id)&&o>=0)S.hot[o]=S.hot[at]; // no spare copy: move/swap
  S.hot[at]=id}
 S.gun=id;curSlot=at;const n=S.hot.indexOf('',at+1);save();hsel=n>=0?n:hsel;menu();applyGun();toast(GUNS[id].n+' → slot '+(at+1))}
function eq(t,id){if(t=='guns')S.gun=id;else S.skin=id;save();menu();applyGun()}
const rd=$('radar'),rg=rd.getContext('2d');
function radar(){const c=70,k=2.2;rg.clearRect(0,0,140,140);rg.save();rg.translate(c,c);rg.rotate(yaw);
 rg.fillStyle='#ffffff2a';for(const o of obs)rg.fillRect((o.x-P.x)*k-o.w*k,(o.z-P.z)*k-o.d*k,o.w*2*k,o.d*2*k);
 rg.fillStyle='#ff4a3a';rg.fillStyle='#3dff7a';for(const q of kits){const x=(q.position.x-P.x)*k,y=(q.position.z-P.z)*k;if(x*x+y*y<c*c){rg.fillRect(x-3,y-3,6,6)}}rg.fillStyle='#ff4a3a';for(const b of bots){const x=(b.position.x-P.x)*k,y=(b.position.z-P.z)*k;if(x*x+y*y<c*c){rg.beginPath();rg.arc(x,y,3.2,0,6.3);rg.fill()}}
 rg.restore();rg.fillStyle='#38e1ff';rg.beginPath();rg.moveTo(c,c-7);rg.lineTo(c-5,c+5);rg.lineTo(c+5,c+5);rg.fill()}

/* ---------- three.js scene ---------- */
const cv=$('c'),ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
ren.setPixelRatio(Math.min(devicePixelRatio,2));
ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.2;
ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
const sc=new THREE.Scene();sc.fog=new THREE.FogExp2(0x0d1226,.02);
const cam=new THREE.PerspectiveCamera(75,1,.1,100);cam.rotation.order='YXZ';sc.add(cam);
let comp=null,fxp=null,bloom=null;function rs(){ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();if(comp){comp.setSize(innerWidth,innerHeight);bloom.resolution.set(innerWidth,innerHeight)}}
addEventListener('resize',rs);rs();
function ctex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;if(rep)t.repeat.set(rep,rep);return t}
const noise=(g,w,h,n,a)=>{for(let i=0;i<n;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*a})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}};
const floorT=ctex(256,256,(g,w,h)=>{g.fillStyle='#1a2036';g.fillRect(0,0,w,h);noise(g,w,h,2500,.06);g.strokeStyle='#38e1ff66';g.lineWidth=4;g.strokeRect(2,2,w-4,h-4);g.strokeStyle='#ffffff14';g.lineWidth=1;g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke()},15);
const panT=ctex(128,128,(g,w,h)=>{g.fillStyle='#3a4468';g.fillRect(0,0,w,h);noise(g,w,h,900,.08);g.strokeStyle='#000a';g.lineWidth=6;g.strokeRect(0,0,w,h);g.fillStyle='#ffffff18';g.fillRect(10,10,w-20,5);g.fillStyle='#0006';[[14,60],[w-22,60]].forEach(a=>g.fillRect(a[0],a[1],8,8))});
const skyT=ctex(1024,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#04060e');gr.addColorStop(.5,'#141b3a');gr.addColorStop(.72,'#3a2a5c');gr.addColorStop(1,'#0d1226');g.fillStyle=gr;g.fillRect(0,0,w,h);for(let i=0;i<600;i++){g.fillStyle=`rgba(255,255,255,${Math.random()})`;const z=Math.random()*1.8;g.fillRect(Math.random()*w,Math.random()*h*.6,z,z)}const rg=g.createRadialGradient(780,90,2,780,90,70);rg.addColorStop(0,'#fff');rg.addColorStop(.15,'#dfe8ff');rg.addColorStop(1,'#dfe8ff00');g.fillStyle=rg;g.fillRect(700,10,170,170)});
const sky=new THREE.Mesh(new THREE.SphereGeometry(90,32,16),new THREE.MeshBasicMaterial({map:skyT,side:THREE.BackSide,fog:false}));sc.add(sky);
const envS=new THREE.Scene();envS.add(sky.clone());sc.environment=new THREE.PMREMGenerator(ren).fromScene(envS).texture;
sc.add(new THREE.HemisphereLight(0x7088ff,0x1a1020,.6));
const sun=new THREE.DirectionalLight(0xbfd0ff,1.5);sun.position.set(14,26,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
const sh=sun.shadow.camera;sh.left=sh.bottom=-36;sh.right=sh.top=36;sh.near=1;sh.far=80;sun.shadow.bias=-.0004;sc.add(sun);
[[24,24,0x38e1ff],[-24,24,0xff3ad0],[24,-24,0xff3ad0],[-24,-24,0x38e1ff]].forEach(a=>{const l=new THREE.PointLight(a[2],1.6,42);l.position.set(a[0],6,a[1]);sc.add(l)});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({map:floorT,roughness:.35,metalness:.6}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.material.bumpMap=floorT;floor.material.bumpScale=1.5;sc.add(floor);
const solid=[],obs=[];
function block(x,z,w,d,h,col,acc,tex){
 const t=(tex||panT).clone();t.needsUpdate=true;t.repeat.set(Math.max(1,w|0),Math.max(1,h|0));
 const m=new THREE.Mesh(new THREE.BoxGeometry(w*2,h,d*2),new THREE.MeshStandardMaterial({map:t,color:col,roughness:.5,metalness:.5}));
 m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;
 if(acc){m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:acc})));
  const st=new THREE.Mesh(new THREE.BoxGeometry(w*2+.04,.1,d*2+.04),new THREE.MeshBasicMaterial({color:acc}));st.position.y=h/2-.12;m.add(st)}
 sc.add(m);solid.push(m);return m}
[[0,-30.5,31,.5],[0,30.5,31,.5],[-30.5,0,.5,31],[30.5,0,.5,31]].forEach(a=>block(a[0],a[1],a[2],a[3],5,0xffffff,0x38e1ff));
for(let i=0;i<16;i++){let x,z;do{x=(Math.random()-.5)*50;z=(Math.random()-.5)*50}while(Math.hypot(x,z)<7);
 const w=1+Math.random()*1.6,d=1+Math.random()*1.6;block(x,z,w,d,2+Math.random()*1.8,i%3?0xdde4ff:0xe6d2ff,i%3?0x38e1ff:0xff3ad0);obs.push({x,z,w,d})}
const crateT=ctex(128,128,(g,w,h)=>{g.fillStyle='#6b4a2a';g.fillRect(0,0,w,h);for(let i=0;i<40;i++){g.fillStyle=`rgba(0,0,0,${Math.random()*.15})`;g.fillRect(0,Math.random()*h,w,2)}g.strokeStyle='#2a2f3d';g.lineWidth=14;g.strokeRect(7,7,w-14,h-14);g.beginPath();g.moveTo(0,0);g.lineTo(w,h);g.moveTo(w,0);g.lineTo(0,h);g.stroke();g.fillStyle='#ff8a1f';g.fillRect(w/2-12,w/2-12,24,24)});
for(let i=0;i<6;i++){let x,z;do{x=(Math.random()-.5)*50;z=(Math.random()-.5)*50}while(Math.hypot(x,z)<8);block(x,z,1.1,1.1,2.2,0xffffff,0xff8a1f,crateT);obs.push({x,z,w:1.1,d:1.1})}
function collide(p,r){for(let it=0;it<2;it++){p.x=Math.max(-29,Math.min(29,p.x));p.z=Math.max(-29,Math.min(29,p.z));
 for(const o of obs){const dx=p.x-o.x,dz=p.z-o.z,ox=o.w+r-Math.abs(dx),oz=o.d+r-Math.abs(dz);if(ox>0&&oz>0){if(ox<oz)p.x+=ox*(dx<0?-1:1);else p.z+=oz*(dz<0?-1:1)}}}}

/* gun viewmodel */
const gun=new THREE.Group(),gm=new THREE.MeshStandardMaterial({color:0x777b88,metalness:.85,roughness:.28}),
 dk=new THREE.MeshStandardMaterial({color:0x14161d,metalness:.7,roughness:.45}),glow=new THREE.MeshBasicMaterial({color:0x38e1ff});
const gp=(geo,mat,x,y,z,rx)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);if(rx)o.rotation.x=rx;gun.add(o)};
const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
gp(B(.085,.11,.5),gm,0,0,0);gp(B(.04,.04,.42),dk,0,.01,-.43);gp(B(.065,.065,.06),gm,0,.01,-.66);
gp(B(.07,.17,.09),dk,0,-.13,.16,.25);gp(B(.06,.16,.08),dk,0,-.12,-.05);gp(B(.03,.04,.1),dk,0,.075,-.1);
gp(B(.012,.012,.36),glow,.044,.03,-.02);gp(B(.012,.012,.36),glow,-.044,.03,-.02);
cam.add(gun);
const glowTex=ctex(64,64,(g,w,h)=>{const r=g.createRadialGradient(32,32,1,32,32,32);r.addColorStop(0,'#fff');r.addColorStop(.25,'#ffd070');r.addColorStop(1,'#ff800000');g.fillStyle=r;g.fillRect(0,0,w,h)});
const flashM=new THREE.Mesh(new THREE.PlaneGeometry(.55,.55),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false,opacity:0}));
flashM.position.set(.33,-.29,-1.15);cam.add(flashM);
const mLight=new THREE.PointLight(0xffb050,0,9);mLight.position.set(.33,-.24,-1.1);cam.add(mLight);
function drawHot(){const el=$('hotbar');if(!el)return;el.innerHTML=S.hot.map((g,i)=>{const G=GUNS[g];return `<div class="hb ${g&&g==S.gun&&(curSlot<0||S.hot[curSlot]!=S.gun||curSlot==i)?'on':''} ${G?'':'em'}" style="--c:${G?R[G.r]:'#555'}"><em>${i+1}</em>${G?`${gunSvg(g,'#9aa4c4')}<b>${G.n}</b>${LT(G)}`:''}</div>`}).join('')}
function applyGun(){const G=GUNS[S.gun];swapT=1;drawHot();gm.color.setHex(SKINS[S.skin].c);gun.scale.z=G.l;$('wpn').innerHTML=`${G.n}<br><small style="color:${R[G.r]}">${SKINS[S.skin].n}</small>`}
/* decor */
const emb=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.MeshBasicMaterial({map:ctex(512,512,(g)=>{g.strokeStyle='#ff8a1f';g.lineWidth=10;g.shadowColor='#ff8a1f';g.shadowBlur=24;g.beginPath();g.arc(256,256,200,0,6.283);g.stroke();g.lineWidth=5;g.strokeRect(166,166,180,180);g.font='bold 54px system-ui';g.textAlign='center';g.fillStyle='#ff8a1f';g.fillText('CM',256,275)}),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
emb.rotation.x=-Math.PI/2;emb.position.y=.03;sc.add(emb);
const rings=[];[[24,24,0x38e1ff],[-24,24,0xff3ad0],[24,-24,0xff3ad0],[-24,-24,0x38e1ff]].forEach(a=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,9,12),new THREE.MeshBasicMaterial({color:a[2]}));c.position.set(a[0],4.5,a[1]);sc.add(c);
 for(let k=0;k<2;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.2+k*.5,.05,8,40),new THREE.MeshBasicMaterial({color:a[2]}));r.position.set(a[0],3+k*2.5,a[1]);r.rotation.x=1.2;r.k=k;sc.add(r);rings.push(r)}});
const dp=new Float32Array(900);for(let i=0;i<900;i+=3){dp[i]=(Math.random()-.5)*58;dp[i+1]=Math.random()*9;dp[i+2]=(Math.random()-.5)*58}
const dustG=new THREE.BufferGeometry();dustG.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dust=new THREE.Points(dustG,new THREE.PointsMaterial({size:.14,map:glowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:0x9fb4ff,opacity:.7}));sc.add(dust);
/* post-processing: bloom + vignette + chromatic aberration + grain */
const FX={uniforms:{tDiffuse:{value:null},t:{value:0},h:{value:0}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'uniform sampler2D tDiffuse;uniform float t;uniform float h;varying vec2 v;float r(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec2 c=v-.5;float d=dot(c,c);vec2 o=c*d*.025;vec3 col=vec3(texture2D(tDiffuse,v+o).r,texture2D(tDiffuse,v).g,texture2D(tDiffuse,v-o).b);col*=1.-d*1.4;col.r+=h*d*3.;col=(col-.5)*1.1+.5;col+=(r(v*800.+t)-.5)*.03;gl_FragColor=vec4(col,1.);}'};
try{const pr=Math.min(devicePixelRatio,2);
 comp=new THREE.EffectComposer(ren,new THREE.WebGLMultisampleRenderTarget(innerWidth*pr,innerHeight*pr,{format:THREE.RGBAFormat}));comp.setPixelRatio(pr);
 comp.addPass(new THREE.RenderPass(sc,cam));
 bloom=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.8,.6,.65);comp.addPass(bloom);
 fxp=new THREE.ShaderPass(FX);comp.addPass(fxp);comp.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));comp.setSize(innerWidth,innerHeight)}catch(e){comp=null}
/* bullet decals */
const dM=new THREE.MeshBasicMaterial({map:ctex(32,32,(g)=>{const r=g.createRadialGradient(16,16,1,16,16,15);r.addColorStop(0,'#000');r.addColorStop(.5,'#000a');r.addColorStop(1,'#0000');g.fillStyle=r;g.fillRect(0,0,32,32)}),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4}),dg=new THREE.PlaneGeometry(.22,.22),decs=[];let di=0;
function decal(p,n){const k=di++%40;let m=decs[k];if(!m){m=new THREE.Mesh(dg,dM);sc.add(m);decs[k]=m}m.position.copy(p).addScaledVector(n,.02);m.lookAt(p.clone().add(n))}
/* particles */
const pg=new THREE.BoxGeometry(.07,.07,.07),pmat=[0xffd27a,0xff4a2a,0x8fe8ff].map(c=>new THREE.MeshBasicMaterial({color:c})),pts=[];
function burst(pos,n,ci,spd){for(let i=0;i<n;i++){const m=new THREE.Mesh(pg,pmat[ci]);m.position.copy(pos);m.v=new THREE.Vector3(Math.random()-.5,Math.random()*.9,Math.random()-.5).multiplyScalar(spd*(.4+Math.random()));m.life=m.max=.35+Math.random()*.45;sc.add(m);pts.push(m)}}

/* ---------- game state ---------- */
const P=new THREE.Vector3(0,0,0),rc=new THREE.Raycaster(),bots=[],tr=[],dead=[],kits=[];
let playing=false,paused=false,locked=false,fallback=false,down=false;
let st={c:0,xp:0},yaw=0,pitch=0,hp=100,wave=0,kills=0,toSpawn=0,spT=0,nwT=0,waiting=false,next=0,now=0,kick=0,bob=0,botId=0,hmT=0,fT=0,mT=0,fH=0,swapT=0,jy=0,jv=0,landT=0,tR=0,sA=0;
const keys={};
function say(t){const m=$('msg');m.textContent=t;m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop')}
function hud(){$('hw').textContent=wave;$('hb').textContent=bots.length+toSpawn;$('hk').textContent=kills;$('hc').textContent=S.coins;$('hpn').textContent=Math.max(0,Math.ceil(hp));$('hp').style.width=Math.max(0,hp)+'%';$('hpw').classList.toggle('low',hp<35)}

/* ---------- animations ---------- */
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function animBot(g,dt,d){
 g.sp=Math.min(1,g.sp+dt*2.2);const sp=g.sp,pop=sp<1?ease(sp)*(1+Math.sin(sp*Math.PI)*.18):1;g.scale.setScalar(Math.max(.01,pop));
 g.rc=Math.max(0,g.rc-dt*4);const sw=Math.sin(g.ph),aim=g.cd<.45||g.rc>0;
 g.legs[0].rotation.x=sw*.7;g.legs[1].rotation.x=-sw*.7;
 g.legs[0].position.y=.28+Math.max(0,sw)*.08;g.legs[1].position.y=.28+Math.max(0,-sw)*.08;
 g.body.position.y=Math.abs(sw)*.07;
 g.body.rotation.x=.12+(g.fl>0?-.35*(g.fl/.08):0)-g.rc*.18;g.body.rotation.z=sw*.05;
 g.headG.rotation.y=aim?0:Math.sin(now*2+g.id)*.35;g.headG.rotation.x=aim?-.1:Math.sin(now*3+g.id)*.05;
 const tgt=aim?-1.35-g.rc*.35:0;
 g.arms[1].rotation.x+=((aim?tgt:-sw*.6)-g.arms[1].rotation.x)*Math.min(1,dt*18);
 g.arms[0].rotation.x+=((aim?tgt+.15:sw*.6)-g.arms[0].rotation.x)*Math.min(1,dt*18);
 g.eyes.color.setHex(aim?0xffffff:0xff2a2a);
}
function animDead(dt){
 for(let i=dead.length-1;i>=0;i--){const g=dead[i];g.dying+=dt;const t=Math.min(1,g.dying/.55);
  g.rotation.x=-ease(t)*1.5;g.position.y=-ease(t)*.15;g.arms[0].rotation.x=-t*2;g.arms[1].rotation.x=-t*1.6;g.legs[0].rotation.x=t*.4;
  if(g.dying>.8){const k=Math.max(.001,1-(g.dying-.8)/.35);g.scale.setScalar(k)}
  if(g.dying>1.15){sc.remove(g);dead.splice(i,1)}}
}
/* ---------- bot AI ---------- */
const AI_ANG=(a,b)=>{let d=b-a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d};
const _f=new THREE.Vector3(),_t=new THREE.Vector3(),_d=new THREE.Vector3();
function aiLos(g){_f.set(g.position.x,1.5,g.position.z);_d.set(P.x-_f.x,1.5+jy-_f.y,P.z-_f.z);const L=_d.length();_d.normalize();rc.set(_f,_d);rc.far=L;return !rc.intersectObjects(solid,false).length}
function coverPoint(g){let best=null,bd=1e9;for(const o of obs){const ax=o.x-P.x,az=o.z-P.z,al=Math.hypot(ax,az)||1,px=o.x+ax/al*(Math.max(o.w,o.d)+1.3),pz=o.z+az/al*(Math.max(o.w,o.d)+1.3);
  if(Math.abs(px)>28||Math.abs(pz)>28)continue;const dd=Math.hypot(px-g.position.x,pz-g.position.z)+Math.hypot(P.x-px,P.z-pz)*-.15;if(dd<bd){bd=dd;best={x:px,z:pz}}}return best}
function aiBot(g,dt){
 const R=g.R,px=g.position.x,pz=g.position.z;let dx=P.x-px,dz=P.z-pz;const d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;
 g.losT-=dt;if(g.losT<=0){g.los=d<45&&aiLos(g);g.losT=.12+Math.random()*.1}
 g.strT-=dt;if(g.strT<=0){g.side*=-1;g.strT=.8+Math.random()*1.8}
 g.hit=Math.max(0,g.hit-dt);if(g.hp<g.lastHp)g.hit=.6;g.lastHp=g.hp;
 let wx=0,wz=0,spd=1;const frac=g.hp/g.mx;
 // retreat to cover when badly hurt (not rushers)
 g.noCover=Math.max(0,(g.noCover||0)-dt);if(frac<.35&&g.role!=='rusher'&&d>5&&!g.noCover){if(!g.cover){g.cover=coverPoint(g);g.hideT=0}}else if(frac>=.35)g.cover=null;
 if(g.cover&&Math.hypot(g.cover.x-px,g.cover.z-pz)>1){const cx=g.cover.x-px,cz=g.cover.z-pz,cl=Math.hypot(cx,cz);wx=cx/cl;wz=cz/cl;spd=1.15}
 else if(g.cover){ // hiding behind cover, then peek back out
  g.hideT+=dt;if(g.los||g.hideT>2.5){g.cover=null;g.noCover=4}else{wx=wz=0;spd=0}}
 else if(!g.los&&d>3){ // no line of sight: go around, slide along the blocker
  wx=dx*.8-dz*g.side*.6;wz=dz*.8+dx*g.side*.6;spd=1.05}
 else if(d>R.hi){wx=dx;wz=dz;if(g.role==='rusher'||d>R.hi+8)spd=1.1}
 else if(d<R.lo){wx=-dx*.9-dz*g.side*.5;wz=-dz*.9+dx*g.side*.5;spd=.9}
 else{ // strafe, with dodges when the player is aiming at us
  wx=-dz*g.side;wz=dx*g.side;spd=.7;
  if(playing&&down){const lx=-Math.sin(yaw),lz=-Math.cos(yaw),al=-(dx*lx+dz*lz);if(al>.97){spd=1.6}}}
 // obstacle avoidance: repel from nearby blocks, slide around them
 for(const o of obs){const ax=px-o.x,az=pz-o.z,ex=Math.max(0,Math.abs(ax)-o.w),ez=Math.max(0,Math.abs(az)-o.d),dist=Math.hypot(ex,ez);
  if(dist<2.4){const k=(1-dist/2.4),rl=Math.hypot(ax,az)||1,rx=ax/rl,rz=az/rl;let tx=-rz,tz=rx;if(tx*wx+tz*wz<0){tx=-tx;tz=-tz}wx+=rx*k*1.5+tx*k*1.3;wz+=rz*k*1.5+tz*k*1.3}}
 // separation from other bots
 for(const b of bots){if(b===g)continue;const sx=px-b.position.x,sz=pz-b.position.z,sd=Math.hypot(sx,sz);if(sd<2&&sd>.001){const k=(2-sd)/2;wx+=sx/sd*k*1.6;wz+=sz/sd*k*1.6}}
 // keep off the arena walls
 if(Math.abs(px)>26)wx-=Math.sign(px)*.8;if(Math.abs(pz)>26)wz-=Math.sign(pz)*.8;
 const wl=Math.hypot(wx,wz);if(wl>0){wx/=wl;wz/=wl}else{wx=wz=0}
 const top=Math.min(6.2,(2.5+wave*.25))*R.spd*spd*(g.hit>0?.7:1);
 const ac=Math.min(1,dt*6);g.vx+=(wx*top-g.vx)*ac;g.vz+=(wz*top-g.vz)*ac;
 const ox=g.position.x,oz=g.position.z;g.position.x+=g.vx*dt;g.position.z+=g.vz*dt;collide(g.position,.6);
 // stuck detection: wiggle out by flipping side
 const mv=Math.hypot(g.position.x-ox,g.position.z-oz)/Math.max(dt,1e-4);
 if(top>1&&mv<top*.25){g.stuck+=dt;if(g.stuck>.5){g.side*=-1;g.strT=1.2;g.stuck=0;g.cover=null}}else g.stuck=Math.max(0,g.stuck-dt);
 // face the player smoothly (or the way we're running when no sight)
 const want=g.los||d<10?Math.atan2(P.x-px,P.z-pz):(Math.hypot(g.vx,g.vz)>.3?Math.atan2(g.vx,g.vz):g.rotation.y);
 g.rotation.y+=AI_ANG(g.rotation.y,want)*Math.min(1,dt*9);
 g.ph+=dt*(Math.hypot(g.vx,g.vz)*1.2);
 return d}
function aiShoot(g,dt,d){
 const R=g.R;g.cd-=dt*(g.los?1:.4);
 if(g.cd>0||d>=36||!g.los)return;
 g.cd=(1.0+Math.random()*1.3)*R.cd*Math.max(.55,1-wave*.03);g.rc=1;
 const from=new THREE.Vector3(g.position.x,1.5,g.position.z),to=new THREE.Vector3(P.x,1.4+jy,P.z);
 // accuracy drops with distance and when the player is moving / airborne, rises with wave
 const pm=(keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD)?.1:0,j=jy>0?.12:0;
 const acc=Math.max(.12,Math.min(.85,.62-d*.011-pm-j+wave*.012+(g.role==='sniper'?.18:0)));
 if(Math.random()<acc){tracer(from,to,0xff4040);hurt(Math.round((6+wave)*R.dmg));beep(160,.05,'sawtooth',.03)}
 else{to.x+=(Math.random()-.5)*2.4;to.y+=(Math.random()-.3)*1.6;to.z+=(Math.random()-.5)*2.4;tracer(from,to,0xff9040)}
}

/* ---------- medkits ---------- */
const kitM={w:new THREE.MeshStandardMaterial({color:0xf2f4f8,roughness:.4,emissive:0x223322}),r:new THREE.MeshBasicMaterial({color:0xff2a3a})};
function clearKits(){kits.forEach(k=>sc.remove(k));kits.length=0}
function spawnKits(){
 clearKits();const n=Math.min(4,1+Math.floor(wave/3)+(Math.random()<.5?1:0));
 for(let i=0;i<n;i++){
  const g=new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(.6,.45,.6),kitM.w));
  const c1=new THREE.Mesh(new THREE.BoxGeometry(.38,.47,.12),kitM.r),c2=new THREE.Mesh(new THREE.BoxGeometry(.12,.47,.38),kitM.r);g.add(c1,c2);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.5,.025,6,24),new THREE.MeshBasicMaterial({color:0x3dff7a}));ring.rotation.x=Math.PI/2;ring.position.y=-.3;g.add(ring);
  let ok=false;for(let t=0;t<30&&!ok;t++){g.position.set((Math.random()-.5)*52,0,(Math.random()-.5)*52);const x=g.position.x,z=g.position.z;collide(g.position,1);ok=Math.hypot(g.position.x-x,g.position.z-z)<.01&&Math.hypot(x-P.x,z-P.z)>5}
  g.userData.ph=Math.random()*6;g.position.y=.8;sc.add(g);kits.push(g)}
}
function animKits(dt){
 for(let i=kits.length-1;i>=0;i--){const k=kits[i];k.rotation.y+=dt*1.6;k.position.y=.8+Math.sin(now*2.5+k.userData.ph)*.15;
  if(Math.hypot(k.position.x-P.x,k.position.z-P.z)<1.4&&hp<100){hp=Math.min(100,hp+20);sc.remove(k);kits.splice(i,1);beep(660,.1,'sine',.06);setTimeout(()=>beep(990,.12,'sine',.06),90);feed('+20 HP');fH=1;hud()}}
}

function spawnBot(){
 const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xc2302a,metalness:.6,roughness:.4}),
 d=new THREE.MeshStandardMaterial({color:0x1b1d26,metalness:.7,roughness:.4}),e=new THREE.MeshBasicMaterial({color:0xff2a2a});
 g.parts=[];g.rotation.order='YXZ';
 const body=new THREE.Group(),headG=new THREE.Group(),armL=new THREE.Group(),armR=new THREE.Group();
 body.position.y=0;headG.position.y=0;armL.position.set(-.58,1.5,0);armR.position.set(.58,1.5,0);
 g.add(body);body.add(headG);g.add(armL,armR);
 const pt=(w,h,z,mat,px,py,pz,head,par)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,z),mat);o.position.set(px,py,pz);o.castShadow=true;o.userData={bot:g,head:head};(par||(head?headG:body)).add(o);g.parts.push(o);return o};
 pt(.85,1,.5,m,0,1,0);pt(.4,.14,.05,e,0,1.2,.26);pt(.9,.2,.55,d,0,.55,0);
 pt(.5,.44,.46,d,0,1.75,0,1);pt(.38,.1,.05,e,0,1.77,.24,1);pt(.04,.3,.04,d,.15,2.1,0,1);pt(.08,.08,.08,e,.15,2.28,0,1);
 pt(.3,.2,.42,m,0,0,0,0,armL);pt(.3,.2,.42,m,0,0,0,0,armR);pt(.2,.8,.22,d,0,-.5,0,0,armL);pt(.2,.8,.22,d,0,-.5,0,0,armR);
 g.legs=[pt(.3,.55,.35,d,-.22,.28,0,0,g),pt(.3,.55,.35,d,.22,.28,0,0,g)];
 const rr=Math.random(),role=wave<2||rr<.55?'grunt':rr<.78?'rusher':'sniper',RL={grunt:{lo:6,hi:12,spd:1,hp:1,dmg:1,cd:1,col:0xc2302a},rusher:{lo:2.5,hi:6,spd:1.35,hp:.7,dmg:.8,cd:.8,col:0xff7a1a},sniper:{lo:14,hi:22,spd:.8,hp:.8,dmg:1.6,cd:1.7,col:0x9a3cff}}[role];
 g.role=role;g.R=RL;m.color.setHex(RL.col);g.vx=g.vz=0;g.side=Math.random()<.5?-1:1;g.strT=1+Math.random()*2;g.los=false;g.losT=Math.random()*.2;g.hit=0;g.cover=null;g.stuck=0;g.lx=0;g.lz=0;g.lastHp=0;
 g.body=body;g.headG=headG;g.arms=[armL,armR];g.eyes=e;g.sp=0;g.rc=0;g.dying=0;
 g.mat=m;g.hp=g.mx=Math.round((50+wave*10)*RL.hp);g.bar=new THREE.Group();g.fill=new THREE.Mesh(new THREE.PlaneGeometry(.86,.06),new THREE.MeshBasicMaterial({color:0x3dff7a}));g.fill.position.z=.01;g.bar.add(new THREE.Mesh(new THREE.PlaneGeometry(.9,.1),new THREE.MeshBasicMaterial({color:0x111111})),g.fill);g.bar.position.y=2.55;g.add(g.bar);g.scale.setScalar(.01);g.cd=(1.5+Math.random()*2)*RL.cd;g.fl=0;g.ph=Math.random()*6;g.id=botId++;
 const an=Math.random()*6.283;g.position.set(Math.cos(an)*24,0,Math.sin(an)*24);collide(g.position,.6);collide(g.position,.6);
 sc.add(g);bots.push(g)}
function startWave(){wave++;spawnKits();toSpawn=3+wave*2;waiting=false;say('Wave '+wave);hud()}
function play(){if(!cu)return;if(window.tradeLock){toast('Finish your trade first');return}
 bots.forEach(b=>sc.remove(b));bots.length=0;dead.forEach(b=>sc.remove(b));dead.length=0;clearKits();swapT=0;jy=jv=landT=0;
 st={c:S.coins,xp:S.xp||0};P.set(0,0,0);yaw=pitch=0;hp=100;wave=0;kills=0;nwT=0;playing=true;paused=false;
 $('menu').style.display='none';$('hud').style.display='block';applyGun();startWave();lock()}
function lock(){try{const p=cv.requestPointerLock();if(p&&p.catch)p.catch(()=>fallback=true)}catch(e){fallback=true}}
function go(){if(playing&&paused){paused=false;$('menu').style.display='none';lock()}else play()}
function pause(){if(!playing||paused)return;paused=true;down=false;$('sub').textContent='Paused';menu();$('menu').style.display='flex'}
function over(){if(!playing)return;playing=false;down=false;try{document.exitPointerLock()}catch(e){}
 const nb=wave>(S.best||0);S.best=Math.max(S.best||0,wave);S.kills=(S.kills||0)+kills;S.runs=(S.runs||0)+1;save();
 $('hud').style.display='none';
 $('rs').innerHTML=`<h2>DEFEATED</h2><div class="stats"><div><b>${wave}</b>Wave${nb?'<i>NEW BEST</i>':''}</div><div><b>${kills}</b>Kills</div><div><b>+${S.coins-st.c}</b>Coins</div><div><b>+${(S.xp||0)-st.xp}</b>XP</div></div><div class="row" style="justify-content:center"><button class="big" onclick="closeRs();play()">PLAY AGAIN</button><button onclick="closeRs();showMenu()">Menu</button></div>`;
 $('results').style.display='flex'}
function hurt(d){if(!playing)return;hp-=d;fT=1;beep(90,.15,'sawtooth',.08);hud();if(hp<=0)over()}
const tg=new THREE.BoxGeometry(.025,.025,1);function tracer(a,b,col){const l=new THREE.Mesh(tg,new THREE.MeshBasicMaterial({color:col||0xffe9a0}));l.position.copy(a).lerp(b,.5);l.lookAt(b);l.scale.z=a.distanceTo(b);l.life=.07;sc.add(l);tr.push(l)}

function shoot(){
 if(now<next)return;const G=GUNS[S.gun];next=now+G.f;kick=.09;flashM.material.opacity=1;flashM.rotation.z=Math.random()*6;mLight.intensity=4;
 beep(S.gun=='sniper'?120:S.gun=='shotgun'?90:240,.08,'square',.05);
 const mz=cam.localToWorld(new THREE.Vector3(.33,-.29,-1));
 const targets=solid.concat(...bots.map(b=>b.parts));
 for(let i=0;i<G.p;i++){
  rc.far=100;rc.setFromCamera(new THREE.Vector2((Math.random()-.5)*G.s*4,(Math.random()-.5)*G.s*4),cam);
  const h=rc.intersectObjects(targets,false)[0];
  tracer(mz,h?h.point:rc.ray.at(60,new THREE.Vector3()));if(h){const bt=h.object.userData.bot;burst(h.point,bt?7:4,bt?1:0,bt?4:3);if(!bt&&h.face)decal(h.point,h.face.normal)}
  if(h&&h.object.userData.bot){
   const g=h.object.userData.bot,hs=h.object.userData.head;
   g.hp-=G.d*(hs?2:1);g.fl=.08;hmT=.15;beep(hs?900:600,.05,'sine',.05);
   if(g.hp<=0){burst(new THREE.Vector3(g.position.x,1.1,g.position.z),34,1,8);burst(new THREE.Vector3(g.position.x,1.5,g.position.z),10,2,6);g.bar.visible=false;g.dying=.001;g.eyes.color.setHex(0x331111);bots.splice(bots.indexOf(g),1);dead.push(g);kills++;S.coins+=hs?20:15;S.xp=(S.xp||0)+10;feed(hs?'HEADSHOT +20':'KILL +15');hud()}
  }}
}

function update(dt){
 if(keys.ArrowLeft)yaw+=2*dt;if(keys.ArrowRight)yaw-=2*dt;
 if(keys.ArrowUp)pitch=Math.min(1.4,pitch+1.5*dt);if(keys.ArrowDown)pitch=Math.max(-1.4,pitch-1.5*dt);
 const f=(keys.KeyW?1:0)-(keys.KeyS?1:0),r=(keys.KeyD?1:0)-(keys.KeyA?1:0),l=Math.hypot(f,r)||1,sp=(keys.ShiftLeft?10:7)*dt;
 P.x+=(-Math.sin(yaw)*f+Math.cos(yaw)*r)/l*sp;P.z+=(-Math.cos(yaw)*f-Math.sin(yaw)*r)/l*sp;collide(P,.4);
 if(f||r)bob+=dt*10;cam.fov+=((keys.ShiftLeft&&(f||r)?82:75)-cam.fov)*Math.min(1,dt*8);cam.updateProjectionMatrix();
 if(keys.Space&&jy===0&&jv===0){jv=7.6;beep(300,.08,'sine',.03)}
 if(jy>0||jv!==0){jv-=22*dt;jy+=jv*dt;if(jy<=0){jy=0;if(jv<-6){landT=Math.min(1,-jv/12);beep(110,.08,'sine',.05)}jv=0}}
 landT=Math.max(0,landT-dt*5);
 cam.position.set(P.x+(Math.random()-.5)*fT*.15,1.6+jy+(jy>0?0:Math.sin(bob)*.04)-landT*.12+(Math.random()-.5)*fT*.1,P.z);cam.rotation.set(pitch,yaw,0);
 kick=Math.max(0,kick-dt*.6);swapT=Math.max(0,swapT-dt*4);const mv=(f||r)?1:0,spr=keys.ShiftLeft&&mv;const kk=1-Math.exp(-dt*7);tR+=(r-tR)*kk;sA+=((spr?1:0)-sA)*kk;
 gun.position.set(.33+Math.cos(bob*.5)*.012*mv+sA*.0025,-.31+Math.abs(Math.sin(bob))*.012*mv-swapT*.35-sA*.004-jv*.006+landT*.05,-.5+kick);
 gun.rotation.x=kick*2+swapT*.9+sA*.02;gun.rotation.y=sA*.0125+Math.cos(bob*.5)*.015*mv;gun.rotation.z=Math.sin(bob*.5)*.02*mv-tR*.01;
 cam.rotation.z=-tR*.0045+(Math.random()-.5)*fT*.03;cam.position.y+=fH*.03*Math.sin(now*30);fH=Math.max(0,fH-dt*3);
 if(down&&GUNS[S.gun].a)shoot();
 /* spawning & waves */
 if(toSpawn>0){spT-=dt;if(spT<=0){spawnBot();toSpawn--;spT=.8}}
 else if(!bots.length&&!waiting){waiting=true;nwT=3;const b=20+wave*5;S.coins+=b;S.xp=(S.xp||0)+25;hp=Math.min(100,hp+30);save();say(`Wave ${wave} cleared! +${b} coins`);hud()}
 if(waiting){nwT-=dt;if(nwT<=0)startWave()}
 animDead(dt);animKits(dt);
 /* bots */
 for(const g of bots){
  const d=aiBot(g,dt);
  g.fl=Math.max(0,g.fl-dt);g.ph+=dt*7;g.fill.scale.x=Math.max(.001,g.hp/g.mx);g.fill.position.x=-.43*(1-g.fill.scale.x);g.mat.emissive.setHex(g.fl>0?0xaa3322:0);
  animBot(g,dt,d);
  aiShoot(g,dt,d);
 }
radar();$('xh').style.setProperty('--sp',(6+kick*40+((keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD)?6:0))+'px');flashM.material.opacity=Math.max(0,flashM.material.opacity-dt*14);mLight.intensity=Math.max(0,mLight.intensity-dt*40);
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];p.life-=dt;if(p.life<=0){sc.remove(p);pts.splice(i,1);continue}p.v.y-=14*dt;p.position.addScaledVector(p.v,dt);if(p.position.y<.04){p.position.y=.04;p.v.multiplyScalar(.3)}p.scale.setScalar(p.life/p.max)}
 for(let i=tr.length-1;i>=0;i--){const t=tr[i];t.life-=dt;if(t.life<=0){sc.remove(t);t.material.dispose();tr.splice(i,1)}}
 hmT=Math.max(0,hmT-dt);$('hm').style.opacity=hmT>0?1:0;
 fT=Math.max(0,fT-dt*2);$('flash').style.opacity=fT;if(fxp)fxp.uniforms.h.value=fT;
 mT=Math.max(0,mT-dt);
}

/* ---------- input ---------- */
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===cv;if(!locked&&playing&&!paused&&!fallback)pause()});
document.addEventListener('pointerlockerror',()=>{fallback=true});
addEventListener('mousemove',e=>{if(!playing||paused)return;if(locked||(fallback&&down)){yaw-=e.movementX*.0025*(S.sens||1);pitch=Math.max(-1.4,Math.min(1.4,pitch-e.movementY*.0025*(S.sens||1)))}});
addEventListener('mousedown',e=>{if(!playing||paused||e.button)return;down=true;shoot()});
addEventListener('mouseup',()=>down=false);
addEventListener('keydown',e=>{keys[e.code]=true;
 if(e.code=='Escape')pause();
 if(playing&&!paused&&/^Digit[1-5]$/.test(e.code)){const si=+e.code[5]-1,g=S.hot[si];if(g&&GUNS[g]){S.gun=g;curSlot=si;applyGun()}}});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;down=false;if(playing&&!paused)pause()});

/* ---------- main loop ---------- */
/* ---------- cloud (Firebase auth + Firestore) + mandatory login gate ---------- */
const DEF=()=>({coins:250,guns:['pistol'],skins:['default'],gun:'pistol',skin:'default',best:0,kills:0,xp:0,runs:0,sens:1,vol:1,bloom:true,nick:'',hot:['pistol']});
function clean(d){const o=DEF();['coins','best','kills','xp','runs'].forEach(k=>o[k]=Math.max(0,Math.floor(+d[k]||0)));
 if(Array.isArray(d.guns))o.guns=['pistol',...d.guns.filter(g=>GUNS[g]&&g!='pistol')];
 if(Array.isArray(d.skins))o.skins=[...new Set(['default',...d.skins.filter(k=>SKINS[k])])];
 if(o.guns.includes(d.gun))o.gun=d.gun;if(o.skins.includes(d.skin))o.skin=d.skin;
 if(d.sens>0)o.sens=+d.sens;if(d.vol>=0&&d.vol<=1)o.vol=+d.vol;o.bloom=d.bloom!==false;o.nick=cleanNick(d.username);
 if(Array.isArray(d.hotbar)){o.hot=d.hotbar.slice(0,5).map(g=>GUNS[g]?g:'')}else o.hot=o.guns.slice(0,5);
 o.hot=fixHot(o.hot,o.guns);return o}
function gate(st){$('gate').style.display=st=='off'?'none':'flex';$('g-load').style.display=st=='load'?'block':'none';$('g-btns').style.display=st=='login'?'flex':'none'}
function signIn(){$('g-err').textContent='';if(!window.cloud){$('g-err').textContent='Login is unavailable right now. Check your connection and reload the page.';return}
 cloud.login().catch(e=>{$('g-err').textContent='Sign-in failed: '+(e.code||e.message)})}
addEventListener('cm-auth',async e=>{const was=cu;cu=e.detail;gateDone=true;
 if(cu){
  try{const d=await cloud.load();if(d)S=clean(d);else{S=DEF();cloud.save(S,true)}sync='synced'}
  catch(err){console.error(err);$('g-err').textContent='Could not load your save ('+(err.code||err.message)+'). Check your connection and sign in again.';cloud.logout();return}
  gate('off');showMenu();refreshLim()}
 else{if(was){S=DEF();playing=false;paused=false;down=false;$('hud').style.display='none';closeRs();$('reveal').style.display='none';rolling=false}
  $('menu').style.display='none';gate('login')}
 applyGun();menu()});
addEventListener('cm-sync',e=>{sync=e.detail=='ok'?'saved':'save failed';if(!playing||paused)menu()});
gate('load');setTimeout(()=>{if(!gateDone){gate('login');$('g-err').textContent=window.cloud?'Still connecting… try signing in.':'Login is unavailable right now. Check your connection and reload the page.'}},4500);

let last=performance.now();
function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;now=t/1000;for(const r of rings)r.rotation.z+=dt*(r.k?-1.2:1.2);dust.rotation.y+=dt*.02;
 if(playing&&!paused)update(dt);
 else if(!playing||paused){if(!playing){cam.position.set(0,7,0);cam.rotation.set(-.35,cam.rotation.y+dt*.15,0)}}
 if(comp&&S.bloom!==false){fxp.uniforms.t.value=now%100;comp.render()}else ren.render(sc,cam)}
applyGun();menu();requestAnimationFrame(loop);
