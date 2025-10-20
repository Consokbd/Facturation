import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { saveInvoice } from './services_storage'

function useNowDefaults() {
  const now = new Date()
  return { date: now.toISOString().slice(0, 10), time: now.toTimeString().slice(0, 8) }
}

function CardButton({ to, title, subtitle }) {
  return (
    <div className="col-12 col-md-6 col-lg-3 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted mb-3">{subtitle}</p>
          <div className="mt-auto">
            <Link to={to} className="btn btn-primary">Ouvrir</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function SiteSelector({ onSelect }) {
  return (
    <div className="card p-4 text-center">
      <h2>Choisir le site du terminal</h2>
      <p>Sélectionnez le site où se trouve le terminal de facturation :</p>
      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-outline-primary" onClick={() => onSelect('Kikwit')}>Kikwit</button>
        <button className="btn btn-outline-primary" onClick={() => onSelect('Bandundu')}>Bandundu</button>
      </div>
    </div>
  )
}

function Selection({ site, onChangeSite }) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="mb-0">Choisir le formulaire de facturation</h1>
          <small className="text-muted">Site actif : <strong>{site}</strong></small>
        </div>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onChangeSite(null)}>Changer de site</button>
        </div>
      </div>

      <div className="row">
        <CardButton to="transport" title="Transport" subtitle="Taxe transport — itinéraire, immatriculation, nombre..." />
        <CardButton to="education" title="Établissement" subtitle="Établissement d'enseignement — nom, zone, adresse..." />
        <CardButton to="entreprise" title="Entreprise" subtitle="RCCM, ID NAT, NIF, adresse..." />
        <CardButton to="menage" title="Ménage" subtitle="Responsable, nombre de contribuables..." />
      </div>
    </div>
  )
}

function BackHeader({ title }) {
  const navigate = useNavigate()
  return (
    <div className="d-flex align-items-center mb-3">
      <button className="btn btn-outline-secondary me-3" onClick={() => navigate('/')}>← Retour</button>
      <h2 className="m-0">{title}</h2>
    </div>
  )
}

function FormWrapper({ children }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">{children}</div>
    </div>
  )
}

/* --- Forms --- each receives prop site and saves it with invoice --- */

function TransportForm({ site }) {
  const defaults = useNowDefaults()
  const [data, setData] = useState({
    date: defaults.date, time: defaults.time, itineraire: '', typeTransport: '', immatriculation: '',
    nombreContribuables: 1, prixUnitaire: 0, modePaiement: '', remarques: ''
  })

  const total = (Number(data.nombreContribuables) || 0) * (Number(data.prixUnitaire) || 0)

  function handleChange(e) {
    const { name, value } = e.target
    setData(s => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const isoDate = new Date(`${data.date}T${data.time}`).toISOString()
    const invoice = { category: 'transport', site, ...data, total, date: isoDate }
    saveInvoice(invoice)
    alert('Facture transport enregistrée.')
  }

  return (
    <div>
      <BackHeader title="Facture — Transport" />
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label">Date</label>
              <input className="form-control" name="date" type="date" value={data.date} onChange={handleChange} required />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label">Heure</label>
              <input className="form-control" name="time" type="time" value={data.time} onChange={handleChange} required />
            </div>
            <div className="col-12 col-md-12 col-lg-6">
              <label className="form-label">Itinéraire</label>
              <input className="form-control" name="itineraire" value={data.itineraire} onChange={handleChange} />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Type de transport</label>
              <input className="form-control" name="typeTransport" value={data.typeTransport} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Immatriculation</label>
              <input className="form-control" name="immatriculation" value={data.immatriculation} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Mode de paiement</label>
              <input className="form-control" name="modePaiement" value={data.modePaiement} onChange={handleChange} />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Nombre des contribuables</label>
              <input className="form-control" name="nombreContribuables" type="number" min="1" value={data.nombreContribuables} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Prix unitaire (CDF)</label>
              <input className="form-control" name="prixUnitaire" type="number" min="0" value={data.prixUnitaire} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-4 d-flex flex-column">
              <label className="form-label">Total payer</label>
              <div className="h-100 d-flex align-items-center">{total.toLocaleString()} CDF</div>
            </div>

            <div className="col-12">
              <label className="form-label">Remarques</label>
              <textarea className="form-control" name="remarques" value={data.remarques} onChange={handleChange} />
            </div>

            <div className="col-12 mt-3 d-flex">
              <button type="submit" className="btn btn-success me-2">Valider</button>
              <button type="button" className="btn btn-secondary" onClick={() => window.print()}>Imprimer ticket</button>
            </div>
          </div>
        </form>
      </FormWrapper>
    </div>
  )
}

function EducationForm({ site }) {
  const defaults = useNowDefaults()
  const [data, setData] = useState({
    date: defaults.date, time: defaults.time, zoneEducationnelle: '', nomEtablissement: '', adresse: '',
    nombreContribuables: 1, prixUnitaire: 0, modePaiement: '', remarques: ''
  })
  const total = (Number(data.nombreContribuables) || 0) * (Number(data.prixUnitaire) || 0)
  function handleChange(e) { const { name, value } = e.target; setData(s => ({ ...s, [name]: value })) }
  function handleSubmit(e) {
    e.preventDefault()
    const isoDate = new Date(`${data.date}T${data.time}`).toISOString()
    const invoice = { category: 'education', site, ...data, total, date: isoDate }
    saveInvoice(invoice); alert('Facture établissement enregistrée.')
  }
  return (
    <div>
      <BackHeader title="Facture — Établissement d'enseignement" />
      <FormWrapper>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label">Date</label>
            <input className="form-control" name="date" type="date" value={data.date} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label">Heure</label>
            <input className="form-control" name="time" type="time" value={data.time} onChange={handleChange} required />
          </div>

          <div className="col-12">
            <label className="form-label">Zone éducationnelle</label>
            <input className="form-control" name="zoneEducationnelle" value={data.zoneEducationnelle} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Nom de l'établissement</label>
            <input className="form-control" name="nomEtablissement" value={data.nomEtablissement} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Adresse</label>
            <input className="form-control" name="adresse" value={data.adresse} onChange={handleChange} />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Nombre des contribuables</label>
            <input className="form-control" name="nombreContribuables" type="number" min="1" value={data.nombreContribuables} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Prix unitaire (CDF)</label>
            <input className="form-control" name="prixUnitaire" type="number" min="0" value={data.prixUnitaire} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-4 d-flex align-items-center">
            <div>Total: {total.toLocaleString()} CDF</div>
          </div>

          <div className="col-12 mt-2 d-flex">
            <button type="submit" className="btn btn-success me-2">Valider</button>
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>Imprimer ticket</button>
          </div>
        </form>
      </FormWrapper>
    </div>
  )
}

function EnterpriseForm({ site }) {
  const defaults = useNowDefaults()
  const [data, setData] = useState({
    date: defaults.date, time: defaults.time, rccm: '', idNat: '', nif: '', adresse: '',
    prixUnitaire: 0, modePaiement: '', remarques: ''
  })
  const total = Number(data.prixUnitaire) || 0
  function handleChange(e) { const { name, value } = e.target; setData(s => ({ ...s, [name]: value })) }
  function handleSubmit(e) {
    e.preventDefault()
    const isoDate = new Date(`${data.date}T${data.time}`).toISOString()
    const invoice = { category: 'entreprise', site, ...data, total, date: isoDate }
    saveInvoice(invoice); alert('Facture entreprise enregistrée.')
  }
  return (
    <div>
      <BackHeader title="Facture — Entreprise" />
      <FormWrapper>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label">Date</label>
            <input className="form-control" name="date" type="date" value={data.date} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label">Heure</label>
            <input className="form-control" name="time" type="time" value={data.time} onChange={handleChange} required />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">RCCM</label>
            <input className="form-control" name="rccm" value={data.rccm} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">ID NAT</label>
            <input className="form-control" name="idNat" value={data.idNat} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">NIF</label>
            <input className="form-control" name="nif" value={data.nif} onChange={handleChange} />
          </div>

          <div className="col-12">
            <label className="form-label">Adresse</label>
            <input className="form-control" name="adresse" value={data.adresse} onChange={handleChange} />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Prix unitaire (CDF)</label>
            <input className="form-control" name="prixUnitaire" type="number" min="0" value={data.prixUnitaire} onChange={handleChange} />
          </div>

          <div className="col-12 mt-2 d-flex">
            <button type="submit" className="btn btn-success me-2">Valider</button>
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>Imprimer ticket</button>
          </div>
        </form>
      </FormWrapper>
    </div>
  )
}

function HouseholdForm({ site }) {
  const defaults = useNowDefaults()
  const [data, setData] = useState({
    date: defaults.date, time: defaults.time, nomResponsable: '', nombreContribuables: 1,
    prixUnitaire: 0, modePaiement: '', remarques: ''
  })
  const total = (Number(data.nombreContribuables) || 0) * (Number(data.prixUnitaire) || 0)
  function handleChange(e) { const { name, value } = e.target; setData(s => ({ ...s, [name]: value })) }
  function handleSubmit(e) {
    e.preventDefault()
    const isoDate = new Date(`${data.date}T${data.time}`).toISOString()
    const invoice = { category: 'menage', site, ...data, total, date: isoDate }
    saveInvoice(invoice); alert('Facture ménage enregistrée.')
  }
  return (
    <div>
      <BackHeader title="Facture — Ménage" />
      <FormWrapper>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label">Date</label>
            <input className="form-control" name="date" type="date" value={data.date} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label">Heure</label>
            <input className="form-control" name="time" type="time" value={data.time} onChange={handleChange} required />
          </div>

          <div className="col-12">
            <label className="form-label">Nom du Responsable</label>
            <input className="form-control" name="nomResponsable" value={data.nomResponsable} onChange={handleChange} />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Nombre des contribuables</label>
            <input className="form-control" name="nombreContribuables" type="number" min="1" value={data.nombreContribuables} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Prix unitaire (CDF)</label>
            <input className="form-control" name="prixUnitaire" type="number" min="0" value={data.prixUnitaire} onChange={handleChange} />
          </div>

          <div className="col-12 mt-2 d-flex">
            <button type="submit" className="btn btn-success me-2">Valider</button>
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>Imprimer ticket</button>
          </div>
        </form>
      </FormWrapper>
    </div>
  )
}

export default function FormSelector() {
  const [site, setSite] = useState(localStorage.getItem('site') || null)

  useEffect(() => {
    if (site) localStorage.setItem('site', site)
    else localStorage.removeItem('site')
  }, [site])

  if (!site) {
    return (
      <div className="container-fluid py-4">
        <SiteSelector onSelect={(s) => setSite(s)} />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <Routes>
        <Route index element={<Selection site={site} onChangeSite={() => setSite(null)} />} />
        <Route path="transport" element={<TransportForm site={site} />} />
        <Route path="education" element={<EducationForm site={site} />} />
        <Route path="entreprise" element={<EnterpriseForm site={site} />} />
        <Route path="menage" element={<HouseholdForm site={site} />} />
      </Routes>
    </div>
  )
}