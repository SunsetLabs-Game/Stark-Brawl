import React, { useEffect } from 'react';
import LeaderboardLayout from '../components/Leaderboard/LeaderboardLayout';
import useLeaderboard from '../hooks/useLeaderboard';
import LeaderboardSearch from '../components/Leaderboard/sections/LeaderboardSearch';
import LeaderboardFilter from '../components/Leaderboard/sections/LeaderboardFilter';

/**
 * Leaderboard page that integrates all leaderboard components
 */
const LeaderboardPage: React.FC = () => {
  const {
  
  
    error,


    filterOptions,
    setSearchQuery,
    setFilterOptions,
    fetchLeaderboard,
  } = useLeaderboard();

  // Fetch leaderboard data on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#581C8D] via-[#5B20B4] to-[#951CB0] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <span className="text-yellow-400 mr-3">🏆</span>
            Leaderboard
          </h1>
          <p className="text-gray-300 mt-2">
            See who's leading the pack in Stark Brawl. Compete and climb the ranks!
          </p>
        </div>

        {/* Main Leaderboard */}
        <div className="bg-purple-900 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="w-full sm:w-2/3">
              <LeaderboardSearch 
                onSearch={setSearchQuery} 
                placeholder="Search by player or clan name..." 
              />
            </div>
            <div className="flex justify-end">
              <LeaderboardFilter 
                options={filterOptions} 
                onFilterChange={setFilterOptions} 
              />
            </div>
          </div>

          {/* Leaderboard Content */}
          <LeaderboardLayout />

          {/* Error display */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              <p className="font-medium">Error loading leaderboard data</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-customPurple/30 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">How to Climb the Ranks</h2>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Win matches to earn trophies and climb the leaderboard</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Participate in weekly tournaments for bonus trophies</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Complete achievements to boost your player level</span>
              </li>
            </ul>
          </div>

          <div className="bg-customPurple/30 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">Ranking Seasons</h2>
            <div className="text-gray-300">
              <p className="mb-3">
                Season rankings reset at the end of each month. Top players receive exclusive rewards!
              </p>
              <div className="bg-purple-800/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span>Current Season Ends In:</span>
                  <span className="text-yellow-400 font-semibold">14 days, 6 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;