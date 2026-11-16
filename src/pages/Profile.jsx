import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import ItemImage from '../components/ItemImage.jsx'
import useSaved from '../useSaved.js'
import { CURRENT_LOCATION, formatDistance, formatPrice } from '../data/items.js'
import { addPostedItem, getAllItems, loadPostedItems, removePostedItem } from '../data/postedItems.js'
import './Profile.css'

function Price({ item }) {
  return <span className={item.price === 0 ? 'row__price row__price--free' : 'row__price'}>{formatPrice(item.price)}</span>
}

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { saved, toggle } = useSaved()
  const [mine, setMine] = useState(loadPostedItems)
  const [confirmId, setConfirmId] = useState(null)
  // set when an item was just deleted (here or on its item page), for "Undo"
  const [deleted, setDeleted] = useState(() => location.state?.deleted ?? null)
  const [notice, setNotice] = useState('')
  const timer = useRef(null)

  const savedItems = getAllItems().filter((item) => !item.mine && saved.includes(item.id))

  // The Undo message disappears after a few seconds
  useEffect(() => {
    if (!deleted) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDeleted(null), 5000)
    return () => clearTimeout(timer.current)
  }, [deleted])

  // Forget the deleted item in the browser history, so Back does not show Undo again
  useEffect(() => {
    if (location.state?.deleted) navigate('.', { replace: true, state: null })
  }, [location.state, navigate])

  const remove = (item) => {
    setConfirmId(null)
    if (!removePostedItem(item.id)) {
      setNotice('Could not delete the item')
      return
    }
    setMine(loadPostedItems())
    setDeleted(item)
  }

  const undo = () => {
    if (addPostedItem(deleted)) setMine(loadPostedItems())
    setDeleted(null)
  }

  return (
    <main className="screen profile">
      <h1 className="profile__title">Profile</h1>

      <section className="profile__card" aria-label="You">
        <span className="profile__avatar" aria-hidden="true">
          Y
        </span>
        <div className="profile__who">
          <p className="profile__name">You</p>
          <p className="profile__place">
            <MapPin size={14} strokeWidth={2} />
            {CURRENT_LOCATION}
          </p>
        </div>
        <dl className="profile__stats">
          <div>
            <dt>Listed</dt>
            <dd>{mine.length}</dd>
          </div>
          <div>
            <dt>Saved</dt>
            <dd>{savedItems.length}</dd>
          </div>
        </dl>
      </section>

      <section className="profile__section">
        <div className="profile__section-head">
          <h2>My listings</h2>
          {mine.length > 0 && (
            <Link to="/post" className="profile__add">
              <Plus size={16} strokeWidth={2.4} /> Post
            </Link>
          )}
        </div>

        {mine.length === 0 ? (
          <div className="profile__empty">
            <p>You have not posted anything yet. Something you no longer need could make a neighbor happy.</p>
            <Link to="/post" className="btn btn--primary profile__empty-btn">
              Post an item
            </Link>
          </div>
        ) : (
          <ul className="rows">
            {mine.map((item) => (
              <li key={item.id} className={`row${confirmId === item.id ? ' is-confirming' : ''}`}>
                <div className="row__top">
                  <Link to={`/item/${item.id}`} className="row__main">
                    <ItemImage item={item} iconSize={24} className="row__photo" />
                    <span className="row__text">
                      <span className="row__title">{item.title}</span>
                      <Price item={item} />
                      <span className="row__meta">{item.postedAgo}</span>
                    </span>
                  </Link>
                  <div className="row__actions">
                    <Link to={`/edit/${item.id}`} className="row__btn" aria-label={`Edit ${item.title}`}>
                      <Pencil size={18} strokeWidth={1.9} />
                    </Link>
                    <button
                      type="button"
                      className="row__btn row__btn--danger"
                      aria-label={`Delete ${item.title}`}
                      aria-expanded={confirmId === item.id}
                      onClick={() => setConfirmId(confirmId === item.id ? null : item.id)}
                    >
                      <Trash2 size={18} strokeWidth={1.9} />
                    </button>
                  </div>
                </div>

                {confirmId === item.id && (
                  <div className="row__confirm" role="group" aria-label={`Delete ${item.title}?`}>
                    <span>Delete this item?</span>
                    <button type="button" className="row__confirm-cancel" onClick={() => setConfirmId(null)}>
                      Cancel
                    </button>
                    <button type="button" className="row__confirm-delete" onClick={() => remove(item)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile__section">
        <div className="profile__section-head">
          <h2>Saved</h2>
        </div>

        {savedItems.length === 0 ? (
          <p className="profile__hint">Tap the heart on an item to keep it here.</p>
        ) : (
          <ul className="rows">
            {savedItems.map((item) => (
              <li key={item.id} className="row">
                <div className="row__top">
                  <Link to={`/item/${item.id}`} className="row__main">
                    <ItemImage item={item} iconSize={24} className="row__photo" />
                    <span className="row__text">
                      <span className="row__title">{item.title}</span>
                      <Price item={item} />
                      <span className="row__meta">
                        {formatDistance(item.distanceKm)} · {item.area}
                      </span>
                    </span>
                  </Link>
                  <div className="row__actions">
                    <button
                      type="button"
                      className="row__btn row__btn--saved"
                      aria-label={`Remove ${item.title} from saved`}
                      onClick={() => toggle(item.id)}
                    >
                      <Heart size={18} strokeWidth={1.9} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {deleted && (
        <div className="toast toast--action" role="status">
          <span>“{deleted.title}” deleted</span>
          <button type="button" onClick={undo}>
            Undo
          </button>
        </div>
      )}
      {notice && (
        <p className="toast" role="status">
          {notice}
        </p>
      )}
    </main>
  )
}
