import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUPIUU-cdaauEgQ6WWlIkArtZ1IePUYNA",
  authDomain: "mess-mgmt-152cb.firebaseapp.com",
  projectId: "mess-mgmt-152cb",
  storageBucket: "mess-mgmt-152cb.firebasestorage.app",
  messagingSenderId: "319191441610",
  appId: "1:319191441610:web:3b4c41655c144498c4d433",
  measurementId: "G-YM9S7QSQ34"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
