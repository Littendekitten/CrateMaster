const $=id=>document.getElementById(id);
const R={common:'#9aa4c4',rare:'#3b9cff',epic:'#b45cff',legendary:'#ffb81f'};
const RK=['common','rare','epic','legendary'];
const GUNS={pistol:{n:'Pistol',r:'common',d:25,f:.3,p:1,s:.004,a:0,l:.6},smg:{n:'Viper SMG',r:'common',d:11,f:.08,p:1,s:.03,a:1,l:.9},shotgun:{n:'Boomstick',r:'rare',d:13,f:.8,p:8,s:.09,a:0,l:1.1},rifle:{n:'Striker AR',r:'epic',d:24,f:.13,p:1,s:.012,a:1,l:1.2},sniper:{n:'Longshot',r:'legendary',d:110,f:1.1,p:1,s:0,a:0,l:1.5}};
const SKINS={default:{n:'Factory Gray',r:'common',c:0x777b88},neon:{n:'Neon Green',r:'common',c:0x39ff14},crimson:{n:'Crimson',r:'rare',c:0xdc143c},ice:{n:'Glacier',r:'epic',c:0x66ccff},gold:{n:'Midas Gold',r:'legendary',c:0xffd23f},void:{n:'Void Purple',r:'legendary',c:0x8a2be2}};
const CR={basic:{n:'Basic Crate',cost:100,w:[60,28,10,2]},elite:{n:'Elite Crate',cost:300,w:[0,50,35,15]}};
let S={coins:250,guns:['pistol'],skins:['default'],gun:'pistol',skin:'default'};
try{const j=localStorage.getItem('cratemaster');if(j)S=Object.assign(S,JSON.parse(j))}catch(e){}
const save=()=>{try{localStorage.setItem('cratemaster',JSON.stringify(S))}catch(e){}};
let AC;function beep(f,d,t,v){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=t||'square';o.frequency.value=f;g.gain.value=v||.04;g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}

/* ---------- menu / shop ---------- */
function menu(){
 $('coins').textContent=S.coins;
 $('crates').innerHTML=Object.keys(CR).map(k=>{const c=CR[k];return `<div class="crate"><b>${c.n}</b><small>${RK.map((r,i)=>c.w[i]?`<span style="color:${R[r]}">${r} ${c.w[i]}%</span>`:'').join(' · ')}</small><button onclick="openCrate('${k}')">Open · 🪙 ${c.cost}</button></div>`}).join('');
 const card=(t,o,id,list,cur)=>`<button class="it ${list.includes(id)?'own':''} ${cur==id?'on':''}" style="--c:${R[o.r]}" ${list.includes(id)?`onclick="eq('${t}','${id}')"`:'disabled'}>${o.n}<small>${list.includes(id)?o.r:'locked'}</small></button>`;
 $('inv').innerHTML='<h3>Guns</h3><div class="g">'+Object.keys(GUNS).map(id=>card('guns',GUNS[id],id,S.guns,S.gun)).join('')+'</div><h3>Skins</h3><div class="g">'+Object.keys(SKINS).map(id=>card('skins',SKINS[id],id,S.skins,S.skin)).join('')+'</div>';
 $('play').textContent=playing&&paused?'Resume':(playing?'Play':'Play');
}
function openCrate(k){
 const c=CR[k];
 if(S.coins<c.cost){$('res').innerHTML='<div class="reveal" style="border-color:#e23;color:#e23">Not enough coins — go win some!</div>';return}
 S.coins-=c.cost;
 let x=Math.random()*100,i=0;for(;i<3;i++){if((x-=c.w[i])<0)break}
 const rar=RK[i],pool=[];
 for(const g in GUNS)if(g!='pistol'&&GUNS[g].r==rar)pool.push(['guns',g]);
 for(const s in SKINS)if(s!='default'&&SKINS[s].r==rar)pool.push(['skins',s]);
 const [t,id]=pool[Math.random()*pool.length|0],it=(t=='guns'?GUNS:SKINS)[id];
 let txt;
 if(S[t].includes(id)){const b=Math.round(c.cost*.4);S.coins+=b;txt=`Duplicate ${it.n} · +${b} coins back`}
 else{S[t].push(id);txt=`NEW ${t=='guns'?'GUN':'SKIN'}: ${it.n}`}
 $('res').innerHTML=`<div class="reveal" style="border-color:${R[rar]};color:${R[rar]}">${rar.toUpperCase()} — ${txt}</div>`;
 beep(rar=='legendary'?880:440,.4,'triangle',.08);
 save();menu();applyGun();
}
function eq(t,id){if(t=='guns')S.gun=id;else S.skin=id;save();menu();applyGun()}

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
function collide(p,r){p.x=Math.max(-29,Math.min(29,p.x));p.z=Math.max(-29,Math.min(29,p.z));
 for(const o of obs){const dx=p.x-o.x,dz=p.z-o.z,ox=o.w+r-Math.abs(dx),oz=o.d+r-Math.abs(dz);if(ox>0&&oz>0){if(ox<oz)p.x+=ox*(dx<0?-1:1);else p.z+=oz*(dz<0?-1:1)}}}

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
flashM.position.set(.25,-.2,-1.15);cam.add(flashM);
const mLight=new THREE.PointLight(0xffb050,0,9);mLight.position.set(.25,-.15,-1.1);cam.add(mLight);
function applyGun(){const G=GUNS[S.gun];gm.color.setHex(SKINS[S.skin].c);gun.scale.z=G.l;$('wpn').innerHTML=`${G.n}<br><small style="color:${R[G.r]}">${SKINS[S.skin].n}</small>`}
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
const P=new THREE.Vector3(0,0,0),rc=new THREE.Raycaster(),bots=[],tr=[];
let playing=false,paused=false,locked=false,fallback=false,down=false;
let yaw=0,pitch=0,hp=100,wave=0,kills=0,toSpawn=0,spT=0,nwT=0,waiting=false,next=0,now=0,kick=0,bob=0,botId=0,hmT=0,fT=0,mT=0;
const keys={};
function say(t){$('msg').textContent=t;mT=1.8}
function hud(){$('info').textContent=`Wave ${wave} · Kills ${kills} · 🪙 ${S.coins}`;$('hp').style.width=Math.max(0,hp)+'%'}

function spawnBot(){
 const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xc2302a,metalness:.6,roughness:.4}),
 d=new THREE.MeshStandardMaterial({color:0x1b1d26,metalness:.7,roughness:.4}),e=new THREE.MeshBasicMaterial({color:0xff2a2a});
 const pt=(w,h,z,mat,px,py,pz,head)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,z),mat);o.position.set(px,py,pz);o.castShadow=true;o.userData={bot:g,head:head};g.add(o);return o};
 pt(.85,1,.5,m,0,1,0);pt(.4,.14,.05,e,0,1.2,.26);pt(.9,.2,.55,d,0,.55,0);
 pt(.5,.44,.46,d,0,1.75,0,1);pt(.38,.1,.05,e,0,1.77,.24,1);pt(.04,.3,.04,d,.15,2.1,0,1);pt(.08,.08,.08,e,.15,2.28,0,1);
 pt(.3,.2,.42,m,-.58,1.5,0);pt(.3,.2,.42,m,.58,1.5,0);pt(.2,.8,.22,d,-.58,1,0);pt(.2,.8,.22,d,.58,1,0);
 g.legs=[pt(.3,.55,.35,d,-.22,.28,0),pt(.3,.55,.35,d,.22,.28,0)];
 g.mat=m;g.hp=g.mx=50+wave*10;g.bar=new THREE.Group();g.fill=new THREE.Mesh(new THREE.PlaneGeometry(.86,.06),new THREE.MeshBasicMaterial({color:0x3dff7a}));g.fill.position.z=.01;g.bar.add(new THREE.Mesh(new THREE.PlaneGeometry(.9,.1),new THREE.MeshBasicMaterial({color:0x111111})),g.fill);g.bar.position.y=2.55;g.add(g.bar);g.cd=1.5+Math.random()*2;g.fl=0;g.ph=Math.random()*6;g.id=botId++;
 const an=Math.random()*6.283;g.position.set(Math.cos(an)*24,0,Math.sin(an)*24);collide(g.position,.6);
 sc.add(g);bots.push(g)}
function startWave(){wave++;toSpawn=3+wave*2;waiting=false;say('Wave '+wave);hud()}
function play(){
 bots.forEach(b=>sc.remove(b));bots.length=0;
 P.set(0,0,0);yaw=pitch=0;hp=100;wave=0;kills=0;nwT=0;playing=true;paused=false;
 $('menu').style.display='none';$('hud').style.display='block';applyGun();startWave();lock()}
function lock(){try{const p=cv.requestPointerLock();if(p&&p.catch)p.catch(()=>fallback=true)}catch(e){fallback=true}}
function go(){if(playing&&paused){paused=false;$('menu').style.display='none';lock()}else play()}
function pause(){if(!playing||paused)return;paused=true;down=false;$('sub').textContent='Paused';menu();$('menu').style.display='flex'}
function over(){playing=false;down=false;try{document.exitPointerLock()}catch(e){}
 save();$('hud').style.display='none';$('sub').textContent=`Defeated on wave ${wave} with ${kills} kills.`;menu();$('menu').style.display='flex'}
function hurt(d){hp-=d;fT=1;beep(90,.15,'sawtooth',.08);hud();if(hp<=0)over()}
const tg=new THREE.BoxGeometry(.025,.025,1);function tracer(a,b,col){const l=new THREE.Mesh(tg,new THREE.MeshBasicMaterial({color:col||0xffe9a0}));l.position.copy(a).lerp(b,.5);l.lookAt(b);l.scale.z=a.distanceTo(b);l.life=.07;sc.add(l);tr.push(l)}

function shoot(){
 if(now<next)return;const G=GUNS[S.gun];next=now+G.f;kick=.09;flashM.material.opacity=1;flashM.rotation.z=Math.random()*6;mLight.intensity=4;
 beep(S.gun=='sniper'?120:S.gun=='shotgun'?90:240,.08,'square',.05);
 const mz=cam.localToWorld(new THREE.Vector3(.25,-.2,-1));
 const targets=solid.concat(...bots.map(b=>b.children));
 for(let i=0;i<G.p;i++){
  rc.far=100;rc.setFromCamera(new THREE.Vector2((Math.random()-.5)*G.s*4,(Math.random()-.5)*G.s*4),cam);
  const h=rc.intersectObjects(targets,false)[0];
  tracer(mz,h?h.point:rc.ray.at(60,new THREE.Vector3()));if(h){const bt=h.object.userData.bot;burst(h.point,bt?7:4,bt?1:0,bt?4:3);if(!bt&&h.face)decal(h.point,h.face.normal)}
  if(h&&h.object.userData.bot){
   const g=h.object.userData.bot,hs=h.object.userData.head;
   g.hp-=G.d*(hs?2:1);g.fl=.08;hmT=.15;beep(hs?900:600,.05,'sine',.05);
   if(g.hp<=0){burst(new THREE.Vector3(g.position.x,1.1,g.position.z),34,1,8);burst(new THREE.Vector3(g.position.x,1.5,g.position.z),10,2,6);sc.remove(g);bots.splice(bots.indexOf(g),1);kills++;S.coins+=hs?20:15;hud()}
  }}
}

function update(dt){
 if(keys.ArrowLeft)yaw+=2*dt;if(keys.ArrowRight)yaw-=2*dt;
 if(keys.ArrowUp)pitch=Math.min(1.4,pitch+1.5*dt);if(keys.ArrowDown)pitch=Math.max(-1.4,pitch-1.5*dt);
 const f=(keys.KeyW?1:0)-(keys.KeyS?1:0),r=(keys.KeyD?1:0)-(keys.KeyA?1:0),l=Math.hypot(f,r)||1,sp=(keys.ShiftLeft?10:7)*dt;
 P.x+=(-Math.sin(yaw)*f+Math.cos(yaw)*r)/l*sp;P.z+=(-Math.cos(yaw)*f-Math.sin(yaw)*r)/l*sp;collide(P,.4);
 if(f||r)bob+=dt*10;cam.fov+=((keys.ShiftLeft&&(f||r)?82:75)-cam.fov)*Math.min(1,dt*8);cam.updateProjectionMatrix();
 cam.position.set(P.x+(Math.random()-.5)*fT*.15,1.6+Math.sin(bob)*.04+(Math.random()-.5)*fT*.1,P.z);cam.rotation.set(pitch,yaw,0);
 kick=Math.max(0,kick-dt*.6);gun.position.set(.25,-.22,-.5+kick);gun.rotation.x=kick*2;
 if(down&&GUNS[S.gun].a)shoot();
 /* spawning & waves */
 if(toSpawn>0){spT-=dt;if(spT<=0){spawnBot();toSpawn--;spT=.8}}
 else if(!bots.length&&!waiting){waiting=true;nwT=3;const b=20+wave*5;S.coins+=b;hp=Math.min(100,hp+30);save();say(`Wave ${wave} cleared! +${b} coins`);hud()}
 if(waiting){nwT-=dt;if(nwT<=0)startWave()}
 /* bots */
 for(const g of bots){
  const dx=P.x-g.position.x,dz=P.z-g.position.z,d=Math.hypot(dx,dz)||1;g.rotation.y=Math.atan2(dx,dz);
  const s=(2.5+wave*.25)*dt;let mx,mz;
  if(d>9){mx=dx/d;mz=dz/d}else if(d<5){mx=-dx/d;mz=-dz/d}else{const k=Math.sin(now*1.2+g.id*2)>0?1:-1;mx=-dz/d*k;mz=dx/d*k}
  g.position.x+=mx*s;g.position.z+=mz*s;collide(g.position,.6);
  g.fl=Math.max(0,g.fl-dt);g.ph+=dt*7;g.fill.scale.x=Math.max(.001,g.hp/g.mx);g.fill.position.x=-.43*(1-g.fill.scale.x);g.legs[0].position.z=Math.sin(g.ph)*.18;g.legs[1].position.z=-Math.sin(g.ph)*.18;g.mat.emissive.setHex(g.fl>0?0xaa3322:0);
  g.cd-=dt;
  if(g.cd<=0&&d<30){g.cd=1.1+Math.random()*1.4;
   const from=new THREE.Vector3(g.position.x,1.5,g.position.z),dir=new THREE.Vector3(P.x-from.x,.1,P.z-from.z).normalize();
   rc.set(from,dir);rc.far=d;
   if(!rc.intersectObjects(solid,false).length&&Math.random()<.45){tracer(from,new THREE.Vector3(P.x,1.5,P.z),0xff4040);hurt(6+wave)}}
 }
 flashM.material.opacity=Math.max(0,flashM.material.opacity-dt*14);mLight.intensity=Math.max(0,mLight.intensity-dt*40);
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];p.life-=dt;if(p.life<=0){sc.remove(p);pts.splice(i,1);continue}p.v.y-=14*dt;p.position.addScaledVector(p.v,dt);if(p.position.y<.04){p.position.y=.04;p.v.multiplyScalar(.3)}p.scale.setScalar(p.life/p.max)}
 for(let i=tr.length-1;i>=0;i--){const t=tr[i];t.life-=dt;if(t.life<=0){sc.remove(t);t.material.dispose();tr.splice(i,1)}}
 hmT=Math.max(0,hmT-dt);$('hm').style.opacity=hmT>0?1:0;
 fT=Math.max(0,fT-dt*2);$('flash').style.opacity=fT;if(fxp)fxp.uniforms.h.value=fT;
 mT=Math.max(0,mT-dt);$('msg').style.opacity=mT>0?1:0;
}

/* ---------- input ---------- */
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===cv;if(!locked&&playing&&!paused&&!fallback)pause()});
document.addEventListener('pointerlockerror',()=>{fallback=true});
addEventListener('mousemove',e=>{if(!playing||paused)return;if(locked||(fallback&&down)){yaw-=e.movementX*.0025;pitch=Math.max(-1.4,Math.min(1.4,pitch-e.movementY*.0025))}});
addEventListener('mousedown',e=>{if(!playing||paused||e.button)return;down=true;shoot()});
addEventListener('mouseup',()=>down=false);
addEventListener('keydown',e=>{keys[e.code]=true;
 if(e.code=='Escape')pause();
 if(playing&&!paused&&/^Digit[1-5]$/.test(e.code)){const g=S.guns[+e.code[5]-1];if(g){S.gun=g;applyGun()}}});
addEventListener('keyup',e=>keys[e.code]=false);

/* ---------- main loop ---------- */
let last=performance.now();
function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;now=t/1000;for(const r of rings)r.rotation.z+=dt*(r.k?-1.2:1.2);dust.rotation.y+=dt*.02;
 if(playing&&!paused)update(dt);
 else if(!playing||paused){if(!playing){cam.position.set(0,7,0);cam.rotation.set(-.35,cam.rotation.y+dt*.15,0)}}
 if(comp){fxp.uniforms.t.value=now%100;comp.render()}else ren.render(sc,cam)}
applyGun();menu();requestAnimationFrame(loop);
