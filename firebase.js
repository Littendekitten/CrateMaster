// CrateMaster cloud layer: Google login + Firestore saves (Firebase modular SDK from CDN)
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig={
  apiKey:"AIzaSyACzBobwY_e-qXhwisbLjAz0H623UcW_Ds",
  authDomain:"kitacat-cratemaster.firebaseapp.com",
  projectId:"kitacat-cratemaster",
  storageBucket:"kitacat-cratemaster.firebasestorage.app",
  messagingSenderId:"670396867739",
  appId:"1:670396867739:web:d0d37f78a671f9692f123e",
  measurementId:"G-8629WE5GX5"
};
const app=initializeApp(firebaseConfig);
import("https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js").then(m=>m.isSupported().then(ok=>ok&&m.getAnalytics(app))).catch(()=>{});

const auth=getAuth(app),db=getFirestore(app);
let user=null,timer=null;
const fire=(n,d)=>dispatchEvent(new CustomEvent(n,{detail:d}));
const ref=()=>doc(db,"users",user.uid);

window.cloud={
  get user(){return user},
  login:()=>signInWithPopup(auth,new GoogleAuthProvider()),
  logout:()=>signOut(auth),
  async load(){const s=await getDoc(ref());return s.exists()?s.data():null},
  // debounced save; pass now=true to write immediately
  save(S,now){
    if(!user)return;clearTimeout(timer);
    const run=()=>setDoc(ref(),{coins:S.coins,guns:S.guns,skins:S.skins,gun:S.gun,hotbar:S.hot||[],skin:S.skin,best:S.best||0,kills:S.kills||0,xp:S.xp||0,runs:S.runs||0,sens:S.sens||1,vol:S.vol==null?1:S.vol,bloom:S.bloom!==false,username:S.nick||"",updated:serverTimestamp()},{merge:true})
      .then(()=>fire("cm-sync","ok")).catch(e=>{console.error(e);fire("cm-sync","err")});
    if(now)run();else timer=setTimeout(run,800);
  }
};
onAuthStateChanged(auth,u=>{user=u;fire("cm-auth",u?{uid:u.uid,name:u.displayName}:null)});
