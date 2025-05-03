import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Brawlers from "@/pages/brawlers";
import Maps from "./pages/maps";
import LeaderboardPage from "./pages/Leaderboard";
import HomePage from "@/pages/home";
import ShopPage from "@/pages/shop";
import SocialPage from "@/pages/social";
import EventsPage from "@/pages/events";
import BattlePass from "@/pages/battle-pass";
import ClubPage from "@/pages/club-page";
import PlayerProfile from "@/components/PlayerProfile/PlayerProfile";
import GamePage from "./pages/game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/PlayerProfile" element={<PlayerProfile />} />

        <Route path="/battle-pass" element={<BattlePass />} />
        <Route path="/club" element={<ClubPage />} />

        <Route path="/brawlers" element={<Brawlers />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
