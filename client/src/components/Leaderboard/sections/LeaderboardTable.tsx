import React from 'react';
import { LeaderboardTableProps } from '../../../types/leaderboard-types';
import LeaderboardRow from '../ui/LeaderboardRow';


const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-white">
        <div className="animate-pulse">Loading leaderboard data...</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="p-8 text-center text-white">
        No players found for the selected criteria.
      </div>
    );
  }

  return (
    <div className="bg-customPurple/80 rounded-b-lg">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 text-gray-300 font-semibold border-b border-purple-800">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">Player</div>
        <div className="col-span-2 text-center">Trophies</div>
        <div className="col-span-2 text-center">Level</div>
        <div className="col-span-2 text-center">Clan</div>
      </div>

      {/* Player Rows */}
      <div>
        {players.map((player) => (
          <LeaderboardRow
            key={player.id}
            player={player}
            rank={player.rank || 0}
            highlight={player.isCurrentUser || false}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTable;