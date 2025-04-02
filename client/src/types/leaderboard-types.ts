/**
 * Interfaces and types for the Leaderboard component
 */

/**
 * Enum for the different leaderboard tabs
 */
export enum LeaderboardTabType {
    GLOBAL = "Global",
    FRIENDS = "Friends",
    CLAN = "Clan"
  }
  
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
  
  export interface LeaderboardSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
  }
  
  export interface LeaderboardFilterProps {
    options: LeaderboardFilterOptions;
    onFilterChange: (options: LeaderboardFilterOptions) => void;
  }
  
  export interface LeaderboardTabsProps {
    activeTab: LeaderboardTabType;
    onTabChange: (tab: LeaderboardTabType) => void;
  }
  
  export interface LeaderboardTableProps {
    players: Player[];
    isLoading?: boolean;
    currentTab: LeaderboardTabType;
  }
  
  export interface LeaderboardRowProps {
    player: Player;
    rank: number;
    highlight?: boolean;
  }
  
  export interface PlayerRankProps {
    rank: number;
  }
  
  export interface PlayerAvatarProps {
    avatar: string;
    isOnline?: boolean;
    isFriend?: boolean;
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