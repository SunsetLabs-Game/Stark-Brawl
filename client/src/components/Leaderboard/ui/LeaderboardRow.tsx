import React from 'react';
import { LeaderboardRowProps } from '../../../types/leaderboard-types';
import PlayerRank from './PlayerRank';

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ player, rank, highlight = false }) => {
  const { name, avatar, trophies, level, clan, isOnline, isFriend } = player;

  return (
    <div
      className={`grid grid-cols-12 gap-4 p-4 border-b border-purple-800/50 ${
        highlight
          ? 'bg-purple-800/50 border-l-4 border-l-yellow-400'
          : 'hover:bg-purple-900/50'
      }`}
    >
      {/* Rank Column */}
      <div className="col-span-1 flex justify-center items-center">
        <PlayerRank rank={rank} />
      </div>

      {/* Player Column */}
      <div className="col-span-5 flex items-center">
        <div className="relative mr-3">
          {/* Player Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </div>
          
          {/* Online Status Indicator */}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-purple-800"></div>
          )}
        </div>

        {/* Player Name and Friend Tag */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-white font-medium">{name}</span>
            {isFriend && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500/30 text-blue-300 text-xs rounded-md">
                Friend
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trophies Column */}
      <div className="col-span-2 flex justify-center items-center">
        <span className="text-yellow-400 mr-1">🏆</span>
        <span className="text-white">{trophies.toLocaleString()}</span>
      </div>

      {/* Level Column */}
      <div className="col-span-2 flex justify-center items-center">
        <span className="text-yellow-400 mr-1">⭐</span>
        <span className="text-white">{level}</span>
      </div>

      {/* Clan Column */}
      <div className="col-span-2 flex justify-center items-center">
        <span className="text-white bg-purple-700 px-3 py-1 rounded-lg text-sm">
          {clan}
        </span>
      </div>
    </div>
  );
};

export default LeaderboardRow;