import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LocateFixed } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import CategoryChips from '../components/CategoryChips.jsx'
import RadiusControl from '../components/RadiusControl.jsx'
import ItemImage from '../components/ItemImage.jsx'
import { CATEGORIES, ITEMS, filterItems, formatPrice } from '../data/items.js'
import { RADIUS_DEFAULT, formatRadius, isWithinRadius, itemOffset, pinLabel } from '../data/map.js'
import './Nearby.css'

// Map scale: screen pixels per meter. The map stays put; the slider grows the circle.
const PX_PER_M = 0.16

// The drawn city, in meters: square blocks with streets between them.
// A street crossing sits right under the user.
const BLOCK = 520
const STREET = 70
const PERIOD = BLOCK + STREET
const WORLD = 20000 // drawn area around the user, in meters; bigger than any screen
const PARKS = [
  { col: 1, row: -1 },
  { col: -2, row: 0 },
]

function blockRect({ col, row }) {
  return { x: col * PERIOD + STREET / 2, y: row * PERIOD + STREET / 2 }
}

export default function Nearby() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [radius, setRadius] = useState(RADIUS_DEFAULT)

  const scale = PX_PER_M
  const circle = radius * scale
  const items = filterItems(ITEMS, { query, category })
  const inRadius = items.filter((item) => isWithinRadius(item, radius))

  // Lower pins are drawn on top, so overlapping pins read like a stack
  const pins = items
    .map((item) => ({ item, offset: itemOffset(item), near: isWithinRadius(item, radius) }))
    .sort((a, b) => a.offset.y - b.offset.y)

  return (
    <main className="nearby">
      <div className="screen nearby__head">
        <TopBar />
        <SearchBar value={query} onChange={setQuery} />
        <CategoryChips categories={CATEGORIES} active={category} onChange={setCategory} />
      </div>

      <div className="nearby__map-area">
        <section className="map" aria-label="Map of items near you">
          {/* Streets and blocks, drawn in meters and scaled to pixels with one CSS transform */}
          <div className="map__world" style={{ transform: `scale(${scale})` }} aria-hidden="true">
            <svg
              width={WORLD}
              height={WORLD}
              viewBox={`${-WORLD / 2} ${-WORLD / 2} ${WORLD} ${WORLD}`}
              style={{ left: -WORLD / 2, top: -WORLD / 2 }}
            >
              <defs>
                <pattern
                  id="blocks"
                  width={PERIOD}
                  height={PERIOD}
                  x={STREET / 2}
                  y={STREET / 2}
                  patternUnits="userSpaceOnUse"
                >
                  <rect width={BLOCK} height={BLOCK} rx="40" fill="var(--map-block)" />
                </pattern>
              </defs>
              <rect x={-WORLD / 2} y={-WORLD / 2} width={WORLD} height={WORLD} fill="var(--map-street)" />
              <rect x={-WORLD / 2} y={-WORLD / 2} width={WORLD} height={WORLD} fill="url(#blocks)" />
              {PARKS.map((park) => {
                const { x, y } = blockRect(park)
                return (
                  <rect key={`${park.col},${park.row}`} x={x} y={y} width={BLOCK} height={BLOCK} rx="40" fill="var(--map-park)" />
                )
              })}
            </svg>
          </div>

          <span className="map__street-label" aria-hidden="true">
            Bundesallee
          </span>

          <div className="map__circle" style={{ width: circle * 2, height: circle * 2 }} aria-hidden="true" />
          <span className="map__me" aria-label="You are here" role="img" />

          {pins.map(({ item, offset, near }) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className={`map-pin${near ? '' : ' map-pin--far'}`}
              style={{ transform: `translate(${offset.x * scale}px, ${offset.y * scale}px)` }}
              aria-label={`${item.title}, ${formatPrice(item.price)}`}
            >
              <span className="map-pin__body">
                <ItemImage item={item} iconSize={18} className="map-pin__photo" />
                <span className="map-pin__price">{pinLabel(item)}</span>
              </span>
            </Link>
          ))}

          {items.length === 0 ? (
            <p className="map__empty">No items match your search.</p>
          ) : (
            inRadius.length === 0 && (
              <p className="map__empty">Nothing within {formatRadius(radius)}. Try a bigger radius.</p>
            )
          )}

          <button
            type="button"
            className="map__locate"
            onClick={() => setRadius(RADIUS_DEFAULT)}
            aria-label={`Back to ${formatRadius(RADIUS_DEFAULT)} around me`}
          >
            <LocateFixed size={22} strokeWidth={1.8} />
          </button>
        </section>

        <div className="nearby__radius">
          <RadiusControl value={radius} onChange={setRadius} />
        </div>

        <p className="visually-hidden" aria-live="polite">
          {inRadius.length} {inRadius.length === 1 ? 'item' : 'items'} within {formatRadius(radius)}
        </p>
      </div>
    </main>
  )
}
