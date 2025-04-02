import React from 'react';
import { LeaderboardTabType, LeaderboardTabsProps } from '../../types/leaderboard-types';


export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: LeaderboardTabType.GLOBAL,
      label: 'Global',
      icon: '🌐',
    },
    {
      id: LeaderboardTabType.FRIENDS,
      label: 'Friends',
      icon: '👥',
    },
    {
      id: LeaderboardTabType.CLAN,
      label: 'Clan',
      icon: '👑',
    },
  ];

  return (
    <div className="flex space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center px-4 py-2 border border-[#e06c37] rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-gradient-to-b from-[#E04198] via-[#F94585] to-[#FF6925] text-white'
              : 'bg-purple-900/50 text-white/80 hover:bg-purple-800/70'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export interface Player {
  id: string;
  name: string;
  avatar: string;
  trophies: number;
  level: number;
  clan: string;
  rank?: number;
  isOnline?: boolean;
  isFriend?: boolean;
  isCurrentUser?: boolean;
}

export interface LeaderboardFilterOptions {
  timeFrame?: "all" | "season" | "month" | "week";
  regionFilter?: string;
  minTrophies?: number;
  maxTrophies?: number;
  clanFilter?: string;
}

export interface LeaderboardState {
  players: Player[];
  filteredPlayers: Player[];
  isLoading: boolean;
  error: string | null;
  activeTab: LeaderboardTabType;
  searchQuery: string;
  filterOptions: LeaderboardFilterOptions;
  
  // Actions
  setPlayers: (players: Player[]) => void;
  setActiveTab: (tab: LeaderboardTabType) => void;
  setSearchQuery: (query: string) => void;
  setFilterOptions: (options: LeaderboardFilterOptions) => void;
  fetchLeaderboard: () => Promise<void>;
}