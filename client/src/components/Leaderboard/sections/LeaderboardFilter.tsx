import React, { useState } from 'react';
import { LeaderboardFilterProps, LeaderboardFilterOptions } from '../../../types/leaderboard-types';

const LeaderboardFilter: React.FC<LeaderboardFilterProps> = ({ options, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localOptions, setLocalOptions] = useState<LeaderboardFilterOptions>(options);

  // Handle time frame changes
  const handleTimeFrameChange = (timeFrame: "all" | "season" | "month" | "week") => {
    const newOptions = { ...localOptions, timeFrame };
    setLocalOptions(newOptions);
  };

  // Handle minimum trophy changes
  const handleMinTrophiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setLocalOptions({ ...localOptions, minTrophies: value });
  };

  // Handle maximum trophy changes
  const handleMaxTrophiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setLocalOptions({ ...localOptions, maxTrophies: value });
  };

  // Handle clan filter changes
  const handleClanFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined;
    setLocalOptions({ ...localOptions, clanFilter: value });
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(localOptions);
    setIsOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    const resetOptions: LeaderboardFilterOptions = {
      timeFrame: "all",
    };
    setLocalOptions(resetOptions);
    onFilterChange(resetOptions);
    setIsOpen(false);
  };

  return (
    <div className="relative border border-[#e06c37] rounded-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-purple-900/50 px-4 py-2 rounded-lg text-white hover:bg-purple-800/50 transition-colors"
      >
        <span className="mr-2">Filter</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-customPurple rounded-lg shadow-lg z-10 p-4">
          <h3 className="text-white font-semibold mb-3">Filter Options</h3>
          
          {/* Time Frame Filter */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Time Frame</label>
            <div className="grid grid-cols-2 gap-2">
              {(["all", "season", "month", "week"] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeFrameChange(time)}
                  className={`px-3 py-1 rounded ${
                    localOptions.timeFrame === time
                      ? "bg-gradient-to-b from-[#E04198] via-[#F94585] to-[#FF6925] text-white"
                      : "bg-purple-800/50 text-gray-300 hover:bg-purple-700/70"
                  }`}
                >
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Trophy Range */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Trophy Range</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={localOptions.minTrophies || ""}
                onChange={handleMinTrophiesChange}
                className="bg-purple-900/50 px-3 py-1 rounded text-white placeholder-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-gray-300">-</span>
              <input
                type="number"
                placeholder="Max"
                value={localOptions.maxTrophies || ""}
                onChange={handleMaxTrophiesChange}
                className="bg-purple-900/50 px-3 py-1 rounded text-white placeholder-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Clan Filter */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Clan</label>
            <input
              type="text"
              placeholder="Filter by clan"
              value={localOptions.clanFilter || ""}
              onChange={handleClanFilterChange}
              className="bg-purple-900/50 px-3 py-1 rounded text-white placeholder-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={resetFilters}
              className="px-3 py-1 bg-purple-900/50 text-gray-300 rounded hover:bg-purple-800/70"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-3 py-1 bg-gradient-to-b from-[#E04198] via-[#F94585] to-[#FF6925] text-white rounded hover:bg-red-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardFilter;