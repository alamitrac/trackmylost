import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMail, FiLock, FiArrowLeft, FiBell, FiMap, FiShield } from 'react-icons/fi'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { errorMessage } from '../hooks/useFetch'
import './Auth.css'

const features = [
  { icon: FiBell, text: 'Recevez des alertes en temps réel près de chez vous' },
  { icon: FiMap, text: 'Localisez les objets perdus et trouvés sur la carte' },
  { icon: FiShield, text: 'Échangez en toute sécurité avec la messagerie intégrée' },
]

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Identifiants incorrects. Réessayez.'))
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
          Signalez, recherchez,<br /><span>retrouvez ensemble.</span>
        </h2>
        <p>
          TrackMyLost est une plateforme citoyenne permettant de signaler rapidement
          les disparitions et les objets perdus ou trouvés au Maroc.
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
          <Link to="/" className="auth__back"><FiArrowLeft /> Retour à l'accueil</Link>
          <h2 className="auth__title">Accéder au compte</h2>
          <p className="auth__subtitle">Heureux de vous revoir 👋</p>

          <form className="auth__form" onSubmit={onSubmit}>
            <Input
              label="Adresse e-mail ou numéro de tél."
              type="email"
              placeholder="vous@exemple.com"
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
                <input type="checkbox" defaultChecked /> Gardez-moi connecté
              </label>
              <Link to="/login" className="auth__link">Mot de passe oublié ?</Link>
            </div>

            {error && <p className="auth__error" role="alert">{error}</p>}

            <Button type="submit" variant="primary" size="lg" block disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
            <Button to="/register" variant="accent" size="lg" block>Créer un nouveau compte</Button>
          </form>

          <p className="auth__foot">
            Espace administrateur ? <Link to="/admin/login" className="auth__link">Connexion Admin</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
