import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import CategoryChips from '../components/CategoryChips.jsx'
import ItemCard from '../components/ItemCard.jsx'
import useSaved from '../useSaved.js'
import { CATEGORIES, ITEMS } from '../data/items.js'
import './Home.css'

function matchesCategory(item, category) {
  if (category === 'all') return true
  if (category === 'free') return item.price === 0
  return item.category === category
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const { isSaved, toggle } = useSaved()

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ITEMS.filter(
      (item) => matchesCategory(item, category) && (!q || item.title.toLowerCase().includes(q)),
    )
  }, [query, category])

  return (
    <main className="screen home">
      <TopBar />
      <SearchBar value={query} onChange={setQuery} />
      <CategoryChips categories={CATEGORIES} active={category} onChange={setCategory} />

      <div className="home__section-head">
        <h2>Fresh in your neighborhood</h2>
        <Link to="/nearby">See all</Link>
      </div>

      {items.length > 0 ? (
        <div className="home__grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} saved={isSaved(item.id)} onToggleSave={toggle} />
          ))}
        </div>
      ) : (
        <div className="home__empty">
          <p className="home__empty-title">Nothing found nearby</p>
          <p>Try another word or category.</p>
        </div>
      )}
    </main>
  )
}
