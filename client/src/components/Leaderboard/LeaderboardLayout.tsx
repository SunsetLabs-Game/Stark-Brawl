import React, { useEffect } from 'react';
import { LeaderboardTabs } from './LeaderboardTabs';
import useLeaderboard from '../../hooks/useLeaderboard';
import LeaderboardTable from './sections/LeaderboardTable';


const LeaderboardLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    fetchLeaderboard,
    isLoading,
    filteredPlayers
  } = useLeaderboard();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-yellow-400 text-2xl mr-2">🏆</span>
          <h1 className="text-white text-2xl font-bold">Leaderboard</h1>
        </div>
        
        {/* Tabs */}
        <LeaderboardTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      {/* Table Content */}
      <LeaderboardTable 
        players={filteredPlayers}
        isLoading={isLoading}
        currentTab={activeTab}
      />
    </div>
  );
};

export default LeaderboardLayout;

