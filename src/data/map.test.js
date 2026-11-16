import { describe, expect, test } from 'vitest'
import {
  RADIUS_MAX,
  RADIUS_MIN,
  clampRadius,
  formatRadius,
  isWithinRadius,
  itemOffset,
  pinLabel,
} from './map.js'

describe('clampRadius', () => {
  test('rounds to the nearest 100 m', () => {
    expect(clampRadius(840)).toBe(800)
    expect(clampRadius(850)).toBe(900)
  })

  test('stays inside the slider range', () => {
    expect(clampRadius(0)).toBe(RADIUS_MIN)
    expect(clampRadius(5000)).toBe(RADIUS_MAX)
  })
})

describe('formatRadius', () => {
  test('shows meters below one kilometer', () => {
    expect(formatRadius(800)).toBe('800 m')
  })

  test('shows kilometers from one kilometer on, without a trailing ".0"', () => {
    expect(formatRadius(1000)).toBe('1 km')
    expect(formatRadius(1200)).toBe('1.2 km')
    expect(formatRadius(2000)).toBe('2 km')
  })
})

describe('isWithinRadius', () => {
  const sofa = { distanceKm: 0.4 }

  test('includes an item exactly on the edge', () => {
    expect(isWithinRadius(sofa, 400)).toBe(true)
  })

  test('leaves out an item further away', () => {
    expect(isWithinRadius(sofa, 300)).toBe(false)
  })
})

describe('itemOffset', () => {
  test('north is straight up', () => {
    expect(itemOffset({ distanceKm: 0.5, bearing: 0 })).toEqual({ x: 0, y: -500 })
  })

  test('east is to the right', () => {
    expect(itemOffset({ distanceKm: 0.5, bearing: 90 })).toEqual({ x: 500, y: 0 })
  })

  test('south-west is down and to the left', () => {
    const { x, y } = itemOffset({ distanceKm: 1, bearing: 225 })
    expect(x).toBe(-707)
    expect(y).toBe(707)
  })

  test('an item without a bearing is treated as straight north', () => {
    expect(itemOffset({ distanceKm: 0.2 })).toEqual({ x: 0, y: -200 })
  })
})

describe('pinLabel', () => {
  test('free items read FREE, like in the design', () => {
    expect(pinLabel({ price: 0 })).toBe('FREE')
  })

  test('other items show the price in euros', () => {
    expect(pinLabel({ price: 45 })).toBe('€45')
  })
})
