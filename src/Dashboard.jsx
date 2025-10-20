import React, { useEffect, useState, useRef } from 'react'
import { listInvoices } from './services_storage'

function parseDateString(s) {
  if (!s) return null
  const d1 = new Date(s)
  if (!isNaN(d1)) return d1
  const m = String(s).match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2}):(\d{2}))?/)
  if (m) {
    const day = Number(m[1]), month = Number(m[2]) - 1, year = Number(m[3])
    const hh = Number(m[4] || 0), mm = Number(m[5] || 0), ss = Number(m[6] || 0)
    const d = new Date(year, month, day, hh, mm, ss)
    return isNaN(d) ? null : d
  }
  return null
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState([])
  const [siteFilter, setSiteFilter] = useState(localStorage.getItem('site') || 'all')
  const [expandedIdx, setExpandedIdx] = useState(null)
  const printRef = useRef(null)

  useEffect(() => {
    const raw = listInvoices() || []
    const normalized = raw.map(inv => {
      const parsed = parseDateString(inv.date) || parseDateString(inv.time) || null
      const total = inv.total !== undefined ? Number(inv.total) : ((Number(inv.nombreContribuables) || 0) * (Number(inv.prixUnitaire) || 0))
      return { ...inv, _parsedDate: parsed, total: total }
    })
    setInvoices(normalized)
  }, [])

  const filtered = invoices.filter(inv => siteFilter === 'all' ? true : inv.site === siteFilter)
  const totalCount = filtered.length
  const totalAmount = filtered.reduce((s, i) => s + (Number(i.total) || 0), 0)

  function toggleExpand(idx) { setExpandedIdx(expandedIdx === idx ? null : idx) }

  function formatDate(inv) {
    const d = inv._parsedDate || parseDateString(inv.date) || parseDateString(inv.time)
    return d ? d.toLocaleString() : '—'
  }

  function printTable() {
    const content = printRef.current?.innerHTML || ''
    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) { alert('Impossible d\'ouvrir la fenêtre d\'impression.'); return }
    w.document.write(`
      <html>
        <head>
          <title>Impression - Factures</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css">
          <style>body{padding:20px}</style>
        </head>
        <body>
          <h3>Factures (${siteFilter === 'all' ? 'Tous' : siteFilter})</h3>
          ${content}
        </body>
      </html>
    `)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 300)
  }

  return (
    <div className="container-fluid">
      <h1>Dashboard</h1>

      <div className="mb-3 d-flex align-items-center gap-3">
        <label className="me-2">Filtrer par site :</label>
        <select value={siteFilter} onChange={e => setSiteFilter(e.target.value)} className="form-select w-auto">
          <option value="all">Tous</option>
          <option value="Kikwit">Kikwit</option>
          <option value="Bandundu">Bandundu</option>
        </select>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => {
          const raw = listInvoices() || []
          const normalized = raw.map(inv => {
            const parsed = parseDateString(inv.date) || parseDateString(inv.time) || null
            const total = inv.total !== undefined ? Number(inv.total) : ((Number(inv.nombreContribuables) || 0) * (Number(inv.prixUnitaire) || 0))
            return { ...inv, _parsedDate: parsed, total: total }
          })
          setInvoices(normalized)
        }}>Rafraîchir</button>

        <div className="ms-auto">
          <button className="btn btn-outline-primary btn-sm" onClick={printTable}>Imprimer le tableau</button>
        </div>
      </div>

      <div className="card p-3 mb-3">
        <div>Total factures: <strong>{totalCount}</strong></div>
        <div>Montant total: <strong>{totalAmount.toLocaleString()} CDF</strong></div>
      </div>

      <div ref={printRef}>
        {filtered.length === 0 && <p className="text-muted">Aucune facture pour ce filtre.</p>}
        {filtered.map((inv, idx) => (
          <div key={idx} className="card mb-2">
            <div className="card-body" style={{ cursor: 'pointer' }} onClick={() => toggleExpand(idx)}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div><strong style={{ textTransform: 'capitalize' }}>{inv.category}</strong> — <small className="text-muted">{inv.site || '—'}</small></div>
                  <div className="text-muted small">{formatDate(inv)}</div>
                </div>
                <div className="text-end">
                  <div><strong>{(Number(inv.total) || 0).toLocaleString()} CDF</strong></div>
                  <div className="small text-muted">cliquer pour voir détails</div>
                </div>
              </div>

              {expandedIdx === idx && (
                <div className="mt-3">
                  <div className="row">
                    {inv.itineraire && <div className="col-md-6"><strong>Itinéraire:</strong> {inv.itineraire}</div>}
                    {inv.typeTransport && <div className="col-md-6"><strong>Type:</strong> {inv.typeTransport}</div>}
                    {inv.immatriculation && <div className="col-md-6"><strong>Immatriculation:</strong> {inv.immatriculation}</div>}
                    {inv.nomEtablissement && <div className="col-md-6"><strong>Établissement:</strong> {inv.nomEtablissement}</div>}
                    {inv.rccm && <div className="col-md-6"><strong>RCCM:</strong> {inv.rccm}</div>}
                    {inv.idNat && <div className="col-md-6"><strong>ID NAT:</strong> {inv.idNat}</div>}
                    {inv.nif && <div className="col-md-6"><strong>NIF:</strong> {inv.nif}</div>}
                    {inv.nomResponsable && <div className="col-md-6"><strong>Responsable:</strong> {inv.nomResponsable}</div>}

                    <div className="col-md-4"><strong>Contribuables:</strong> {inv.nombreContribuables || '—'}</div>
                    <div className="col-md-4"><strong>Prix unitaire:</strong> {(Number(inv.prixUnitaire) || 0).toLocaleString()} CDF</div>
                    <div className="col-md-4"><strong>Mode paiement:</strong> {inv.modePaiement || '—'}</div>
                  </div>

                  {inv.remarques && <div className="mt-3"><strong>Remarques:</strong><div className="text-muted">{inv.remarques}</div></div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}