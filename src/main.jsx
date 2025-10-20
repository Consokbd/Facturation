import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import FormSelector from './FormSelector'
import Dashboard from './Dashboard'
import TerminalApp from './TerminalApp'
import './styles.css'
import './index.css'

function Unauthorized({ onAuthSuccess }) {
  const navigate = useNavigate()
  function handleLogin() {
    const pwd = prompt('Mot de passe admin :')
    if (pwd === 'admin123') {
      localStorage.setItem('userRole', 'admin')
      onAuthSuccess?.()
      navigate('/dashboard')
    } else {
      alert('Mot de passe incorrect.')
    }
  }
  return (
    <div className="card p-3">
      <h4>Accès réservé</h4>
      <p>Vous devez être administrateur pour accéder à cette page.</p>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleLogin}>Se connecter (admin)</button>
        <Link className="btn btn-secondary" to="/">Retour à l'accueil</Link>
      </div>
    </div>
  )
}

function AdminRoute({ children, onAuthSuccess }) {
  const isAdmin = localStorage.getItem('userRole') === 'admin'
  return isAdmin ? children : <Unauthorized onAuthSuccess={onAuthSuccess} />
}

export default function App() {
  const [isAdmin, setIsAdmin] = React.useState(localStorage.getItem('userRole') === 'admin')

  React.useEffect(() => {
    function onStorage() {
      setIsAdmin(localStorage.getItem('userRole') === 'admin')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function handleLogout() {
    localStorage.removeItem('userRole')
    setIsAdmin(false)
  }

  return (
    <BrowserRouter>
      <div className="container-fluid py-4">
        <nav className="mb-4 d-flex align-items-center">
          <div className="me-auto">
            <Link className="me-3" to="/">Formulaires</Link>
            {isAdmin ? <Link className="me-3" to="/dashboard">Dashboard</Link> : null}
          </div>
          <div>
            {isAdmin ? (
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Déconnexion admin</button>
            ) : (
              <Link className="btn btn-outline-primary btn-sm" to="/dashboard">Connexion admin</Link>
            )}
          </div>
        </nav>

        <Routes>
          {/* FormSelector monté avec wildcard pour routes imbriquées */}
          <Route path="/*" element={<FormSelector />} />
          <Route path="/dashboard" element={
            <AdminRoute onAuthSuccess={() => setIsAdmin(true)}>
              <Dashboard />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
