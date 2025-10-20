// src/firebase.js

// Importation des fonctions Firebase nécessaires
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ✅ Configuration Firebase (la tienne)
const firebaseConfig = {
  apiKey: "AIzaSyD_6ZWjWc3FEGGzmWAZVOFHgKKN-bm2--k",
  authDomain: "appfacturation-11434.firebaseapp.com",
  projectId: "appfacturation-11434",
  storageBucket: "appfacturation-11434.firebasestorage.app",
  messagingSenderId: "1045358350835",
  appId: "1:1045358350835:web:d63116ba60a049bdee4286",
  measurementId: "G-GBKELBM5K6"
};

// ✅ Initialisation Firebase
let app
let db

export function initializeFirebaseIfConfigured() {
  if (!app) {
    app = initializeApp(firebaseConfig)
    getAnalytics(app)
    db = getFirestore(app)
  }
  return db
}

// ✅ Ajouter une facture à Firestore
export async function addInvoiceFirestore(invoice) {
  const db = initializeFirebaseIfConfigured()
  const docRef = await addDoc(collection(db, "invoices"), invoice)
  return { id: docRef.id, ...invoice }
}

// ✅ Lister toutes les factures depuis Firestore
export async function listInvoicesFirestore() {
  const db = initializeFirebaseIfConfigured()
  const snapshot = await getDocs(collection(db, "invoices"))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ✅ Supprimer une facture depuis Firestore
export async function deleteInvoiceFirestore(id) {
  const db = initializeFirebaseIfConfigured()
  await deleteDoc(doc(db, "invoices", id))
}
