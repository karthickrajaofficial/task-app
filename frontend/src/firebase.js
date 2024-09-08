
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBNbeZ1Ws_y1sn80sfeKzdzJHmIKiw_UR0",
  authDomain: "task-manager-c979c.firebaseapp.com",
  projectId: "task-manager-c979c",
  storageBucket: "task-manager-c979c.appspot.com",
  messagingSenderId: "309101082029",
  appId: "1:309101082029:web:0cd0ae0b33efb5d98cdd24",
  measurementId: "G-LSSJ1THMKP"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
