import { useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Layout from './components/Layout'
import Button from './components/Button'
import Feed from './pages/Feed'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ItemDetails from './pages/ItemDetails'
import Signalement from './pages/Signalement'
import MonCompte from './pages/MonCompte'
import Favoris from './pages/Favoris'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'

// Scroll to top whenever the route changes.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="container page" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <h1 style={{ fontSize: '4rem' }}>404</h1>
      <p className="muted">Cette page n'existe pas ou a été déplacée.</p>
      <Button to="/" variant="primary">Retour à l'accueil</Button>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Pages with the standard navbar + footer shell */}
        <Route element={<Layout />}>
          {/* Public — the feed dashboard is the main landing page */}
          <Route path="/" element={<Feed />} />
          {/* Previous marketing landing page, kept reachable */}
          <Route path="/decouvrir" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetails />} />

          {/* Require a valid token */}
          <Route element={<ProtectedRoute />}>
            <Route path="/signalement" element={<Signalement />} />
            <Route path="/signalement/:id" element={<Signalement />} />
            <Route path="/mon-compte" element={<MonCompte />} />
            <Route path="/favoris" element={<Favoris />} />
            <Route path="/messages" element={<Messages />} />
            {/* Alerts page — /alerte canonical; /alertes + /notifications are aliases */}
            <Route path="/alerte" element={<Notifications />} />
            <Route path="/alertes" element={<Notifications />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Full-screen pages (own layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin area — require admin role */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  )
}
