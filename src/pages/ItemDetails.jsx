import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CircleCheck, ChevronLeft, ChevronRight, Heart, MapPin, Share, Trash2 } from 'lucide-react'
import ItemImage from '../components/ItemImage.jsx'
import useSaved from '../useSaved.js'
import { formatPrice, formatDistance } from '../data/items.js'
import { getAllItems, removePostedItem } from '../data/postedItems.js'
import { takeFlash } from '../flash.js'
import './ItemDetails.css'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Everything below the top bar: photo, price, details, seller and pickup.
 * Also used by the Preview on the Post screen, so a draft looks exactly like
 * the posted item will.
 */
export function ItemDetailsContent({ item, children }) {
  const distance = formatDistance(item.distanceKm)
  const tags = [item.condition, item.size].filter(Boolean)

  return (
    <>
      <div className="details__media">
        <ItemImage item={item} iconSize={96} className="details__image" />
        <span className="details__badge">{item.postedAgo}</span>
      </div>

      <div className="details__body">
        <p className="details__price">{formatPrice(item.price)}</p>
        <h2 className="details__title">{item.title}</h2>
        <p className="details__location">
          <MapPin size={16} strokeWidth={1.9} />
          {item.mine ? 'Your listing' : `${distance} away`} · {item.area}
        </p>

        {tags.length > 0 && (
          <ul className="details__tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}

        {item.description && (
          <section className="details__section">
            <h3>About this item</h3>
            <p>{item.description}</p>
          </section>
        )}

        <div className="seller">
          <span className="seller__avatar" aria-hidden="true">
            {initials(item.seller.name)}
          </span>
          <div className="seller__info">
            <p className="seller__name">{item.seller.name}</p>
            <p className="seller__since">Neighbor since {item.seller.since}</p>
          </div>
          {!item.mine && (
            <Link to="/you" className="seller__link">
              View profile <ChevronRight size={16} strokeWidth={2} />
            </Link>
          )}
        </div>

        <div className="pickup">
          <span className="pickup__icon">
            <MapPin size={18} strokeWidth={1.9} />
          </span>
          <div>
            <p className="pickup__title">Pickup in {item.area}</p>
            <p className="pickup__text">
              {item.mine ? 'Near you' : `${distance} away`} · Arrange a time in chat
            </p>
            <p className="pickup__note">Exact address shared by the seller.</p>
          </div>
        </div>

        {children}
      </div>
    </>
  )
}

export default function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  // "Your item is posted" / "Changes saved", passed on by the Post form
  const [flash] = useState(takeFlash)
  const { isSaved, toggle } = useSaved()
  const [notice, setNotice] = useState('')
  const [confirming, setConfirming] = useState(false)
  const item = useMemo(() => getAllItems().find((i) => i.id === id), [id])

  if (!item) {
    return (
      <main className="screen">
        <p>This item is no longer available.</p>
        <Link to="/">Back to Home</Link>
      </main>
    )
  }

  const saved = isSaved(item.id)

  const showNotice = (text) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 2000)
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      showNotice('Link copied')
    } catch {
      // the user closed the share sheet, or the clipboard is not available
    }
  }

  // Done: back to where the user came from, e.g. Home or the profile after posting
  const done = () => {
    if (location.key === 'default') navigate('/')
    else navigate(-1)
  }

  // After deleting, the profile shows the item's name with an Undo button
  const remove = () => {
    if (removePostedItem(item.id)) navigate('/you', { replace: true, state: { deleted: item } })
    else showNotice('Could not delete the item')
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
          {!item.mine && (
            <button
              type="button"
              className={`icon-btn${saved ? ' is-saved' : ''}`}
              onClick={() => toggle(item.id)}
              aria-label={saved ? 'Remove from saved' : 'Save'}
              aria-pressed={saved}
            >
              <Heart size={21} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </header>

      <main>
        {flash && (
          <p className="details__flash" role="status">
            <CircleCheck size={20} strokeWidth={2} />
            {flash}
          </p>
        )}
        <ItemDetailsContent item={item}>
          {item.mine && (
            <button type="button" className="details__delete" onClick={() => setConfirming(true)}>
              <Trash2 size={18} strokeWidth={2} />
              Delete listing
            </button>
          )}
        </ItemDetailsContent>
      </main>

      <div className="action-bar">
        {item.mine && confirming ? (
          <>
            <button type="button" className="btn btn--outline" onClick={() => setConfirming(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn--danger" onClick={remove}>
              Delete this item
            </button>
          </>
        ) : item.mine ? (
          <>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => navigate(`/edit/${item.id}`, { state: { from: 'item' } })}
            >
              Edit
            </button>
            <button type="button" className="btn btn--primary" onClick={done}>
              Done
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn--outline" onClick={() => navigate('/inbox')}>
              Make offer
            </button>
            <button type="button" className="btn btn--primary" onClick={() => navigate('/inbox')}>
              Message seller
            </button>
          </>
        )}
      </div>

      {notice && (
        <p className="toast" role="status">
          {notice}
        </p>
      )}
    </div>
  )
}
