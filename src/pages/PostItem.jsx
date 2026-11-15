import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Camera, ChevronDown, ChevronRight, MapPin, MapPinOff, X } from 'lucide-react'
import { ItemDetailsContent } from './ItemDetails.jsx'
import { CURRENT_LOCATION } from '../data/items.js'
import {
  CONDITIONS,
  DESCRIPTION_MAX,
  MAX_PHOTOS,
  POST_CATEGORIES,
  TITLE_MAX,
  applyDraft,
  cleanPrice,
  createListing,
  draftFromItem,
  emptyDraft,
  validateListing,
} from '../data/listing.js'
import {
  addPostedItem,
  clearDraft,
  loadDraft,
  loadPostedItems,
  saveDraft,
  updatePostedItem,
} from '../data/postedItems.js'
import { fileToPhoto } from '../data/photos.js'
import { setFlash } from '../flash.js'
import './PostItem.css'

// Fields in the order they appear, to focus the first one with an error
const FIELD_ORDER = ['photos', 'title', 'price']

// /post creates a new item; /edit/:id opens one of the user's items in the same form
export default function PostItem() {
  const { id: editId } = useParams()
  const [editing] = useState(() => (editId ? loadPostedItems().find((item) => item.id === editId) : null))

  if (editId && !editing) {
    return (
      <main className="screen">
        <p>This item no longer exists.</p>
        <Link to="/you">Back to your profile</Link>
      </main>
    )
  }

  return <PostForm editing={editing} />
}

function PostForm({ editing }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [draft, setDraft] = useState(() =>
    editing ? draftFromItem(editing) : { ...emptyDraft(), ...loadDraft() },
  )
  const [errors, setErrors] = useState({})
  const [addingPhotos, setAddingPhotos] = useState(false)
  const [preview, setPreview] = useState(false)
  const [notice, setNotice] = useState('')
  const fileInput = useRef(null)

  const update = (changes) => {
    setDraft((d) => ({ ...d, ...changes }))
    // a field the user is fixing loses its error right away
    setErrors((e) => {
      const next = { ...e }
      Object.keys(changes).forEach((key) => delete next[key])
      if ('mode' in changes) delete next.price
      return next
    })
  }

  const showNotice = (text) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 2500)
  }

  const close = () => {
    // opened from a link straight to /post: there is no page to go back to
    if (location.key === 'default') navigate('/')
    else navigate(-1)
  }

  const addPhotos = async (files) => {
    const room = MAX_PHOTOS - draft.photos.length
    const picked = Array.from(files).slice(0, room)
    if (picked.length === 0) return
    setAddingPhotos(true)
    try {
      const photos = await Promise.all(picked.map(fileToPhoto))
      update({ photos: [...draft.photos, ...photos] })
      if (files.length > room) showNotice(`Only ${MAX_PHOTOS} photos fit, the rest were skipped`)
    } catch {
      showNotice('One of the photos could not be read')
    } finally {
      setAddingPhotos(false)
    }
  }

  const removePhoto = (index) => update({ photos: draft.photos.filter((_, i) => i !== index) })

  const onSaveDraft = () => {
    showNotice(saveDraft(draft) ? 'Draft saved' : 'Could not save: the photos take too much space')
  }

  const check = () => {
    const found = validateListing(draft)
    setErrors(found)
    const first = FIELD_ORDER.find((field) => found[field])
    if (first) document.getElementById(`post-${first}`)?.focus()
    return !first
  }

  const onPreview = () => {
    if (check()) setPreview(true)
  }

  const onPost = () => {
    if (!check()) {
      setPreview(false)
      return
    }
    if (editing) {
      const item = applyDraft(editing, draft)
      if (!updatePostedItem(item)) {
        showNotice('Could not save: the photos take too much space. Try fewer photos.')
        return
      }
      setFlash('Changes saved.')
      // opened from the item page: go back to it; opened from the profile: show the item
      if (location.state?.from === 'item') navigate(-1)
      else navigate(`/item/${item.id}`, { replace: true })
      return
    }
    const item = createListing(draft)
    if (!addPostedItem(item)) {
      showNotice('Could not post: the photos take too much space. Try fewer photos.')
      return
    }
    clearDraft()
    setFlash('Your item is posted. Neighbors nearby can see it now.')
    navigate(`/item/${item.id}`, { replace: true })
  }

  const submitLabel = editing ? 'Save changes' : 'Post item'

  if (preview) {
    return (
      <div className="post-preview">
        <header className="post__bar">
          <button type="button" className="icon-btn" onClick={() => setPreview(false)} aria-label="Back to editing">
            <X size={24} strokeWidth={1.9} />
          </button>
          <h1 className="post__bar-title post__bar-title--small">Preview</h1>
          <span />
        </header>
        <p className="post-preview__hint">This is how neighbors will see your item.</p>
        <main>
          <ItemDetailsContent item={editing ? applyDraft(editing, draft) : createListing(draft, { id: 'preview' })} />
        </main>
        <div className="action-bar">
          <button type="button" className="btn btn--outline post__secondary" onClick={() => setPreview(false)}>
            Edit
          </button>
          <button type="button" className="btn btn--primary" onClick={onPost}>
            {submitLabel}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="post">
      <header className="post__bar">
        <button type="button" className="icon-btn" onClick={close} aria-label="Close">
          <X size={24} strokeWidth={1.9} />
        </button>
        <h1 className="post__bar-title">{editing ? 'Edit item' : 'Post an item'}</h1>
        {editing ? (
          <span />
        ) : (
          <button type="button" className="post__draft" onClick={onSaveDraft}>
            Save draft
          </button>
        )}
      </header>

      <form
        className="post__form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          onPost()
        }}
      >
        {/* Photos */}
        <div className="field">
          <div className="field__head">
            <span className="field__label" id="photos-label">
              Photos
            </span>
            <span className="field__count">
              {draft.photos.length} of {MAX_PHOTOS}
            </span>
          </div>
          <div className="photos" role="group" aria-labelledby="photos-label">
            {draft.photos.map((src, index) => (
              <div className="photos__item" key={src.slice(-32) + index}>
                <img src={src} alt={index === 0 ? 'Cover photo' : `Photo ${index + 1}`} />
                {index === 0 && <span className="photos__cover">Cover</span>}
                <button
                  type="button"
                  className="photos__remove"
                  onClick={() => removePhoto(index)}
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            {draft.photos.length < MAX_PHOTOS && (
              <button
                type="button"
                id="post-photos"
                className="photos__add"
                onClick={() => fileInput.current?.click()}
                disabled={addingPhotos}
              >
                <Camera size={22} strokeWidth={1.9} />
                {addingPhotos ? 'Adding…' : 'Add photos'}
              </button>
            )}
            {draft.photos.length < 2 && <p className="photos__hint">A clear photo helps your item find its next home.</p>}
          </div>
          <input
            ref={fileInput}
            id="post-photo-files"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              addPhotos(e.target.files)
              e.target.value = '' // lets the same photo be picked again after removing it
            }}
          />
          {errors.photos && <p className="field__error">{errors.photos}</p>}
        </div>

        {/* Title */}
        <div className="field">
          <label className="field__label" htmlFor="post-title">
            Item title
          </label>
          <input
            id="post-title"
            className={`input${errors.title ? ' input--error' : ''}`}
            value={draft.title}
            maxLength={TITLE_MAX}
            placeholder="e.g. Linen two-seater sofa"
            onChange={(e) => update({ title: e.target.value })}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'post-title-error' : undefined}
          />
          {errors.title && (
            <p className="field__error" id="post-title-error">
              {errors.title}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="field">
          <label className="field__label" htmlFor="post-category">
            Category
          </label>
          <div className="select">
            <select id="post-category" value={draft.category} onChange={(e) => update({ category: e.target.value })}>
              {POST_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>

        {/* Condition */}
        <div className="field field--tight">
          <label className="field__label" htmlFor="post-condition">
            Condition
          </label>
          <div className="select">
            <select id="post-condition" value={draft.condition} onChange={(e) => update({ condition: e.target.value })}>
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>

        {/* For sale / Give away */}
        <div className="segmented" role="group" aria-label="Sell or give away">
          <button
            type="button"
            className={draft.mode === 'sale' ? 'is-active' : ''}
            aria-pressed={draft.mode === 'sale'}
            onClick={() => update({ mode: 'sale' })}
          >
            For sale
          </button>
          <button
            type="button"
            className={draft.mode === 'free' ? 'is-active' : ''}
            aria-pressed={draft.mode === 'free'}
            onClick={() => update({ mode: 'free' })}
          >
            Give away
          </button>
        </div>

        {/* Price */}
        {draft.mode === 'sale' && (
          <div className="field">
            <label className={`price${errors.price ? ' input--error' : ''}`} htmlFor="post-price">
              <span className="price__label">Price</span>
              <span className={`price__value${draft.price ? '' : ' price__value--empty'}`}>
                €
                <input
                  id="post-price"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={draft.price}
                  onChange={(e) => update({ price: cleanPrice(e.target.value) })}
                  style={{ width: `${Math.max(1, draft.price.length)}ch` }}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? 'post-price-error' : undefined}
                />
              </span>
            </label>
            {errors.price && (
              <p className="field__error" id="post-price-error">
                {errors.price}
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="field">
          <label className="field__label" htmlFor="post-description">
            Description
          </label>
          <textarea
            id="post-description"
            className="input input--area"
            rows={4}
            maxLength={DESCRIPTION_MAX}
            value={draft.description}
            placeholder="Size, how old it is, anything a neighbor should know before pickup."
            onChange={(e) => update({ description: e.target.value })}
          />
        </div>

        {/* Pickup location */}
        <div className="field">
          <span className="field__label" id="pickup-label">
            Pickup location
          </span>
          <button
            type="button"
            className="pickup-row"
            aria-describedby="pickup-label"
            onClick={() => showNotice('Choosing another pickup place comes in a later version')}
          >
            <MapPin size={20} strokeWidth={1.9} />
            <span>{CURRENT_LOCATION}</span>
            <ChevronRight size={20} strokeWidth={2} />
          </button>
          <p className="field__hint">
            <MapPinOff size={14} strokeWidth={1.9} />
            Only your approximate location is shown.
          </p>
        </div>

        <div className="action-bar">
          <button type="button" className="btn btn--outline post__secondary" onClick={onPreview}>
            Preview
          </button>
          <button type="submit" className="btn btn--primary">
            {submitLabel}
          </button>
        </div>
      </form>

      {notice && (
        <p className="toast" role="status">
          {notice}
        </p>
      )}
    </div>
  )
}
