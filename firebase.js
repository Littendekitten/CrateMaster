// CrateMaster cloud layer: Google login + Firestore saves (Firebase modular SDK from CDN)
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getDatabase,ref as rref,onValue} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getFirestore,doc,getDoc,setDoc,serverTimestamp,collection,getDocs} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const API_BASE='https://cratemaster.onrender.com';
const firebaseConfig={
  apiKey:"AIzaSyACzBobwY_e-qXhwisbLjAz0H623UcW_Ds",
  authDomain:"kitacat-cratemaster.firebaseapp.com",
  projectId:"kitacat-cratemaster",
  storageBucket:"kitacat-cratemaster.firebasestorage.app",
  messagingSenderId:"670396867739",
  appId:"1:670396867739:web:d0d37f78a671f9692f123e",
  // Realtime Database URL (Firebase console > Realtime Database). Change it if yours is in another region, e.g. https://kitacat-cratemaster-default-rtdb.europe-west1.firebasedatabase.app
  databaseURL:"https://kitacat-cratemaster-default-rtdb.firebaseio.com",
};
const app=initializeApp(firebaseConfig);

const auth=getAuth(app),db=getFirestore(app),rtdb=getDatabase(app);
let user=null,timer=null;
const fire=(n,d)=>dispatchEvent(new CustomEvent(n,{detail:d}));
const ref=()=>doc(db,"users",user.uid);

window.cloud={
  get user(){return user},
  login:()=>signInWithPopup(auth,new GoogleAuthProvider()),
  logout:()=>signOut(auth),
  // Firestore collection "Limited Crates": one doc per crate (doc id = crate key, e.g. "spooky"), field enabled:true/false
  async limited(){const s=await getDocs(collection(db,"Limited Crates"));const o={};s.forEach(d=>o[d.id]=d.data());return o},
  token:()=>user.getIdToken(),
  // live list of online players from the Realtime Database (written by the Render server)
  presence(cb){return onValue(rref(rtdb,"presence"),s=>cb(s.val()||{}),()=>cb({}))},
  async load(){const s=await getDoc(ref());return s.exists()?s.data():null},
  async action(path,body={}){
    if(!user)throw new Error('Sign in first');
    const token=await user.getIdToken();
    const response=await fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({...body,requestId:crypto.randomUUID()})});
    const data=await response.json().catch(()=>({error:'Invalid server response'}));
    if(!response.ok)throw new Error(data.error||'Server action failed');
    return data;
  },
  async bootstrap(){return this.action('/api/bootstrap',{})},
  // The browser can only save harmless profile/equipment settings.
  // Currency, inventories, progression, Index rewards and crate drops are server-owned.
  save(S,now){
    if(!user)return;clearTimeout(timer);
    const run=()=>setDoc(ref(),{gun:S.gun,hotbar:S.hot||[],skin:S.skin,sens:S.sens||1,vol:S.vol==null?1:S.vol,bloom:S.bloom!==false,username:S.nick||"",displayName:user.displayName||"",updated:serverTimestamp()},{merge:true})
      .then(()=>fire("cm-sync","ok")).catch(e=>{console.error(e);fire("cm-sync","err")});
    if(now)run();else timer=setTimeout(run,800);
  }
};
onAuthStateChanged(auth,u=>{user=u;fire("cm-auth",u?{uid:u.uid,name:u.displayName}:null)});
