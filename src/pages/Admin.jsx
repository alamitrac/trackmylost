import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiGrid,
  FiFlag,
  FiFileText,
  FiMessageSquare,
  FiUsers,
  FiActivity,
  FiLogOut,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSlash,
  FiCheckCircle,
  FiExternalLink,
  FiTarget,
  FiSend,
  FiShield,
} from 'react-icons/fi'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import {
  adminStats,
  adminReports,
  adminPosts,
  adminToggleHide,
  adminDeletePost,
  adminComments,
  adminDeleteComment,
  adminUsers,
  adminSetUserStatus,
  adminLogs,
  adminSendMessage,
  adminMatches,
  adminCommentReports,
  adminIgnoreCommentReport,
  adminMessageReports,
  adminIgnoreMessageReport,
  adminDeleteMessage,
} from '../api/admin'
import './Admin.css'

const NAV = [
  { id: 'dashboard', label: 'Tableau de bord', icon: FiGrid },
  { id: 'reports', label: 'Posts signalés', icon: FiFlag },
  { id: 'moderation', label: 'Modération / Signalements', icon: FiShield },
  { id: 'posts', label: 'Modération posts', icon: FiFileText },
  { id: 'comments', label: 'Commentaires', icon: FiMessageSquare },
  { id: 'users', label: 'Utilisateurs', icon: FiUsers },
  { id: 'matches', label: 'Correspondances', icon: FiTarget },
  { id: 'logs', label: 'Journal de modération', icon: FiActivity },
]

const fmt = (d) => {
  if (!d) return ''
  const date = new Date(d)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function Admin() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [section, setSection] = useState('dashboard')

  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [matches, setMatches] = useState([])
  const [commentReports, setCommentReports] = useState([])
  const [messageReports, setMessageReports] = useState([])
  const [modTab, setModTab] = useState('comments')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async (sec) => {
    setLoading(true)
    setErr('')
    try {
      if (sec === 'dashboard') setStats(await adminStats())
      else if (sec === 'reports') setReports(await adminReports())
      else if (sec === 'posts') setPosts(await adminPosts())
      else if (sec === 'comments') setComments(await adminComments())
      else if (sec === 'users') setUsers(await adminUsers())
      else if (sec === 'matches') setMatches(await adminMatches())
      else if (sec === 'logs') setLogs(await adminLogs())
      else if (sec === 'moderation') {
        const [cr, mr] = await Promise.all([adminCommentReports(), adminMessageReports()])
        setCommentReports(cr)
        setMessageReports(mr)
        setStats(await adminStats())
      }
    } catch (e) {
      setErr(e?.response?.status === 403 ? 'Accès réservé aux administrateurs.' : 'Erreur de chargement.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(section) }, [section, load])
  // Keep the reports badge fresh on first load.
  useEffect(() => { adminStats().then(setStats).catch(() => {}) }, [])

  const onLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  // ---- moderation actions ----
  const hidePost = async (id) => { await adminToggleHide(id); load(section) }
  const removePost = async (id) => {
    if (!window.confirm('Supprimer définitivement ce post et ses images ?')) return
    await adminDeletePost(id); load(section)
  }
  const removeComment = async (id) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return
    await adminDeleteComment(id); load(section)
  }
  const setStatus = async (id, status) => { await adminSetUserStatus(id, status); load(section) }
  const messageUser = async (u) => {
    const content = window.prompt(`Message à ${u.name} (de la part de l'administration) :`)
    if (!content || !content.trim()) return
    try {
      await adminSendMessage(u.id, content.trim())
      window.alert('Message envoyé.')
    } catch {
      window.alert("Échec de l'envoi.")
    }
  }

  // ---- comment/message report moderation ----
  const ignoreCommentRep = async (id) => { await adminIgnoreCommentReport(id); load('moderation') }
  const delReportedComment = async (commentId) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return
    await adminDeleteComment(commentId); load('moderation')
  }
  const ignoreMessageRep = async (id) => { await adminIgnoreMessageReport(id); load('moderation') }
  const delReportedMessage = async (messageId) => {
    if (!window.confirm('Supprimer ce message ?')) return
    await adminDeleteMessage(messageId); load('moderation')
  }

  const modPending = (stats?.comment_reports ?? 0) + (stats?.message_reports ?? 0)

  const open = (id) => window.open(`/item/${id}`, '_blank')

  return (
    <div className="admin">
      <aside className="admin__side">
        <div className="admin__brand"><Logo size={42} variant="light" /></div>
        <span className="admin__side-label">Admin Panel</span>

        <nav className="admin__nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`admin__nav-item ${section === id ? 'is-active' : ''}`}
              onClick={() => setSection(id)}
            >
              <Icon />
              <span>{label}</span>
              {id === 'reports' && stats?.reports > 0 && <span className="admin__nav-badge">{stats.reports}</span>}
              {id === 'moderation' && modPending > 0 && <span className="admin__nav-badge">{modPending}</span>}
            </button>
          ))}
        </nav>

        <button type="button" className="admin__logout" onClick={onLogout}><FiLogOut /> Déconnexion</button>
      </aside>

      <main className="admin__main">
        {err && <div className="admin__empty">{err}</div>}
        {loading && <div className="admin__empty">Chargement…</div>}

        {/* DASHBOARD */}
        {section === 'dashboard' && !loading && stats && (
          <>
            <div className="admin__panel-head"><h2>Tableau de bord</h2></div>
            <div className="admin__stats">
              {[
                { label: 'Utilisateurs', value: stats.users, tone: 'info' },
                { label: 'Signalements', value: stats.posts, tone: 'navy' },
                { label: 'Commentaires', value: stats.comments, tone: 'success' },
                { label: 'Posts signalés', value: stats.reports, tone: 'warning' },
                { label: 'Posts masqués', value: stats.hidden_posts, tone: 'warning' },
                { label: 'Résolus', value: stats.resolved_posts, tone: 'success' },
                { label: 'Comptes suspendus', value: stats.suspended_users, tone: 'navy' },
              ].map((s) => (
                <div key={s.label} className="admin__stat">
                  <span className={`admin__stat-icon admin__stat-icon--${s.tone}`}><FiActivity /></span>
                  <div><strong>{s.value}</strong><span>{s.label}</span></div>
                </div>
              ))}
            </div>
            <div className="admin__panel">
              <div className="admin__panel-head"><h3>Activité aujourd'hui</h3></div>
              <div className="admin__today">
                <div><strong>{stats.today.posts}</strong><span>Nouveaux signalements</span></div>
                <div><strong>{stats.today.comments}</strong><span>Commentaires</span></div>
                <div><strong>{stats.today.reports}</strong><span>Signalements abus</span></div>
                <div><strong>{stats.today.users}</strong><span>Nouveaux comptes</span></div>
              </div>
            </div>

            <div className="admin__panel">
              <div className="admin__panel-head"><h3>Répartition par urgence</h3></div>
              <div className="admin__today admin__urgency">
                <div><span className="admin__urg-dot" style={{ background: 'var(--danger)' }} /><strong>{stats.urgency?.max ?? 0}</strong><span>Urgence Maximale</span></div>
                <div><span className="admin__urg-dot" style={{ background: 'var(--orange-500)' }} /><strong>{stats.urgency?.medium ?? 0}</strong><span>Priorité Moyenne</span></div>
                <div><span className="admin__urg-dot" style={{ background: 'var(--success)' }} /><strong>{stats.urgency?.low ?? 0}</strong><span>Priorité Faible</span></div>
                <div><span className="admin__urg-dot" style={{ background: 'var(--info)' }} /><strong>{stats.urgency?.normal ?? 0}</strong><span>Trouvé (auto)</span></div>
              </div>
            </div>
          </>
        )}

        {/* REPORTED POSTS */}
        {section === 'reports' && !loading && (
          <>
            <div className="admin__panel-head"><h2>Posts signalés</h2></div>
            {reports.length === 0 ? (
              <div className="admin__empty">Aucun post signalé. 🎉</div>
            ) : (
              <div className="admin__reports">
                {reports.map((r) => (
                  <div key={r.id} className="admin__report">
                    <div className="admin__report-info">
                      <div className="admin__report-title">{r.post?.title || 'Post supprimé'}</div>
                      <div className="admin__report-meta">
                        <span className="admin__badge admin__badge--danger"><FiFlag /> {r.reason}</span>
                        <span>Par {r.user?.name || '—'}</span>
                        <span>· {fmt(r.created_at)}</span>
                      </div>
                    </div>
                    <div className="admin__report-actions">
                      {r.post && (
                        <>
                          <button className="admin__act" onClick={() => open(r.post.id)}><FiExternalLink /> Voir</button>
                          <button className="admin__act" onClick={() => hidePost(r.post.id)}><FiEyeOff /> Masquer</button>
                          <button className="admin__act admin__act--danger" onClick={() => removePost(r.post.id)}><FiTrash2 /> Supprimer</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MODERATION — reported comments & messages */}
        {section === 'moderation' && !loading && (
          <>
            <div className="admin__panel-head"><h2>Modération / Signalements</h2></div>
            <div className="admin__subtabs">
              <button
                className={`admin__subtab ${modTab === 'comments' ? 'is-active' : ''}`}
                onClick={() => setModTab('comments')}
              >
                Commentaires signalés
                {commentReports.length > 0 && <span className="admin__nav-badge">{commentReports.length}</span>}
              </button>
              <button
                className={`admin__subtab ${modTab === 'messages' ? 'is-active' : ''}`}
                onClick={() => setModTab('messages')}
              >
                Messages signalés
                {messageReports.length > 0 && <span className="admin__nav-badge">{messageReports.length}</span>}
              </button>
            </div>

            {modTab === 'comments' && (
              commentReports.length === 0 ? (
                <div className="admin__empty">Aucun commentaire signalé. 🎉</div>
              ) : (
                <div className="admin__table-wrap">
                  <table className="admin__table">
                    <thead><tr><th>Commentaire</th><th>Auteur</th><th>Signalé par</th><th>Motif</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {commentReports.map((r) => (
                        <tr key={r.id}>
                          <td>{r.comment?.content || '— (supprimé)'}</td>
                          <td>{r.comment?.user?.name || '—'}</td>
                          <td>{r.user?.name || '—'}</td>
                          <td>{r.reason || <span className="muted">—</span>}</td>
                          <td>{fmt(r.created_at)}</td>
                          <td className="admin__row-actions">
                            <button className="admin__act" onClick={() => ignoreCommentRep(r.id)}>Ignorer</button>
                            {r.comment && (
                              <button className="admin__act admin__act--danger" onClick={() => delReportedComment(r.comment.id)}><FiTrash2 /> Supprimer</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {modTab === 'messages' && (
              messageReports.length === 0 ? (
                <div className="admin__empty">Aucun message signalé. 🎉</div>
              ) : (
                <div className="admin__table-wrap">
                  <table className="admin__table">
                    <thead><tr><th>Message</th><th>Expéditeur</th><th>Signalé par</th><th>Motif</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {messageReports.map((r) => (
                        <tr key={r.id}>
                          <td>{r.message?.content || '— (supprimé)'}</td>
                          <td>{r.message?.sender?.name || '—'}</td>
                          <td>{r.user?.name || '—'}</td>
                          <td>{r.reason || <span className="muted">—</span>}</td>
                          <td>{fmt(r.created_at)}</td>
                          <td className="admin__row-actions">
                            <button className="admin__act" onClick={() => ignoreMessageRep(r.id)}>Ignorer</button>
                            {r.message && (
                              <button className="admin__act admin__act--danger" onClick={() => delReportedMessage(r.message.id)}><FiTrash2 /> Supprimer</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}

        {/* POSTS MODERATION */}
        {section === 'posts' && !loading && (
          <>
            <div className="admin__panel-head"><h2>Modération des posts</h2></div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr><th>Titre</th><th>Auteur</th><th>Type</th><th>Vues</th><th>Signalé</th><th>État</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.title}</td>
                      <td>{p.user?.name || '—'}</td>
                      <td>{p.type === 'lost' ? 'Perdu' : 'Trouvé'}</td>
                      <td>{p.views}</td>
                      <td>{p.reports_count}</td>
                      <td>
                        {p.hidden
                          ? <span className="admin__badge admin__badge--muted">Masqué</span>
                          : <span className="admin__badge admin__badge--success">Visible</span>}
                      </td>
                      <td className="admin__row-actions">
                        <button className="admin__act" onClick={() => open(p.id)}><FiExternalLink /></button>
                        <button className="admin__act" onClick={() => hidePost(p.id)}>
                          {p.hidden ? <FiEye /> : <FiEyeOff />}
                        </button>
                        <button className="admin__act admin__act--danger" onClick={() => removePost(p.id)}><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* COMMENTS */}
        {section === 'comments' && !loading && (
          <>
            <div className="admin__panel-head"><h2>Commentaires</h2></div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead><tr><th>Commentaire</th><th>Auteur</th><th>Post</th><th>Date</th><th></th></tr></thead>
                <tbody>
                  {comments.map((c) => (
                    <tr key={c.id}>
                      <td>{c.content}</td>
                      <td>{c.user?.name || '—'}</td>
                      <td>{c.post?.title || '—'}</td>
                      <td>{fmt(c.created_at)}</td>
                      <td className="admin__row-actions">
                        <button className="admin__act admin__act--danger" onClick={() => removeComment(c.id)}><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* USERS */}
        {section === 'users' && !loading && (
          <>
            <div className="admin__panel-head"><h2>Utilisateurs</h2></div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Posts</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.posts_count}</td>
                      <td>
                        {u.status === 'suspended'
                          ? <span className="admin__badge admin__badge--danger">Suspendu</span>
                          : <span className="admin__badge admin__badge--success">Actif</span>}
                      </td>
                      <td className="admin__row-actions">
                        <button className="admin__act" onClick={() => messageUser(u)}><FiSend /> Message</button>
                        {u.status === 'suspended'
                          ? <button className="admin__act" onClick={() => setStatus(u.id, 'active')}><FiCheckCircle /> Réactiver</button>
                          : <button className="admin__act admin__act--danger" onClick={() => setStatus(u.id, 'suspended')}><FiSlash /> Suspendre</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* POTENTIAL MATCHES */}
        {section === 'matches' && !loading && (
          <>
            <div className="admin__panel-head"><h2>Correspondances Perdu ↔ Trouvé</h2></div>
            {matches.length === 0 ? (
              <div className="admin__empty">Aucune correspondance détectée pour le moment.</div>
            ) : (
              <div className="admin__table-wrap">
                <table className="admin__table">
                  <thead><tr><th>Signalement perdu</th><th>Correspondance trouvée</th><th>Score</th><th></th></tr></thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={i}>
                        <td>{m.lost.title}<br /><span className="muted">{m.lost.location}</span></td>
                        <td>{m.found.title}<br /><span className="muted">{m.found.location}</span></td>
                        <td><span className="admin__badge admin__badge--success">{m.score}%</span></td>
                        <td className="admin__row-actions">
                          <button className="admin__act" onClick={() => open(m.lost.id)}><FiExternalLink /> Perdu</button>
                          <button className="admin__act" onClick={() => open(m.found.id)}><FiExternalLink /> Trouvé</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* MODERATION LOGS */}
        {section === 'logs' && !loading && (
          <>
            <div className="admin__panel-head"><h2>Journal de modération</h2></div>
            {logs.length === 0 ? (
              <div className="admin__empty">Aucune action enregistrée.</div>
            ) : (
              <div className="admin__table-wrap">
                <table className="admin__table">
                  <thead><tr><th>Quand</th><th>Modérateur</th><th>Action</th><th>Cible</th><th>Détails</th></tr></thead>
                  <tbody>
                    {logs.map((l) => (
                      <tr key={l.id}>
                        <td>{fmt(l.created_at)}</td>
                        <td>{l.admin?.name || '—'}</td>
                        <td><span className="admin__badge admin__badge--navy">{l.action}</span></td>
                        <td>{l.target_type ? `${l.target_type} #${l.target_id}` : '—'}</td>
                        <td>{l.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
