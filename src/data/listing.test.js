import { describe, expect, test } from 'vitest'
import { MAX_PHOTOS, cleanPrice, createListing, emptyDraft, validateListing } from './listing.js'

const filled = (changes = {}) => ({
  ...emptyDraft(),
  title: 'Linen two-seater sofa',
  price: '85',
  ...changes,
})

describe('validateListing', () => {
  test('accepts a filled form without photos or description', () => {
    expect(validateListing(filled())).toEqual({})
  })

  test('asks for a title of at least 3 characters, ignoring spaces', () => {
    expect(validateListing(filled({ title: '  ab  ' }))).toHaveProperty('title')
  })

  test('asks for a price when the item is for sale', () => {
    expect(validateListing(filled({ price: '' }))).toHaveProperty('price')
    expect(validateListing(filled({ price: '0' }))).toHaveProperty('price')
  })

  test('needs no price for an item that is given away', () => {
    expect(validateListing(filled({ mode: 'free', price: '' }))).toEqual({})
  })

  test('refuses very high prices', () => {
    expect(validateListing(filled({ price: '20000' })).price).toMatch('at most')
  })

  test('refuses more photos than allowed', () => {
    const photos = Array.from({ length: MAX_PHOTOS + 1 }, (_, i) => `photo-${i}`)
    expect(validateListing(filled({ photos }))).toHaveProperty('photos')
  })
})

describe('cleanPrice', () => {
  test('keeps digits only', () => {
    expect(cleanPrice('€ 85,50')).toBe('8550')
  })

  test('drops leading zeros', () => {
    expect(cleanPrice('0085')).toBe('85')
  })
})

describe('createListing', () => {
  const now = new Date('2026-11-15T10:00:00Z')

  test('builds an item of the user, at their location', () => {
    const item = createListing(filled({ title: '  Linen sofa ' }), { now })

    expect(item).toMatchObject({
      mine: true,
      title: 'Linen sofa',
      price: 85,
      category: 'furniture',
      distanceKm: 0,
      postedAgo: 'Just listed',
      seller: { name: 'You', since: 2026 },
    })
  })

  test('makes a readable, unique id from the title and the time', () => {
    expect(createListing(filled({ title: 'Linen sofa!' }), { now }).id).toBe(`my-linen-sofa-${now.getTime()}`)
  })

  test('a given-away item costs nothing, whatever the price field says', () => {
    expect(createListing(filled({ mode: 'free', price: '85' }), { now }).price).toBe(0)
  })

  test('the first photo becomes the cover', () => {
    const item = createListing(filled({ photos: ['cover', 'second'] }), { now })
    expect(item.image).toBe('cover')
    expect(item.photos).toEqual(['cover', 'second'])
  })

  test('without photos the item gets the placeholder of its category', () => {
    const item = createListing(filled({ category: 'appliances' }), { now })
    expect(item.image).toBeUndefined()
    expect(item.icon).toBe('WashingMachine')
  })
})
