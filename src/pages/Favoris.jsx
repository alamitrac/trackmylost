import { useState, useEffect } from 'react'
import { FiHeart } from 'react-icons/fi'
import CardItem from '../components/CardItem'
import Button from '../components/Button'
import { listFavorites } from '../api/favorites'
import { errorMessage } from '../hooks/useFetch'
import './Favoris.css'

/**
 * "Mes favoris" (Priority 6) — the reports the current user has saved.
 */
export default function Favoris() {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    listFavorites()
      .then((list) => active && setItems(list))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  // When the heart is toggled off, drop the card from this list.
  const onFavoriteChange = (id, fav) => {
    if (!fav) setItems((prev) => (prev || []).filter((i) => i.id !== id))
  }

  return (
    <div className="container page favoris">
      <header className="favoris__head">
        <h1><FiHeart /> Mes favoris</h1>
        <p className="muted">Les signalements que vous avez enregistrés.</p>
      </header>

      {loading ? (
        <p className="muted">Chargement…</p>
      ) : error ? (
        <p className="muted">{errorMessage(error, 'Impossible de charger vos favoris.')}</p>
      ) : items && items.length ? (
        <div className="favoris__grid">
          {items.map((item) => (
            <CardItem key={item.id} item={item} onFavoriteChange={(fav) => onFavoriteChange(item.id, fav)} />
          ))}
        </div>
      ) : (
        <div className="favoris__empty surface">
          <FiHeart className="favoris__empty-icon" />
          <p className="muted">Vous n'avez pas encore de favori.</p>
          <Button to="/" variant="accent">Parcourir les signalements</Button>
        </div>
      )}
    </div>
  )
}
