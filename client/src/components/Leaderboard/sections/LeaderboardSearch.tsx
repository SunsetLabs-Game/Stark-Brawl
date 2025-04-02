import React, { useState, useEffect } from 'react';
import { LeaderboardSearchProps } from '../../../types/leaderboard-types';

const LeaderboardSearch: React.FC<LeaderboardSearchProps> = ({ 
  onSearch, 
  placeholder = "Search players..." 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative border border-[#e06c37] rounded-md">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        🔍
      </span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="bg-purple-900/50 w-full py-2 pl-10 pr-4 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default LeaderboardSearch;