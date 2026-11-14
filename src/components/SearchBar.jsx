import { Search, SlidersHorizontal } from 'lucide-react'
import './SearchBar.css'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={18} strokeWidth={1.9} className="search-bar__icon" aria-hidden="true" />
      <input
        id="search"
        type="search"
        className="search-bar__input"
        placeholder="What are you looking for?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search items"
      />
      <button type="button" className="search-bar__filter" aria-label="Filters (coming soon)" title="Filters coming soon">
        <SlidersHorizontal size={18} strokeWidth={1.9} />
      </button>
    </div>
  )
}
