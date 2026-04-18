import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmTSQ1XgWjw83092kFOsfNQAsOaKZEemE",
  authDomain: "resource-ai-750d4.firebaseapp.com",
  projectId: "resource-ai-750d4",
  storageBucket: "resource-ai-750d4.firebasestorage.app",
  messagingSenderId: "608127749534",
  appId: "1:608127749534:web:54aab74a56ecef3ebdda8f",
  measurementId: "G-LKXK70H7VL"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);