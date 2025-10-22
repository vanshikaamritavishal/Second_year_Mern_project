import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";   // <-- Add Firestore
import { getStorage } from "firebase/storage";       // <-- Add Storage

const firebaseConfig = {
  apiKey: "AIzaSyAwJr1yWuVL7u14AdZX4AgWOoyY_lxETr8",
  authDomain: "skillsync-25.firebaseapp.com",
  projectId: "skillsync-25",
  storageBucket: "skillsync-25.appspot.com",
  messagingSenderId: "842860736769",
  appId: "1:842860736769:web:c3f10b77de1bab1b2a2b00",
  measurementId: "G-YC7TZ8ZXLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
// Firestore
export const db = getFirestore(app);     // <-- Export Firestore
// Storage
export const storage = getStorage(app);  // <-- Export Storage
export default app;
