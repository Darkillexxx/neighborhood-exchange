import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ItemImage from './ItemImage.jsx'
import { formatPrice, formatDistance } from '../data/items.js'
import './ItemCard.css'

export default function ItemCard({ item, saved, onToggleSave }) {
  return (
    <article className="item-card">
      <Link to={`/item/${item.id}`} className="item-card__link">
        <ItemImage item={item} className="item-card__image" />
        <div className="item-card__body">
          <p className="item-card__price">{formatPrice(item.price)}</p>
          <h3 className="item-card__title">{item.title}</h3>
          <p className="item-card__meta">
            {formatDistance(item.distanceKm)} · {item.postedAgo}
          </p>
        </div>
      </Link>
      <button
        type="button"
        className={`item-card__save${saved ? ' is-saved' : ''}`}
        aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
        aria-pressed={saved}
        onClick={() => onToggleSave(item.id)}
      >
        <Heart size={17} strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </article>
  )
}
