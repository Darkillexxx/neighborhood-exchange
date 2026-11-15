import Icon from './Icon.jsx'
import searchIcon from '../assets/icons/search.svg'
import filterIcon from '../assets/icons/filter.svg'
import './SearchBar.css'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Icon src={searchIcon} />
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
        {/* A plain image, not <Icon>: the knobs are filled white, which a one-color mask would lose */}
        <img src={filterIcon} alt="" />
      </button>
    </div>
  )
}
