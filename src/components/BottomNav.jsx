import { NavLink } from 'react-router-dom'
import { House, Map as MapIcon, Plus, MessageSquare, UserRound } from 'lucide-react'
import './BottomNav.css'

const TABS = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/nearby', label: 'Nearby', icon: MapIcon },
  { to: '/post', label: 'Post', icon: Plus, primary: true },
  { to: '/inbox', label: 'Inbox', icon: MessageSquare },
  { to: '/you', label: 'You', icon: UserRound },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map(({ to, label, icon: Icon, end, primary }) => (
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
            <Icon size={primary ? 24 : 21} strokeWidth={primary ? 2.25 : 1.75} />
          </span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
