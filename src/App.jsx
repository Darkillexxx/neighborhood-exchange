import { Routes, Route, Navigate } from 'react-router-dom'
import { Map as MapIcon, Plus, MessageSquare, UserRound } from 'lucide-react'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route
          path="/nearby"
          element={<Placeholder icon={MapIcon} title="Nearby" text="A map of items around you is coming in the next step." />}
        />
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
      <BottomNav />
    </div>
  )
}
