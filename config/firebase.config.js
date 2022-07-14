import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// const firebaseConfig = {
//    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };
const firebaseConfig = {
   apiKey: "AIzaSyDUUGLfyrUZnnC7TLRJ6OgvIOd7vZ6_520",
   authDomain: "master-project-prod-a3a5f.firebaseapp.com",
   projectId: "master-project-prod-a3a5f",
   storageBucket: "master-project-prod-a3a5f.appspot.com",
   messagingSenderId: "1018300049606",
   appId: "1:1018300049606:web:22960f7e171bcc9d094fc7",
   measurementId: "G-1RZCSG1BQE"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
const database = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { database, storage, auth };
