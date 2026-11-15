import { existsSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { ITEMS, filterItems, formatPrice } from './items.js'

const SOFA = { id: 'sofa', title: 'Linen two-seater sofa', price: 85, category: 'furniture' }
const SIDEBOARD = { id: 'sideboard', title: 'Vintage oak sideboard', price: 0, category: 'furniture' }
const WASHER = { id: 'washer', title: 'Front-load washer', price: 120, category: 'appliances' }
const MICROWAVE = { id: 'microwave', title: 'Microwave', price: 0, category: 'appliances' }
const ALL = [SOFA, SIDEBOARD, WASHER, MICROWAVE]

describe('filterItems', () => {
  test('returns every item for the "all" category and an empty search', () => {
    expect(filterItems(ALL, { query: '', category: 'all' })).toEqual(ALL)
  })

  test('keeps only the items of the chosen category', () => {
    expect(filterItems(ALL, { query: '', category: 'appliances' })).toEqual([WASHER, MICROWAVE])
  })

  test('treats "free" as a price filter across categories', () => {
    expect(filterItems(ALL, { query: '', category: 'free' })).toEqual([SIDEBOARD, MICROWAVE])
  })

  test('ignores letter case and spaces around the search text', () => {
    expect(filterItems(ALL, { query: '  SOFA ', category: 'all' })).toEqual([SOFA])
  })

  test('applies the category and the search text together', () => {
    expect(filterItems(ALL, { query: 'wa', category: 'free' })).toEqual([MICROWAVE])
  })

  test('returns an empty list when nothing matches', () => {
    expect(filterItems(ALL, { query: 'piano', category: 'all' })).toEqual([])
  })
})

describe('formatPrice', () => {
  test('shows "Free" for a price of zero', () => {
    expect(formatPrice(0)).toBe('Free')
  })

  test('shows the price in euros', () => {
    expect(formatPrice(85)).toBe('€85')
  })
})

describe('ITEMS', () => {
  test('every photo path points to a file in public/', () => {
    const missing = ITEMS.filter((item) => item.image && !existsSync(`public${item.image}`))

    expect(missing.map((item) => item.image)).toEqual([])
  })
})
