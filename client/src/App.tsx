import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import ShopPage from "./pages/shop"
import SocialPage from "./pages/social"
import EventsPage from "./pages/events"
import HomePage from "./pages/home"
import LeaderboardPage from "./pages/Leaderboard"


import HomePage from "@/pages/home"
import ShopPage from "@/pages/shop"
import SocialPage from "@/pages/social"
import EventsPage from "@/pages/events"
import Brawlers from "@/pages/brawlers"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

       

        <Route path="/brawlers" element={<Brawlers />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
