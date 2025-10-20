import React, { useState } from 'react'
import { saveInvoice } from "./services_storage";
// import html2pdf from 'html2pdf.js'
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

export default function InvoiceForm(){
  const [itinerary, setItinerary] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')
  const [passengerCount, setPassengerCount] = useState(1)
  const [unitPrice, setUnitPrice] = useState(1000)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [remarks, setRemarks] = useState('')

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const taxRate = 0.16
  const total = Number(passengerCount) * Number(unitPrice)
  const taxAmount = total * taxRate
  const finalAmount = total + taxAmount

  function handleSubmit(e){
    e.preventDefault()
    const invoice = {
      id: Date.now().toString(),
      itinerary,
      vehicleBrand: brand,
      vehicleColor: color,
      passengerCount: Number(passengerCount),
      unitPrice: Number(unitPrice),
      date: new Date().toISOString(),
      paymentMethod,
      remarks,
      totalAmount: total,
      taxAmount,
      finalAmount,
      agentId: 'agent-1',
      printed: false
    }
    saveInvoice(invoice)
    alert('Facture sauvegardée localement.')
  }

  // function handlePrint() {
  // const printArea = document.getElementById('invoice-print-area');
  // printArea.style.display = 'block'; // Affiche la facture

  // window.print(); // Ouvre la boîte de dialogue d'impression
  // setShowInvoice(true);
  // setTimeout(() => {
  //   printArea.style.display = 'none'; // Cache la facture après impression
  // }, 1000);
// }

  return (
    <div className="card p-3">
      <h5>Terminal - Saisie facture</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Itinéraire</label>
          <input className="form-control" value={itinerary} onChange={e=>setItinerary(e.target.value)} required/>
        </div>
        <div className="row">
          <div className="col">
            <label>Marque</label>
            <input className="form-control" value={brand} onChange={e=>setBrand(e.target.value)} />
          </div>
          <div className="col">
            <label>Couleur</label>
            <input className="form-control" value={color} onChange={e=>setColor(e.target.value)} />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <label>Nombre de passages</label>
            <input type="number" min="1" className="form-control" value={passengerCount} onChange={e=>setPassengerCount(e.target.value)} />
          </div>
          <div className="col">
            <label>Prix unitaire (CDF)</label>
            <input type="number" min="0" className="form-control" value={unitPrice} onChange={e=>setUnitPrice(e.target.value)} />
          </div>
        </div>

        <div className="mt-3">
          <label>Mode de paiement</label>
          <select className="form-select" value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="mobile">Mobile Money</option>
            <option value="card">Carte</option>
          </select>
        </div>

        <div className="mt-2">
          <label>Remarques</label>
          <textarea className="form-control" rows="2" value={remarks} onChange={e=>setRemarks(e.target.value)} />
        </div>

        <div className="mt-3">
          <strong>Sous-total:</strong> {total.toLocaleString()} CDF<br/>
          <strong>Taxe (16%):</strong> {taxAmount.toLocaleString()} CDF<br/>
          <strong>Total final:</strong> {finalAmount.toLocaleString()} CDF
        </div>

        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Valider</button>
          <button type="button" className="btn btn-secondary" onClick={reactToPrintFn}>Imprimer</button>
        </div>
      </form>

      <div ref={contentRef} id="invoice-print-area" style={{display:'none'}}>
        <div style={{padding:'20px', fontFamily:'Arial'}}>
          <h3>Facture - Demo</h3>
          <p>Date: {new Date().toLocaleString()}</p>
          <p>Itinéraire: {itinerary}</p>
          <p>Véhicule: {brand} / {color}</p>
          <p>Passages: {passengerCount} × {unitPrice} = {total}</p>
          <p>Taxe: {taxAmount}</p>
          <p><strong>Total à payer: {finalAmount}</strong></p>
          <p>Mode: {paymentMethod}</p>
          <p>Remarques: {remarks}</p>
        </div>
      </div>
    </div>
  )
}
