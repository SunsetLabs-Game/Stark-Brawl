import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ShopPage from "./pages/shop"
import SocialPage from "./pages/social"
import EventsPage from "./pages/events"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/events" element={<EventsPage />} />

      </Routes>
    </BrowserRouter>
  )
}

