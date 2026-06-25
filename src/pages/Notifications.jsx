import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiMessageCircle,
  FiTarget,
  FiAlertTriangle,
  FiMessageSquare,
  FiInfo,
  FiCheck,
  FiBell,
  FiShield,
} from 'react-icons/fi'
import Button from '../components/Button'
import { listNotifications, markRead, markAllRead as markAllReadApi } from '../api/notifications'
import { useFetch } from '../hooks/useFetch'
import './Notifications.css'

const config = {
  message: { icon: FiMessageCircle, tone: 'info' },
  match: { icon: FiTarget, tone: 'success' },
  urgent: { icon: FiAlertTriangle, tone: 'danger' },
  comment: { icon: FiMessageSquare, tone: 'navy' },
  admin: { icon: FiShield, tone: 'warning' },
  system: { icon: FiInfo, tone: 'warning' },
}

const tabs = [
  { id: 'all', label: 'Toutes' },
  { id: 'unread', label: 'Non lues' },
]

export default function Notifications() {
  const navigate = useNavigate()
  const { data, loading } = useFetch(() => listNotifications(), [])
  const [list, setList] = useState([])
  const [tab, setTab] = useState('all')

  useEffect(() => {
    if (data) setList(data)
  }, [data])

  const unreadCount = list.filter((n) => n.unread).length
  const visible = tab === 'unread' ? list.filter((n) => n.unread) : list

  const markAllRead = () => {
    setList((l) => l.map((n) => ({ ...n, unread: false })))
    markAllReadApi()
  }
  const openNotif = (n) => {
    setList((l) => l.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))
    markRead(n.id)
    if (n.link) navigate(n.link)
  }

  return (
    <div className="container page notifs">
      <header className="notifs__head">
        <div>
          <h1>Notifications</h1>
          <p className="muted">
            {unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''} notification${unreadCount > 1 ? 's' : ''}` : 'Vous êtes à jour 🎉'}
          </p>
        </div>
        <Button variant="outline" size="sm" icon={<FiCheck />} onClick={markAllRead}>
          Tout marquer comme lu
        </Button>
      </header>

      <div className="notifs__tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`chip ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === 'unread' && unreadCount > 0 && <span className="notifs__tab-count">{unreadCount}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted" style={{ padding: '24px 4px' }}>Chargement des notifications…</p>
      ) : visible.length ? (
        <ul className="notifs__list surface">
          {visible.map((n) => {
            const { icon: Icon, tone } = config[n.type] || config.system
            return (
              <li
                key={n.id}
                className={`notif ${n.unread ? 'is-unread' : ''} ${n.link ? 'is-clickable' : ''}`}
                onClick={() => openNotif(n)}
              >
                <span className={`notif__icon notif__icon--${tone}`}><Icon /></span>
                <div className="notif__body">
                  {n.title && <strong>{n.title}</strong>}
                  <p>{n.body}</p>
                  <span className="notif__time">{n.timeAgo}</span>
                </div>
                {n.unread && <span className="notif__dot" />}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="notifs__empty surface">
          <FiBell />
          <h3>Aucune notification</h3>
          <p className="muted">Tout est lu. Revenez plus tard !</p>
        </div>
      )}
    </div>
  )
}
