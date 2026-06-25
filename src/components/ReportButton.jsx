import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiFlag, FiCheck } from 'react-icons/fi'
import Modal from './Modal'
import Button from './Button'
import { reportPost } from '../api/flag'
import { errorMessage } from '../hooks/useFetch'
import { useAuth } from '../context/AuthContext'
import './ReportButton.css'

const REASONS = [
  'Contenu inapproprié',
  'Spam ou publicité',
  'Arnaque / fraude',
  'Faux signalement',
  'Autre',
]

/**
 * "Signaler ce post" — lets a user flag a report as inappropriate/suspicious.
 * Opens a modal to pick a reason; posts to /reports (Priority 3).
 *
 * @param {number|string} postId
 * @param {string} className  classes for the trigger button
 */
export default function ReportButton({ postId, className = '' }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState(REASONS[0])
  const [detail, setDetail] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const trigger = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setDone(false)
    setError('')
    setOpen(true)
  }

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      const full = detail.trim() ? `${reason} — ${detail.trim()}` : reason
      await reportPost(postId, full)
      setDone(true)
      setTimeout(() => setOpen(false), 1300)
    } catch (err) {
      setError(errorMessage(err, "Le signalement a échoué. Réessayez."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button type="button" className={className || 'reportbtn'} onClick={trigger} aria-label="Signaler ce post">
        <FiFlag /> Signaler
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<FiFlag />}
        title="Signaler ce post"
        subtitle="Aidez-nous à garder la plateforme sûre."
        footer={
          done ? null : (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button variant="danger" icon={<FiFlag />} onClick={submit} disabled={busy}>
                {busy ? 'Envoi…' : 'Envoyer le signalement'}
              </Button>
            </>
          )
        }
      >
        {done ? (
          <p className="report-modal__done"><FiCheck /> Merci, votre signalement a été transmis à la modération.</p>
        ) : (
          <div className="report-modal">
            <span className="field-label">Motif</span>
            <div className="report-modal__reasons">
              {REASONS.map((r) => (
                <label key={r} className={`report-modal__reason ${reason === r ? 'is-active' : ''}`}>
                  <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <span className="field-label">Détails (optionnel)</span>
            <textarea
              className="report-modal__detail"
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Décrivez le problème…"
              maxLength={500}
            />
            {error && <p className="auth__error" role="alert">{error}</p>}
          </div>
        )}
      </Modal>
    </>
  )
}
