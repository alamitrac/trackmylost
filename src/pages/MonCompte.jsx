import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiCheckCircle,
  FiLogOut,
  FiShield,
  FiMapPin,
  FiSave,
  FiTrash2,
  FiEdit2,
  FiCamera,
  FiHeart,
} from 'react-icons/fi'
import Input from '../components/Input'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { listReports } from '../api/reports'
import { deletePost, markAsFound } from '../api/posts'
import { updateProfile } from '../api/profile'
import { useFetch, errorMessage } from '../hooks/useFetch'
import './MonCompte.css'

const isResolved = (r) => ['resolved', 'resolu', 'résolu'].includes(String(r.status || '').toLowerCase())

export default function MonCompte() {
  const navigate = useNavigate()
  const { user: u, isAdmin, logout, setUser } = useAuth()
  const fileRef = useRef(null)

  // Own reports (Mes signalements) → local state so we can remove on delete.
  const { data: myReportsData } = useFetch(
    () => (u ? listReports({ user_id: u.id }) : Promise.resolve([])),
    [u?.id]
  )
  const [reports, setReports] = useState([])
  useEffect(() => { if (myReportsData) setReports(myReportsData) }, [myReportsData])

  // Editable profile form.
  const [form, setForm] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null) // {ok, msg}

  useEffect(() => {
    if (!u) return
    setForm({
      first_name: u.firstName || '',
      last_name: u.lastName || '',
      email: u.email || '',
      phone: u.phone || '',
      city: u.city || '',
      bio: u.bio || '',
      birth_date: u.birthDate || '',
      gender: u.gender || '',
      password: '',
    })
  }, [u?.id])

  const stats = {
    signalements: reports.length,
    resolus: reports.filter(isResolved).length,
    joursActif: u?.createdAt
      ? Math.max(1, Math.floor((Date.now() - new Date(u.createdAt).getTime()) / 86400000))
      : 0,
  }

  const onAvatar = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setAvatarFile(f)
    setAvatarPreview(URL.createObjectURL(f))
  }

  const onField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      let payload
      const fields = { ...form }
      if (!fields.password) delete fields.password
      if (avatarFile) {
        payload = new FormData()
        Object.entries(fields).forEach(([k, v]) => payload.append(k, v ?? ''))
        payload.append('avatar', avatarFile)
      } else {
        payload = fields
      }
      const updated = await updateProfile(payload)
      setUser(updated)
      setAvatarFile(null)
      setForm((p) => ({ ...p, password: '' }))
      setFeedback({ ok: true, msg: 'Profil mis à jour.' })
    } catch (err) {
      setFeedback({ ok: false, msg: errorMessage(err, 'La mise à jour a échoué.') })
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (r) => {
    if (!window.confirm(`Supprimer définitivement le signalement « ${r.title} » ? Cette action est irréversible.`)) return
    try {
      await deletePost(r.id)
      setReports((prev) => prev.filter((x) => x.id !== r.id))
    } catch (err) {
      alert(errorMessage(err, 'La suppression a échoué.'))
    }
  }

  const onMarkFound = async (r) => {
    if (!window.confirm(`Marquer « ${r.title} » comme trouvé ?`)) return
    try {
      await markAsFound(r.id)
      setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'resolved' } : x)))
    } catch (err) {
      alert(errorMessage(err, "L'opération a échoué."))
    }
  }

  const onLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  if (!u || !form) return null

  return (
    <div className="container page compte">
      <header className="compte__head">
        <h1>Mon compte</h1>
        <p className="muted">Gérez votre profil et suivez vos signalements.</p>
      </header>

      <div className="compte__grid">
        {/* Profile card */}
        <aside className="compte__profile surface">
          <div className="compte__avatar-wrap">
            <img className="avatar compte__avatar" src={avatarPreview || u.avatar} alt={u.fullName} />
            <button type="button" className="compte__avatar-edit" onClick={() => fileRef.current?.click()} aria-label="Changer la photo">
              <FiCamera />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatar} />
            {u.verified && <span className="compte__verified"><FiCheckCircle /></span>}
          </div>
          <h2 className="compte__name">{u.fullName}</h2>
          <p className="compte__email muted">{u.email}</p>

          <div className="compte__stats">
            <div><strong>{stats.signalements}</strong><span>Signalements</span></div>
            <div><strong>{stats.resolus}</strong><span>Résolus</span></div>
            <div><strong>{stats.joursActif}</strong><span>Jours actif</span></div>
          </div>

          <Button to="/favoris" variant="primary" block icon={<FiHeart />}>Mes favoris</Button>
          <Button variant="outline" block icon={<FiLogOut />} className="compte__logout" onClick={onLogout}>
            Se déconnecter
          </Button>
          {isAdmin && <Link to="/admin" className="compte__admin-link"><FiShield /> Admin Panel</Link>}

          <div className="compte__logo"><Logo size={46} showTagline /></div>
        </aside>

        {/* Right column */}
        <div className="compte__content">
          <section className="surface compte__panel">
            <h3>Informations personnelles</h3>
            <form className="compte__form" onSubmit={save}>
              <div className="compte__row">
                <Input label="Prénom" value={form.first_name} onChange={onField('first_name')} />
                <Input label="Nom de famille" value={form.last_name} onChange={onField('last_name')} />
              </div>
              <div className="compte__row">
                <Input label="Email" type="email" value={form.email} onChange={onField('email')} />
                <Input label="Téléphone" value={form.phone} onChange={onField('phone')} />
              </div>
              <div className="compte__row">
                <Input label="Ville" value={form.city} onChange={onField('city')} icon={<FiMapPin />} />
                <Input label="Date de naissance" type="date" value={form.birth_date || ''} onChange={onField('birth_date')} />
              </div>
              <Input as="select" label="Genre" value={form.gender} onChange={onField('gender')}>
                <option value="">—</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </Input>
              <Input as="textarea" label="Bio" rows={3} value={form.bio} onChange={onField('bio')} placeholder="Parlez un peu de vous…" />
              <Input label="Nouveau mot de passe" type="password" value={form.password} onChange={onField('password')} placeholder="Laisser vide pour ne pas changer" />

              {feedback && (
                <p className={feedback.ok ? 'compte__ok' : 'auth__error'} role="status">{feedback.msg}</p>
              )}

              <div className="compte__form-actions">
                <Button type="submit" variant="accent" icon={<FiSave />} disabled={saving}>
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </section>

          <section className="surface compte__panel">
            <div className="compte__panel-head">
              <h3>Mes signalements</h3>
              <span className="muted">{reports.length} au total</span>
            </div>
            {reports.length === 0 && (
              <p className="muted" style={{ padding: '6px 0' }}>Vous n'avez pas encore de signalement.</p>
            )}
            <ul className="compte__reports">
              {reports.map((r) => (
                <li key={r.id}>
                  <Link to={`/item/${r.id}`} className="compte__report-link">
                    <span className="compte__report-pin"><FiMapPin /></span>
                    <span className="compte__report-text">
                      <strong>{r.title}</strong>
                      <span className="muted">
                        {(r.location || r.city) ? `${r.location || r.city} · ` : ''}{r.timeAgo} · {r.views} vue{r.views > 1 ? 's' : ''}
                      </span>
                    </span>
                    <span className={`badge ${isResolved(r) ? 'badge--trouve' : 'badge--active'}`}>
                      {isResolved(r) ? '✓ Trouvé' : 'Actif'}
                    </span>
                  </Link>
                  <div className="compte__report-actions">
                    {!isResolved(r) && (
                      <button type="button" className="is-found" onClick={() => onMarkFound(r)} aria-label="Marquer comme trouvé" title="Marquer comme trouvé"><FiCheckCircle /></button>
                    )}
                    <button type="button" onClick={() => navigate(`/signalement/${r.id}`)} aria-label="Modifier" title="Modifier"><FiEdit2 /></button>
                    <button type="button" className="is-danger" onClick={() => onDelete(r)} aria-label="Supprimer" title="Supprimer"><FiTrash2 /></button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
