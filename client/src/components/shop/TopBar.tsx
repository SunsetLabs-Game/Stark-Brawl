import { Gem, ArrowLeft, Trophy, Volume2, ShoppingCart, Wallet, Star, Ticket, Crown } from "lucide-react";
import { useNavigate } from "react-router";
interface TopBarProps {
  avatar: string;
  username: string;
  level: number;
  trophies: number;
  address: string;
  gems: number;
  tickets: number;
  crowns: number;
  eth: number;
}

const TopBar = ({ level, trophies, address, gems, tickets, crowns, eth, username, avatar }: TopBarProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 px-4 py-1.5 flex justify-between items-center border-b border-purple-700/50">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Back button */}
        <button className="text-white/80 hover:text-white" onClick={() => navigate("/")}>
          <ArrowLeft className="w-3 h-3" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-4">
          {/* Avatar and username */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-yellow-500">
              <img
                src={avatar}
                alt="User avatar"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <span className="text-white/90 text-sm font-medium">{username}</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1 bg-purple-500/20 px-1 py-0.5 rounded-[8px]">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-white text-xs uppercase font-bold">Level</span>
            <span className="text-white text-sm font-bold">{level}</span>
          </div>

          {/* Trophy score */}
          <div className="flex items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-[8px]">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-xs">{trophies}</span>
          </div>

          {/* Wallet Address */}
          <div className="flex items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-[8px]">
            <Wallet className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-xs">{address}</span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Gems */}
        <div className="flex items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-[8px]">
          <Gem className="w-4 h-4 text-pink-400" />
          <span className="text-white/90 text-sm">{gems}</span>
        </div>

        {/* Monitor count */}
        <div className="flex items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-[8px]">
          <Ticket className="w-4 h-4 text-yellow-400" />
          <span className="text-white/90 text-sm">{tickets}</span>
        </div>

        {/* Trophy */}
        <div className="flex items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-[8px]">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-white/90 text-sm">{crowns}</span>
        </div>

        {/* ETH */}
        <div className="flex items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-[8px]">
          <Wallet className="w-4 h-4 text-blue-400" />
          <span className="text-white/90 text-sm">{eth} ETH</span>
        </div>

        {/* Cart */}
        <button className=" bg-white/60 p-2 rounded-[4px] hover:bg-white/10 transition-colors">
          <ShoppingCart className="w-3 h-3 text-white/90" />
        </button>

        {/* Volume */}
        <button className=" bg-purple-500/20 p-2 rounded-[4px] hover:bg-white/10 transition-colors">
          <Volume2 className="w-3 h-3 text-white/90" />
        </button>
      </div>
    </div>
  );
};

export default TopBar; 