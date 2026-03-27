import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnZE0Lk_BukBW0skSPZ-EctnEeb0vMuIo",
    authDomain: "help-children-app.firebaseapp.com",
    projectId: "help-children-app",
    storageBucket: "help-children-app.firebasestorage.app",
    messagingSenderId: "307055346269",
    appId: "1:307055346269:web:c87e12cb719489d35283b4",
    measurementId: "G-G8GCPP0WN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
