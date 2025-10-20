// src/services_storage.js

// stockage simple + option Firebase
import { initializeFirebaseIfConfigured, addInvoiceFirestore, listInvoicesFirestore, deleteInvoiceFirestore } from './firebase'

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true'

export function saveInvoice(invoice) {
  // ensure ISO date
  const inv = { ...invoice }
  if (!inv.date) inv.date = new Date().toISOString()
  // numeric total
  inv.total = Number(inv.total) || (Number(inv.nombreContribuables || 0) * Number(inv.prixUnitaire || 0))
  if (USE_FIREBASE) {
    initializeFirebaseIfConfigured()
    return addInvoiceFirestore(inv)
  }
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]')
  invoices.push(inv)
  localStorage.setItem('invoices', JSON.stringify(invoices))
  return Promise.resolve(inv)
}

export function listInvoices() {
  if (USE_FIREBASE) {
    // synchronous fallback: return [] (use async Firestore in components if required)
    console.warn('VITE_USE_FIREBASE=true -> use firestore client in Dashboard if needed')
    return []
  }
  return JSON.parse(localStorage.getItem('invoices') || '[]')
}

export function deleteInvoice(idx) {
  if (USE_FIREBASE) {
    // not implemented for sync local call
    return deleteInvoiceFirestore(idx)
  }
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]')
  invoices.splice(idx, 1)
  localStorage.setItem('invoices', JSON.stringify(invoices))
  return Promise.resolve()
}
