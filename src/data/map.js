// Logic behind the Nearby map, kept apart from the screen so it can be tested.
//
// The map is a drawing, not a real city map: every item has a distance and a
// direction (`bearing`, degrees clockwise from north) from the user, and the
// screen turns those into a position around the user's dot.

export const RADIUS_MIN = 100
export const RADIUS_MAX = 2000
export const RADIUS_STEP = 100
export const RADIUS_DEFAULT = 800

/** Keeps a radius in meters inside the slider range and on a 100 m step. */
export function clampRadius(meters) {
  const stepped = Math.round(meters / RADIUS_STEP) * RADIUS_STEP
  return Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, stepped))
}

/** "800 m" below one kilometer, "1.2 km" from there on. */
export function formatRadius(meters) {
  if (meters < 1000) return `${meters} m`
  return `${Number((meters / 1000).toFixed(1))} km`
}

/** True when the item is at most `radius` meters away. */
export function isWithinRadius(item, radius) {
  return item.distanceKm * 1000 <= radius
}

/**
 * Where the item sits relative to the user, in meters.
 * x grows to the east (right), y grows to the south (down), like screen pixels.
 * @returns {{ x: number, y: number }}
 */
export function itemOffset(item) {
  const meters = item.distanceKm * 1000
  const angle = ((item.bearing ?? 0) * Math.PI) / 180
  // `|| 0` turns -0 (e.g. straight east) into a plain 0
  return {
    x: Math.round(meters * Math.sin(angle)) || 0,
    y: Math.round(-meters * Math.cos(angle)) || 0,
  }
}

/** Short price for a map pin: "FREE" or "€85". */
export function pinLabel(item) {
  return item.price === 0 ? 'FREE' : `€${item.price}`
}
