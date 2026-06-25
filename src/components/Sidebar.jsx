import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiAlertTriangle,
  FiPackage,
  FiHeart,
  FiMessageSquare,
  FiUser,
  FiShield,
} from 'react-icons/fi'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const GUEST = {
  fullName: 'Invité',
  city: 'Bienvenue sur Track My Lost',
  avatar: 'https://ui-avatars.com/api/?name=Invité&background=16264f&color=fff&bold=true',
  stats: { signalements: 0, contributions: 0, resolus: 0 },
}

const menu = [
  { to: '/', label: 'Accueil', icon: FiHome, end: true },
  { to: '/alerte', label: 'Alertes urgentes', icon: FiAlertTriangle, dot: 'danger' },
  { to: '/?type=found', label: 'Objets Trouvés', icon: FiPackage },
  { to: '/favoris', label: 'Mes favoris', icon: FiHeart },
  { to: '/messages', label: 'Messagerie', icon: FiMessageSquare, dot: 'accent' },
  { to: '/mon-compte', label: 'Mon compte', icon: FiUser },
]

export default function Sidebar() {
  const { user } = useAuth()
  const u = user || GUEST
  const stats = u.stats || GUEST.stats
  return (
    <aside className="sidebar">
      <div className="sidebar__brand surface">
        <Logo size={44} />
      </div>
      <div className="sidebar__card surface">
        <div className="sidebar__cover" />
        <img className="avatar sidebar__avatar" src={u.avatar} alt={u.fullName} />
        <h3 className="sidebar__name">{u.fullName}</h3>
        <p className="sidebar__city">{u.city}</p>

        <div className="sidebar__stats">
          <div>
            <strong>{stats.signalements}</strong>
            <span>Signalements</span>
          </div>
          <div>
            <strong>{stats.contributions}</strong>
            <span>Contributions</span>
          </div>
          <div>
            <strong>{stats.resolus}</strong>
            <span>Résolus</span>
          </div>
        </div>
      </div>

      <nav className="sidebar__menu surface">
        {menu.map(({ to, label, icon: Icon, end, dot }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <Icon className="sidebar__link-icon" />
            <span>{label}</span>
            {dot && <span className={`sidebar__dot sidebar__dot--${dot}`} />}
          </NavLink>
        ))}

        <div className="sidebar__lang">
          <button className="is-active">Français</button>
          <button>العربية</button>
          <button>English</button>
        </div>
      </nav>

      <NavLink to="/admin" className="sidebar__admin">
        <FiShield />
        <span>Admin Panel</span>
      </NavLink>
    </aside>
  )
}
