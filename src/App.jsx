import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Nearby from './pages/Nearby.jsx'
import PostItem from './pages/PostItem.jsx'
import Profile from './pages/Profile.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  // The item page and the Post/Edit form have their own action bar instead of the bottom navigation
  const { pathname } = useLocation()
  const showNav = !pathname.startsWith('/item/') && !pathname.startsWith('/edit/') && pathname !== '/post'
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
        <Route path="/post" element={<PostItem />} />
        <Route path="/edit/:id" element={<PostItem />} />
        <Route
          path="/inbox"
          element={<Placeholder icon={MessageSquare} title="Inbox" text="Chats with buyers and sellers will appear here." />}
        />
        <Route path="/you" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  )
}
