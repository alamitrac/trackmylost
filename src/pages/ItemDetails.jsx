import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  FiMapPin,
  FiClock,
  FiTag,
  FiPhone,
  FiMessageCircle,
  FiEye,
  FiChevronRight,
  FiCheckCircle,
  FiTrash2,
} from 'react-icons/fi'
import Button from '../components/Button'
import CardItem from '../components/CardItem'
import PostGallery from '../components/PostGallery'
import ShareButton from '../components/ShareButton'
import CommentsSection from '../components/CommentsSection'
import FavoriteButton from '../components/FavoriteButton'
import ReportButton from '../components/ReportButton'
import UrgencyBadge from '../components/UrgencyBadge'
import LeafletMap from '../components/LeafletMap'
import { getReport, listReports, getMatches } from '../api/reports'
import { markAsFound, deletePost } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import { useFetch, errorMessage } from '../hooks/useFetch'
import './ItemDetails.css'

const typeLabel = { lost: 'Perdu', found: 'Trouvé' }
const isResolved = (s) => ['resolved', 'resolu', 'résolu'].includes(String(s || '').toLowerCase())

export default function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [showPhone, setShowPhone] = useState(false)
  const { data: item, loading, error, reload } = useFetch(() => getReport(id), [id])
  const { data: listData } = useFetch(() => listReports(), [])
  const { data: matchesData } = useFetch(() => getMatches(id), [id])
  const items = listData || []
  const matches = matchesData || []

  const canManage = item && ((user && String(user.id) === String(item.author.id)) || isAdmin)
  const resolved = item && isResolved(item.status)

  const onMarkFound = async () => {
    if (!window.confirm('Marquer ce signalement comme « Trouvé » ? Il sera classé comme résolu.')) return
    try {
      await markAsFound(item.id)
      reload()
    } catch (err) {
      alert(errorMessage(err, "L'opération a échoué."))
    }
  }

  const onDelete = async () => {
    if (!window.confirm('Supprimer définitivement ce signalement ? Cette action est irréversible.')) return
    try {
      await deletePost(item.id)
      navigate('/', { replace: true })
    } catch (err) {
      alert(errorMessage(err, 'La suppression a échoué.'))
    }
  }

  if (loading) {
    return (
      <div className="container page details-missing">
        <p className="muted">Chargement du signalement…</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="container page details-missing">
        <h2>Signalement introuvable</h2>
        <p className="muted">Ce signalement n'existe pas ou a été retiré.</p>
        <Button to="/" variant="primary">Retour à l'accueil</Button>
      </div>
    )
  }

  const related = items.filter((i) => i.id !== item.id && i.city === item.city).slice(0, 4)
  const fallback = items.filter((i) => i.id !== item.id).slice(0, 4)
  const suggestions = related.length ? related : fallback

  return (
    <div className="container page details">
      <nav className="breadcrumb">
        <Link to="/">Accueil</Link>
        <FiChevronRight />
        <span>{item.city}</span>
        <FiChevronRight />
        <span className="breadcrumb__current">{item.title}</span>
      </nav>

      <div className="details__grid">
        {/* Main column */}
        <div className="details__main">
          <div className="details__badges">
            <UrgencyBadge level={item.urgency} tooltip />
            <span className={`badge ${item.type === 'lost' ? 'badge--lost' : 'badge--found'}`}>
              {typeLabel[item.type]}
            </span>
            {resolved && <span className="badge badge--trouve"><FiCheckCircle /> Trouvé</span>}
          </div>

          {canManage && (
            <div className="details__owner-actions">
              {!resolved && (
                <Button variant="success" size="sm" icon={<FiCheckCircle />} onClick={onMarkFound}>
                  Marquer comme trouvé
                </Button>
              )}
              <Button variant="danger" size="sm" icon={<FiTrash2 />} onClick={onDelete}>
                Supprimer
              </Button>
            </div>
          )}

          {item.images && item.images.length ? (
            <PostGallery images={item.images} alt={item.title} />
          ) : (
            <div className="details__media surface">
              <div className="details__media-empty">
                <FiTag />
                <span>Aucune photo fournie</span>
              </div>
            </div>
          )}

          <article className="details__body surface">
            <h1>{item.title}</h1>
            <div className="details__meta">
              <span><FiMapPin /> {item.location}, {item.city}</span>
              <span><FiClock /> {item.timeAgo}</span>
              <span><FiTag /> {item.category}</span>
              <span><FiEye /> {item.views} vue{item.views > 1 ? 's' : ''}</span>
            </div>

            <h3 className="details__section-title">Description</h3>
            <p className="details__desc">{item.description}</p>

            <div className="details__tags">
              {item.tags.map((t) => (
                <span key={t} className="badge badge--neutral">#{t}</span>
              ))}
            </div>

            <h3 className="details__section-title">Localisation</h3>
            {item.lat != null && item.lng != null ? (
              <div className="details__mapbox">
                <LeafletMap lat={item.lat} lng={item.lng} height={260} zoom={14} />
                <p className="muted details__map-caption">
                  <FiMapPin /> {item.location}{item.city ? `, ${item.city}` : ''}
                </p>
              </div>
            ) : (
              <div className="details__map">
                <span className="details__map-pin"><FiMapPin /></span>
                <div>
                  <strong>Dernière localisation connue</strong>
                  <span className="muted">{item.location}{item.city ? `, ${item.city}` : ''}</span>
                </div>
              </div>
            )}
          </article>

          {matches.length > 0 && (
            <div className="details__matches surface">
              <h3 className="details__section-title">
                Correspondances possibles
                <span className="details__matches-hint">Cet objet pourrait correspondre à votre signalement.</span>
              </h3>
              <ul className="match-list">
                {matches.map((m) => (
                  <li key={m.id}>
                    <Link to={`/item/${m.id}`} className="match">
                      {m.image_url ? (
                        <img src={m.image_url} alt="" className="match__img" />
                      ) : (
                        <span className="match__img match__img--empty"><FiTag /></span>
                      )}
                      <span className="match__body">
                        <span className="match__title">{m.title}</span>
                        <span className="match__meta">
                          <span className={`badge ${m.type === 'lost' ? 'badge--lost' : 'badge--found'}`}>
                            {typeLabel[m.type]}
                          </span>
                          {m.location && <span className="muted">{m.location}</span>}
                        </span>
                      </span>
                      <span className="match__score">{m.score}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="details__comments surface">
            <h3 className="details__section-title">Commentaires</h3>
            <CommentsSection postId={item.id} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="details__aside">
          <div className="surface contact-card">
            <div className="contact-card__user">
              <img className="avatar" src={item.author.avatar} alt={item.author.name} width="52" height="52" />
              <div>
                <strong>{item.author.name}</strong>
                <span className="muted">Membre vérifié</span>
              </div>
            </div>

            <Button
              variant="accent"
              size="lg"
              block
              icon={<FiPhone />}
              onClick={() => setShowPhone((v) => !v)}
            >
              {showPhone ? item.contactPhone : 'Afficher le numéro'}
            </Button>
            <Button
              variant="primary"
              size="lg"
              block
              icon={<FiMessageCircle />}
              onClick={() =>
                navigate('/messages', {
                  state: { to: { id: item.author.id, name: item.author.name, avatar: item.author.avatar } },
                })
              }
            >
              Envoyer un message
            </Button>

            <div className="contact-card__actions">
              <FavoriteButton postId={item.id} initial={item.favorited} showLabel />
              <ShareButton url={`${window.location.origin}/item/${item.id}`} title={item.title} />
              <ReportButton postId={item.id} />
            </div>

            <p className="contact-card__safety">
              ⚠️ Ne payez jamais à l'avance. Privilégiez une remise en main propre dans un lieu public.
            </p>
          </div>
        </aside>
      </div>

      <section className="details__related">
        <div className="section-title">
          <h2>Signalements similaires</h2>
          <Link to="/" className="link-arrow">Tout voir <FiChevronRight /></Link>
        </div>
        <div className="details__related-grid">
          {suggestions.map((i) => (
            <CardItem key={i.id} item={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
