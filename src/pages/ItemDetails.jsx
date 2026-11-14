import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, MapPin, Share } from 'lucide-react'
import ItemImage from '../components/ItemImage.jsx'
import useSaved from '../useSaved.js'
import { ITEMS, formatPrice, formatDistance } from '../data/items.js'
import './ItemDetails.css'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSaved, toggle } = useSaved()
  const [notice, setNotice] = useState('')
  const item = ITEMS.find((i) => i.id === id)

  if (!item) {
    return (
      <main className="screen">
        <p>This item is no longer available.</p>
        <Link to="/">Back to Home</Link>
      </main>
    )
  }

  const saved = isSaved(item.id)
  const distance = formatDistance(item.distanceKm)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setNotice('Link copied')
    } catch {
      // the user closed the share sheet, or the clipboard is not available
    }
    setTimeout(() => setNotice(''), 2000)
  }

  return (
    <div className="details">
      <header className="details__bar">
        <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} strokeWidth={1.9} />
        </button>
        <h1 className="details__bar-title">Item details</h1>
        <div className="details__bar-actions">
          <button type="button" className="icon-btn" onClick={share} aria-label="Share">
            <Share size={20} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={`icon-btn${saved ? ' is-saved' : ''}`}
            onClick={() => toggle(item.id)}
            aria-label={saved ? 'Remove from saved' : 'Save'}
            aria-pressed={saved}
          >
            <Heart size={21} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      <div className="details__media">
        <ItemImage item={item} iconSize={96} className="details__image" />
        <span className="details__badge">{item.postedAgo}</span>
      </div>

      <main className="details__body">
        <p className="details__price">{formatPrice(item.price)}</p>
        <h2 className="details__title">{item.title}</h2>
        <p className="details__location">
          <MapPin size={16} strokeWidth={1.9} />
          {distance} away · {item.area}
        </p>

        <ul className="details__tags">
          <li>{item.condition}</li>
          <li>{item.size}</li>
        </ul>

        <section className="details__section">
          <h3>About this item</h3>
          <p>{item.description}</p>
        </section>

        <div className="seller">
          <span className="seller__avatar" aria-hidden="true">
            {initials(item.seller.name)}
          </span>
          <div className="seller__info">
            <p className="seller__name">{item.seller.name}</p>
            <p className="seller__since">Neighbor since {item.seller.since}</p>
          </div>
          <Link to="/you" className="seller__link">
            View profile <ChevronRight size={16} strokeWidth={2} />
          </Link>
        </div>

        <div className="pickup">
          <span className="pickup__icon">
            <MapPin size={18} strokeWidth={1.9} />
          </span>
          <div>
            <p className="pickup__title">Pickup in {item.area}</p>
            <p className="pickup__text">{distance} away · Arrange a time in chat</p>
            <p className="pickup__note">Exact address shared by the seller.</p>
          </div>
        </div>
      </main>

      <div className="details__actions">
        <button type="button" className="btn btn--outline" onClick={() => navigate('/inbox')}>
          Make offer
        </button>
        <button type="button" className="btn btn--primary" onClick={() => navigate('/inbox')}>
          Message seller
        </button>
      </div>

      {notice && (
        <p className="details__notice" role="status">
          {notice}
        </p>
      )}
    </div>
  )
}
