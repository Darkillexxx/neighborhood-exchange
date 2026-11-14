import { MapPin, Bell } from 'lucide-react'
import { CURRENT_LOCATION } from '../data/items.js'
import './TopBar.css'

export default function TopBar() {
  return (
    <header className="top-bar">
      <button type="button" className="top-bar__location" aria-label={`Location: ${CURRENT_LOCATION}`}>
        <MapPin size={18} strokeWidth={1.9} />
        <span>{CURRENT_LOCATION}</span>
      </button>
      <button type="button" className="top-bar__icon" aria-label="Notifications">
        <Bell size={20} strokeWidth={1.75} />
      </button>
    </header>
  )
}
