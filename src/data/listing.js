// Rules for the "Post an item" form, kept apart from the screen so they can be tested.

export const MAX_PHOTOS = 8
export const TITLE_MAX = 60
export const DESCRIPTION_MAX = 500
export const PRICE_MAX = 10000

export const POST_CATEGORIES = [
  { id: 'furniture', label: 'Furniture', icon: 'Sofa', tint: '#dfe7dc' },
  { id: 'appliances', label: 'Appliances', icon: 'WashingMachine', tint: '#e1e6e8' },
  { id: 'other', label: 'Other', icon: 'PackageOpen', tint: '#ece3d6' },
]

export const CONDITIONS = ['Like new', 'Good condition', 'Used']

/** A new, empty form. `mode` is "sale" or "free" (Give away). */
export function emptyDraft() {
  return {
    photos: [],
    title: '',
    category: 'furniture',
    condition: 'Good condition',
    mode: 'sale',
    price: '',
    description: '',
  }
}

/**
 * What is wrong with the form, field by field. An empty object means it can be posted.
 * Photos and the description are optional.
 * @returns {{ title?: string, price?: string, photos?: string }}
 */
export function validateListing(draft) {
  const errors = {}

  if (draft.title.trim().length < 3) {
    errors.title = 'Add a title of at least 3 characters.'
  }

  if (draft.mode === 'sale') {
    const price = Number(draft.price)
    if (draft.price === '' || !Number.isInteger(price) || price < 1) {
      errors.price = 'Enter a price in euros, or choose Give away.'
    } else if (price > PRICE_MAX) {
      errors.price = `The price can be at most €${PRICE_MAX}.`
    }
  }

  if (draft.photos.length > MAX_PHOTOS) {
    errors.photos = `You can add up to ${MAX_PHOTOS} photos.`
  }

  return errors
}

/** Keeps only digits, so the price field never holds letters or decimals. */
export function cleanPrice(text) {
  return text.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 5)
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

/**
 * Turns a valid form into an item shaped like the ones in data/items.js.
 * The item belongs to the user (`mine: true`) and sits at their location.
 * @param {ReturnType<typeof emptyDraft>} draft
 * @param {{ now?: Date, id?: string }} [options]
 */
export function createListing(draft, { now = new Date(), id } = {}) {
  const category = POST_CATEGORIES.find((c) => c.id === draft.category) ?? POST_CATEGORIES[2]
  const title = draft.title.trim()

  return {
    id: id ?? `my-${slugify(title) || 'item'}-${now.getTime()}`,
    mine: true,
    area: 'Schöneberg',
    title,
    price: draft.mode === 'free' ? 0 : Number(draft.price),
    category: category.id,
    distanceKm: 0,
    bearing: 0,
    postedAgo: 'Just listed',
    postedAt: now.toISOString(),
    condition: draft.condition,
    description: draft.description.trim(),
    seller: { name: 'You', since: now.getFullYear() },
    image: draft.photos[0],
    photos: draft.photos,
    icon: category.icon,
    tint: category.tint,
  }
}

/** Fills the form with an item the user posted earlier, to edit it. */
export function draftFromItem(item) {
  return {
    photos: item.photos ?? (item.image ? [item.image] : []),
    title: item.title,
    category: item.category,
    condition: item.condition,
    mode: item.price === 0 ? 'free' : 'sale',
    price: item.price === 0 ? '' : String(item.price),
    description: item.description ?? '',
  }
}

/**
 * The item after the user edited it: new fields from the form, but the same
 * id, posting time, seller and place, so links and saved hearts keep working.
 */
export function applyDraft(item, draft) {
  const changed = createListing(draft, { id: item.id, now: new Date(item.postedAt) })
  return { ...changed, seller: item.seller, area: item.area, editedAt: new Date().toISOString() }
}

/**
 * "Just listed", "3 hours ago", "Yesterday" or "4 days ago" for a posting time.
 * @param {string} postedAt ISO date
 * @param {Date} [now]
 */
export function formatPostedAgo(postedAt, now = new Date()) {
  const minutes = Math.floor((now - new Date(postedAt)) / 60000)
  if (Number.isNaN(minutes) || minutes < 60) return 'Just listed'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}
