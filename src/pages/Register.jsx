import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { errorMessage } from '../hooks/useFetch'
import './Auth.css'

const perks = [
  'Publication illimitée de signalements',
  'Alertes géolocalisées personnalisées',
  'Messagerie sécurisée avec les autres citoyens',
]

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [gender, setGender] = useState('homme')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const first = (fd.get('first_name') || '').toString().trim()
    const last = (fd.get('last_name') || '').toString().trim()
    const password = (fd.get('password') || '').toString()
    const day = fd.get('day')
    const month = fd.get('month')
    const year = fd.get('year')
    const payload = {
      name: `${first} ${last}`.trim() || first,
      first_name: first,
      last_name: last,
      email: (fd.get('email') || '').toString().trim(),
      password,
      password_confirmation: password,
      gender,
      birth_date: day && month && year ? `${day} ${month} ${year}` : undefined,
    }

    setLoading(true)
    try {
      const { token } = await register(payload)
      // If the API returns a token, the user is logged in → go home.
      // Otherwise send them to login to sign in with their new account.
      navigate(token ? '/' : '/login', { replace: true })
    } catch (err) {
      setError(errorMessage(err, "L'inscription a échoué. Vérifiez vos informations."))
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
          Rejoignez la communauté<br /><span>Track My Lost.</span>
        </h2>
        <p>
          C'est simple et rapide. Créez votre compte pour signaler vos objets perdus,
          aider à retrouver ceux des autres et recevoir des alertes près de vous.
        </p>
        <div className="auth__features">
          {perks.map((text) => (
            <div className="auth__feature" key={text}>
              <span className="auth__feature-icon"><FiCheckCircle /></span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__card animate-in">
          <Link to="/" className="auth__back"><FiArrowLeft /> Retour à l'accueil</Link>
          <h2 className="auth__title">Créer un compte</h2>
          <p className="auth__subtitle">C'est simple et rapide.</p>

          <form className="auth__form" onSubmit={onSubmit}>
            <div className="auth__row">
              <Input name="first_name" label="Prénom" placeholder="Prénom" icon={<FiUser />} required />
              <Input name="last_name" label="Nom de famille" placeholder="Nom de famille" required />
            </div>

            <div className="auth__row auth__row--3">
              <Input as="select" name="day" label="Jour" defaultValue="">
                <option value="" disabled>Jour</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </Input>
              <Input as="select" name="month" label="Mois" defaultValue="">
                <option value="" disabled>Mois</option>
                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </Input>
              <Input as="select" name="year" label="Année" defaultValue="">
                <option value="" disabled>Année</option>
                {Array.from({ length: 70 }, (_, i) => (
                  <option key={2008 - i}>{2008 - i}</option>
                ))}
              </Input>
            </div>

            <div>
              <span className="field-label">Genre</span>
              <div className="auth__gender">
                <label className="auth__radio">
                  Homme
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'homme'}
                    onChange={() => setGender('homme')}
                  />
                </label>
                <label className="auth__radio">
                  Femme
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'femme'}
                    onChange={() => setGender('femme')}
                  />
                </label>
              </div>
            </div>

            <Input
              name="email"
              label="Adresse e-mail ou numéro de tél."
              type="email"
              placeholder="vous@exemple.com"
              icon={<FiMail />}
              required
            />
            <Input
              name="password"
              label="Nouveau mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<FiLock />}
              required
            />

            {error && <p className="auth__error" role="alert">{error}</p>}

            <Button type="submit" variant="accent" size="lg" block disabled={loading}>
              {loading ? 'Création…' : "S'inscrire"}
            </Button>
          </form>

          <p className="auth__terms">
            En cliquant sur S'inscrire, vous acceptez nos <a href="#">Conditions générales</a>,
            notre <a href="#">Politique de confidentialité</a> et notre <a href="#">Politique
            d'utilisation des cookies</a>.
          </p>

          <p className="auth__foot">
            Vous avez déjà un compte ? <Link to="/login" className="auth__link">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
