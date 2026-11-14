import './CategoryChips.css'

export default function CategoryChips({ categories, active, onChange }) {
  return (
    <div className="chips" role="tablist" aria-label="Categories">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          role="tab"
          aria-selected={active === c.id}
          className={`chip${active === c.id ? ' is-active' : ''}`}
          onClick={() => onChange(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
