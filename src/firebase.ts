// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration (replace with your own details)
const firebaseConfig = {
    apiKey: "AIzaSyCRA72M3NWrCST9v6GSd5ZB3Qkykbnz-LQ",
    authDomain: "application-tracker-c6289.firebaseapp.com",
    projectId: "application-tracker-c6289",
    storageBucket: "application-tracker-c6289.firebasestorage.app",
    messagingSenderId: "156151775371",
    appId: "1:156151775371:web:011d86c1329c95a9f7148e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
