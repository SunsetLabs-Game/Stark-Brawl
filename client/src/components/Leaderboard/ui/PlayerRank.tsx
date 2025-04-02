import React from 'react';
import { PlayerRankProps } from '../../../types/leaderboard-types';


const PlayerRank: React.FC<PlayerRankProps> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center text-black font-bold shadow-lg">
        🥇
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-300 to-gray-400 flex items-center justify-center text-black font-bold shadow-lg">
        🥈
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-600 to-yellow-800 flex items-center justify-center text-black font-bold shadow-lg">
        🥉
      </div>
    );
  }

  return (
    <div className="text-gray-300 font-medium">
      {rank}
    </div>
  );
};

export default PlayerRank;