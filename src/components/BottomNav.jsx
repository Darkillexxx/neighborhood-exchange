import { NavLink } from 'react-router-dom'
import Icon from './Icon.jsx'
import homeIcon from '../assets/icons/home.svg'
import mapIcon from '../assets/icons/map.svg'
import plusIcon from '../assets/icons/plus.svg'
import messageIcon from '../assets/icons/message.svg'
import userIcon from '../assets/icons/user.svg'
import './BottomNav.css'

const TABS = [
  { to: '/', label: 'Home', icon: homeIcon, end: true },
  { to: '/nearby', label: 'Nearby', icon: mapIcon },
  { to: '/post', label: 'Post', icon: plusIcon, primary: true },
  { to: '/inbox', label: 'Inbox', icon: messageIcon },
  { to: '/you', label: 'You', icon: userIcon },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map(({ to, label, icon, end, primary }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            ['bottom-nav__tab', primary && 'bottom-nav__tab--primary', isActive && 'is-active']
              .filter(Boolean)
              .join(' ')
          }
        >
          <span className="bottom-nav__icon">
            <Icon src={icon} />
          </span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
