import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase configuration
const firebaseConfig = {
   apiKey: process.env.apiKey,
   authDomain: process.env.authDomain,
   projectId: process.env.projectId,
   storageBucket: process.env.storageBucket,
   messagingSenderId: process.env.messagingSenderId,
   appId: process.env.appId,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
const database = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { database, storage, auth };
