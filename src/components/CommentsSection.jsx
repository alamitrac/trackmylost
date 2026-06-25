import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSend, FiFlag } from 'react-icons/fi'
import { listComments, createComment } from '../api/comments'
import { reportComment } from '../api/flag'
import { errorMessage } from '../hooks/useFetch'
import { useAuth } from '../context/AuthContext'
import './CommentsSection.css'

/**
 * Comments for a report: reads existing comments (public) and lets an
 * authenticated user add new ones. Calls `onCountChange(n)` so the parent
 * can keep its comment counter in sync.
 *
 * @param {number|string} postId
 * @param {(n:number)=>void} onCountChange
 */
export default function CommentsSection({ postId, onCountChange }) {
  const { isAuthenticated, user } = useAuth()
  const [comments, setComments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    listComments(postId)
      .then((list) => active && setComments(list))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [postId])

  const submit = async (e) => {
    e.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    setError(null)
    try {
      const saved = await createComment(postId, content)
      setComments((prev) => {
        const nextList = [...(prev || []), saved]
        onCountChange?.(nextList.length)
        return nextList
      })
      setText('')
    } catch (err) {
      setError(err)
    } finally {
      setSending(false)
    }
  }

  const onReport = async (c) => {
    if (!isAuthenticated) return
    const reason = window.prompt('Signaler ce commentaire — motif (optionnel) :', '')
    if (reason === null) return // cancelled
    try {
      await reportComment(c.id, reason)
      window.alert('Commentaire signalé à la modération. Merci.')
    } catch (err) {
      window.alert(errorMessage(err, 'Le signalement a échoué.'))
    }
  }

  return (
    <section className="comments" aria-label="Commentaires">
      {loading ? (
        <p className="comments__status muted">Chargement des commentaires…</p>
      ) : error && !comments ? (
        <p className="comments__status muted">{errorMessage(error, 'Impossible de charger les commentaires.')}</p>
      ) : comments && comments.length ? (
        <ul className="comments__list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <img className="avatar" src={c.author.avatar} alt="" width="34" height="34" />
              <div className="comment__bubble">
                <div className="comment__head">
                  <span className="comment__author">{c.author.name}</span>
                  {c.timeAgo && <span className="comment__time">· {c.timeAgo}</span>}
                  {isAuthenticated && (
                    <button
                      type="button"
                      className="comment__report"
                      onClick={() => onReport(c)}
                      title="Signaler ce commentaire"
                      aria-label="Signaler ce commentaire"
                    >
                      <FiFlag />
                    </button>
                  )}
                </div>
                <p className="comment__text">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="comments__status muted">Soyez le premier à commenter.</p>
      )}

      {isAuthenticated ? (
        <form className="comments__form" onSubmit={submit}>
          <img
            className="avatar"
            src={user?.avatar || 'https://ui-avatars.com/api/?name=Moi&background=16264f&color=fff'}
            alt=""
            width="34"
            height="34"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrire un commentaire…"
            aria-label="Écrire un commentaire"
            maxLength={1000}
          />
          <button type="submit" className="comments__send" disabled={sending || !text.trim()} aria-label="Envoyer">
            <FiSend />
          </button>
        </form>
      ) : (
        <p className="comments__signin muted">
          <Link to="/login">Connectez-vous</Link> pour ajouter un commentaire.
        </p>
      )}

      {error && comments && (
        <p className="comments__status comments__status--err" role="alert">
          {errorMessage(error, "L'envoi a échoué. Réessayez.")}
        </p>
      )}
    </section>
  )
}
