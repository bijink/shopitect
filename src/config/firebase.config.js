import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase configuration
const firebaseConfig = {
   apiKey: process.env.FIREBASE_API_KEY,
   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
   projectId: "master-project-dev-c24a5",
   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.FIREBASE_APP_ID,
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
const database = getFirestore(app);
const storage = getStorage(app);
// const auth = getAuth(app);
// auth.useDeviceLanguage();

// export { database, storage, auth };
export { database, storage };
