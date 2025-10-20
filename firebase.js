// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_6ZWjWc3FEGGzmWAZVOFHgKKN-bm2--k",
  authDomain: "appfacturation-11434.firebaseapp.com",
  projectId: "appfacturation-11434",
  storageBucket: "appfacturation-11434.firebasestorage.app",
  messagingSenderId: "1045358350835",
  appId: "1:1045358350835:web:d63116ba60a049bdee4286",
  measurementId: "G-GBKELBM5K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);