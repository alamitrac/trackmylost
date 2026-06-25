import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiMapPin } from 'react-icons/fi'
import Logo from './Logo'
import './Footer.css'

const columns = [
  {
    title: 'Plateforme',
    links: [
      { label: 'Accueil', to: '/' },
      { label: 'Signaler un objet', to: '/signalement' },
      { label: 'Objets trouvés', to: '/' },
      { label: 'Carte des alertes', to: '/signalement' },
    ],
  },
  {
    title: 'Compte',
    links: [
      { label: 'Mon compte', to: '/mon-compte' },
      { label: 'Messagerie', to: '/messages' },
      { label: 'Notifications', to: '/notifications' },
      { label: 'Se connecter', to: '/login' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { label: 'Comment ça marche', to: '/' },
      { label: 'Conditions générales', to: '/' },
      { label: 'Confidentialité', to: '/' },
      { label: 'Nous contacter', to: '/' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo size={52} variant="light" />
          <p>
            La plateforme citoyenne du Maroc pour signaler rapidement les disparitions
            et les objets perdus ou trouvés. Ensemble, on retrouve.
          </p>
          <div className="footer__contact">
            <span><FiMapPin /> Casablanca, Maroc</span>
            <span><FiMail /> contact@trackmylost.ma</span>
          </div>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="footer__col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bar">
        <div className="container footer__bar-inner">
          <span>© 2026 Track My Lost — Tous droits réservés.</span>
          <div className="footer__lang">
            <button className="is-active">Français (France)</button>
            <button>العربية (Maroc)</button>
            <button>English (UK)</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
