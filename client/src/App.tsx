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
import BattleLogPage from "./pages/battle-log";
import MainGameScene from "./components/Map/Game";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import cartridgeConnector from "./CartredgeConnector";
import DesertBonefieldMap from "./components/maps/desert-bonefield-map/DesertBonefieldMap";

export default function App() {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos(), cartridgeConnector],
  });
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
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
          <Route path="/battle-log" element={<BattleLogPage />} />
          <Route path="/game" element={<MainGameScene />} />
          <Route path="/game/desert-bonefield" element={<DesertBonefieldMap />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </StarknetConfig>
  );
}
