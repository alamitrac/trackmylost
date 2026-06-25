import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiMessageSquare, FiEye } from 'react-icons/fi'
import FavoriteButton from './FavoriteButton'
import UrgencyBadge from './UrgencyBadge'
import './CardItem.css'

const typeLabel = { lost: 'Perdu', found: 'Trouvé' }

/**
 * Marketplace card for a single lost/found report.
 * Clicking navigates to the item details page.
 *
 * @param {object} item
 * @param {(fav:boolean)=>void} onFavoriteChange  notified when the heart toggles
 */
export default function CardItem({ item, onFavoriteChange }) {
  return (
    <article className={`card card--urg-${item.urgency || 'normal'}`}>
      <Link to={`/item/${item.id}`} className="card__media" aria-label={item.title}>
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <span className={`badge ${item.type === 'lost' ? 'badge--lost' : 'badge--found'} card__type`}>
          {typeLabel[item.type]}
        </span>
        <UrgencyBadge level={item.urgency} className="card__urgency" />
        <FavoriteButton
          postId={item.id}
          initial={item.favorited}
          onChange={onFavoriteChange}
          className="card__fav favbtn--round"
        />
      </Link>

      <div className="card__body">
        <Link to={`/item/${item.id}`} className="card__title">
          {item.title}
        </Link>

        <div className="card__meta">
          <span><FiMapPin /> {item.location}, {item.city}</span>
          <span><FiClock /> {item.timeAgo}</span>
        </div>

        <div className="card__footer">
          <div className="card__author">
            <img className="avatar" src={item.author.avatar} alt="" width="26" height="26" />
            <span>{item.author.name}</span>
          </div>
          <span className="card__comments">
            <span><FiEye /> {item.views}</span>
            <span><FiMessageSquare /> {item.comments}</span>
          </span>
        </div>
      </div>
    </article>
  )
}
