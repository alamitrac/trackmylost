import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { addFavorite, removeFavorite } from '../api/favorites'
import { useAuth } from '../context/AuthContext'
import './FavoriteButton.css'

/**
 * Save / unsave a report (Priority 6). Optimistic; persists to /favorites.
 * Guests are sent to /login.
 *
 * @param {number|string} postId
 * @param {boolean} initial      initial favorited state
 * @param {(fav:boolean)=>void} onChange
 * @param {boolean} showLabel    render "Enregistrer" text next to the heart
 * @param {string} className
 */
export default function FavoriteButton({ postId, initial = false, onChange, showLabel = false, className = '' }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [fav, setFav] = useState(!!initial)
  const [busy, setBusy] = useState(false)

  const toggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (busy) return
    const next = !fav
    setFav(next) // optimistic
    setBusy(true)
    try {
      if (next) await addFavorite(postId)
      else await removeFavorite(postId)
      onChange?.(next)
    } catch {
      setFav(!next) // revert on failure
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      className={`favbtn ${fav ? 'is-active' : ''} ${className}`}
      onClick={toggle}
      aria-pressed={fav}
      aria-label={fav ? 'Retirer des favoris' : 'Enregistrer dans les favoris'}
      title={fav ? 'Retirer des favoris' : 'Enregistrer'}
    >
      <FiHeart />
      {showLabel && <span>{fav ? 'Enregistré' : 'Enregistrer'}</span>}
    </button>
  )
}
