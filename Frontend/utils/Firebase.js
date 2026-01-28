import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "login-b7ce2.firebaseapp.com",
  projectId: "login-b7ce2",
  storageBucket: "login-b7ce2.appspot.com",
  messagingSenderId: "526125548182",
  appId: "1:526125548182:web:0ac0e0666655468d31b8b7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
