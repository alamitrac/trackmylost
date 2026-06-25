import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiSearch,
  FiBell,
  FiMessageCircle,
  FiPlusCircle,
  FiMenu,
  FiX,
  FiHome,
  FiAlertTriangle,
  FiPackage,
  FiUser,
  FiCompass,
} from 'react-icons/fi'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { unreadCount } from '../api/conversations'
import { listNotifications } from '../api/notifications'
import './Navbar.css'

const GUEST_AVATAR = 'https://ui-avatars.com/api/?name=Invité&background=16264f&color=fff&bold=true'

const links = [
  { to: '/', label: 'Accueil', icon: FiHome, end: true },
  { to: '/decouvrir', label: 'Découvrir', icon: FiCompass },
  { to: '/alerte', label: 'Alertes', icon: FiAlertTriangle },
  { to: '/signalement', label: 'Signaler', icon: FiPackage },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [msgCount, setMsgCount] = useState(0)
  const [notifCount, setNotifCount] = useState(0)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Live unread badges (messages + notifications) for the logged-in user.
  useEffect(() => {
    if (!user) {
      setMsgCount(0)
      setNotifCount(0)
      return
    }
    let active = true
    unreadCount().then((c) => active && setMsgCount(c)).catch(() => {})
    listNotifications()
      .then((n) => active && setNotifCount(n.filter((x) => x.unread).length))
      .catch(() => {})
    return () => { active = false }
  }, [user])

  const onSearch = (e) => {
    e.preventDefault()
    // Route to the home feed, passing the query so it filters the reports.
    const q = query.trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/')
    setOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <button
          className="navbar__burger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        <Logo size={46} />

        <form className="navbar__search" onSubmit={onSearch} role="search">
          <FiSearch className="navbar__search-icon" />
          <input
            type="search"
            placeholder="Rechercher un signalement, une ville…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher"
          />
        </form>

        <nav className="navbar__links">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <NavLink to="/alerte" className="navbar__icon-btn" aria-label="Notifications">
            <FiBell />
            {notifCount > 0 && <span className="navbar__dot navbar__dot--danger">{notifCount}</span>}
          </NavLink>
          <NavLink to="/messages" className="navbar__icon-btn" aria-label="Messages">
            <FiMessageCircle />
            {msgCount > 0 && <span className="navbar__dot navbar__dot--accent">{msgCount}</span>}
          </NavLink>
          <NavLink to="/signalement" className="navbar__cta">
            <FiPlusCircle />
            <span>Signaler</span>
          </NavLink>
          <NavLink to={user ? '/mon-compte' : '/login'} className="navbar__avatar" aria-label="Mon compte">
            <img className="avatar" src={user?.avatar || GUEST_AVATAR} alt={user?.fullName || 'Invité'} width="38" height="38" />
          </NavLink>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${open ? 'is-open' : ''}`}>
        <form className="navbar__search navbar__search--mobile" onSubmit={onSearch} role="search">
          <FiSearch className="navbar__search-icon" />
          <input
            type="search"
            placeholder="Rechercher…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        {[...links,
          { to: '/messages', label: 'Messages', icon: FiMessageCircle },
          { to: '/mon-compte', label: 'Mon compte', icon: FiUser },
        ].map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `navbar__drawer-link ${isActive ? 'is-active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </header>
  )
}
