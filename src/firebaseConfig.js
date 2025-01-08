// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore"; // Thêm Firestore imports
import { getDatabase, ref, set, get, push, update, remove } from "firebase/database"; // Realtime Database imports
import { getStorage } from "firebase/storage"; // Storage imports
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJmR1FaC1SveeKenFaFc7lhwHIkwhn3ok",
  authDomain: "nhanpet-cfc19.firebaseapp.com",
  databaseURL: "https://nhanpet-cfc19-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nhanpet-cfc19",
  storageBucket: "nhanpet-cfc19.firebasestorage.app",
  messagingSenderId: "297154840025",
  appId: "1:297154840025:web:7a621d4ca76e62d8c585c8",
  measurementId: "G-Y82MV84M09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const database = getDatabase(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app); // Only if you need it
const storage = getStorage(app);
const auth = getAuth(app);


// Export Firebase services
export { 
  app, 
  database, 
  firestore, 
  storage, 
  auth, 
  analytics, 
  ref, 
  set, 
  get, 
  push, 
  update, 
  remove, 
  collection, 
  getDocs, 
  doc, 
  updateDoc 
};
