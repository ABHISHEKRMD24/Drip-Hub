import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace these placeholders with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW2azNveS2B6SEPw3W6dT00npMuIsClXo",
  authDomain: "driphub-16a28.firebaseapp.com",
  projectId: "driphub-16a28",
  storageBucket: "driphub-16a28.firebasestorage.app",
  messagingSenderId: "296643374360",
  appId: "1:296643374360:web:593e0990af3c6755e6426d",
  measurementId: "G-VDWJNV1QLV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
