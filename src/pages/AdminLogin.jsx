import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiArrowLeft, FiShield, FiCheckSquare, FiUsers, FiBarChart2 } from 'react-icons/fi'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { errorMessage } from '../hooks/useFetch'
import './Auth.css'

const features = [
  { icon: FiCheckSquare, text: 'Validation des signalements en attente' },
  { icon: FiUsers, text: 'Gestion des comptes utilisateurs' },
  { icon: FiBarChart2, text: "Statistiques et rapports d'activité" },
]

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      const admin = user?.role === 'admin' || user?.role === 'administrator' || user?.role === 'moderateur'
      if (!admin) {
        await logout()
        setError("Ce compte n'a pas les droits administrateur.")
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(errorMessage(err, 'Identifiants administrateur incorrects.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__brand">
        <div className="auth__brand-logo">
          <Logo size={58} variant="light" showTagline />
        </div>
        <h2>
          Gérez la plateforme<br /><span>en toute sécurité.</span>
        </h2>
        <p>
          Accédez au tableau de bord administrateur pour valider les signalements,
          gérer les utilisateurs et superviser l'activité de la plateforme.
        </p>
        <div className="auth__features">
          {features.map(({ icon: Icon, text }) => (
            <div className="auth__feature" key={text}>
              <span className="auth__feature-icon"><Icon /></span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__card animate-in">
          <Link to="/login" className="auth__back"><FiArrowLeft /> Retour à la connexion</Link>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span className="auth__feature-icon" style={{ width: 48, height: 48, margin: '0 auto', fontSize: '1.4rem' }}>
              <FiShield />
            </span>
          </div>
          <h2 className="auth__title">Connexion Admin</h2>
          <p className="auth__subtitle">Accès réservé aux administrateurs autorisés</p>

          <form className="auth__form" onSubmit={onSubmit}>
            <Input
              label="Identifiant administrateur"
              type="email"
              placeholder="admin@trackmylost.ma"
              icon={<FiMail />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<FiLock />}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <div className="auth__options">
              <label className="auth__check">
                <input type="checkbox" defaultChecked /> Rester connecté
              </label>
              <Link to="/admin/login" className="auth__link">Mot de passe oublié ?</Link>
            </div>

            {error && <p className="auth__error" role="alert">{error}</p>}

            <Button type="submit" variant="primary" size="lg" block icon={<FiShield />} disabled={loading}>
              {loading ? 'Connexion…' : 'Accéder au panneau'}
            </Button>
          </form>

          <p className="auth__foot">
            Connexion sécurisée SSL · Accès journalisé
          </p>
        </div>
      </div>
    </div>
  )
}
