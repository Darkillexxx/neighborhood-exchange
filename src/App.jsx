import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Plus, MessageSquare, UserRound } from 'lucide-react'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Nearby from './pages/Nearby.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  // The item page has its own action bar, so the bottom navigation is hidden there
  const { pathname } = useLocation()
  const showNav = !pathname.startsWith('/item/')
  // Nearby is a full-screen map: the page itself must not scroll
  const isMap = pathname === '/nearby'

  // Start every screen at the top, like a native app
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={['app', showNav && 'app--with-nav', isMap && 'app--map'].filter(Boolean).join(' ')}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route
          path="/post"
          element={<Placeholder icon={Plus} title="Post an item" text="The form for listing an item is coming soon." />}
        />
        <Route
          path="/inbox"
          element={<Placeholder icon={MessageSquare} title="Inbox" text="Chats with buyers and sellers will appear here." />}
        />
        <Route
          path="/you"
          element={<Placeholder icon={UserRound} title="You" text="Your profile, listings and saved items will live here." />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  )
}
