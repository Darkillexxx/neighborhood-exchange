import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import ItemImage from '../components/ItemImage.jsx'
import { ITEMS, formatPrice, formatDistance } from '../data/items.js'
import './ItemDetails.css'

// First version of the item page. The full design (seller, pickup, Make offer)
// comes in the Product details step.
export default function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = ITEMS.find((i) => i.id === id)

  if (!item) {
    return (
      <main className="screen">
        <p>This item is no longer available.</p>
      </main>
    )
  }

  return (
    <main className="details">
      <button type="button" className="details__back" onClick={() => navigate(-1)} aria-label="Back">
        <ChevronLeft size={22} />
      </button>
      <ItemImage item={item} iconSize={96} className="details__image" />
      <div className="details__body">
        <p className="details__price">{formatPrice(item.price)}</p>
        <h1 className="details__title">{item.title}</h1>
        <p className="details__meta">{formatDistance(item.distanceKm)} away · {item.postedAgo}</p>
        <p className="details__text">{item.description}</p>
      </div>
    </main>
  )
}
