import { useEffect, useState } from 'react'

const KEY = 'nx-saved-items'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

// Saved (hearted) items, remembered in the browser between visits.
export default function useSaved() {
  const [saved, setSaved] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved))
    } catch {
      // storage can be unavailable (private mode); saving just won't persist
    }
  }, [saved])

  const toggle = (id) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return { saved, isSaved: (id) => saved.includes(id), toggle }
}
