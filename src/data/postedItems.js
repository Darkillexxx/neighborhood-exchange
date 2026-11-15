// Items the user posted, and their unfinished draft, kept in this browser
// (localStorage) until we have a backend. Every read and write is wrapped:
// storage can be full or switched off, and the app should keep working.

import { ITEMS } from './items.js'

const ITEMS_KEY = 'nx-posted-items'
const DRAFT_KEY = 'nx-post-draft'

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

/** @returns {boolean} false when the browser refused to store it (e.g. photos too big) */
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function loadPostedItems() {
  return read(ITEMS_KEY, [])
}

/** The user's own items first (newest first), then everyone else's. */
export function getAllItems() {
  return [...loadPostedItems(), ...ITEMS]
}

export function addPostedItem(item) {
  return write(ITEMS_KEY, [item, ...loadPostedItems()])
}

export function removePostedItem(id) {
  return write(
    ITEMS_KEY,
    loadPostedItems().filter((item) => item.id !== id),
  )
}

export function loadDraft() {
  return read(DRAFT_KEY, null)
}

export function saveDraft(draft) {
  return write(DRAFT_KEY, draft)
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // nothing to clear
  }
}
