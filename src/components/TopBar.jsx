import Icon from './Icon.jsx'
import pinIcon from '../assets/icons/pin.svg'
import bellIcon from '../assets/icons/bell.svg'
import { CURRENT_LOCATION } from '../data/items.js'
import './TopBar.css'

export default function TopBar() {
  return (
    <header className="top-bar">
      <button type="button" className="top-bar__location" aria-label={`Location: ${CURRENT_LOCATION}`}>
        <Icon src={pinIcon} />
        <span>{CURRENT_LOCATION}</span>
      </button>
      <button type="button" className="top-bar__icon" aria-label="Notifications">
        <Icon src={bellIcon} />
      </button>
    </header>
  )
}
