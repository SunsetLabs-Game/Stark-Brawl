import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { LeaderboardState, LeaderboardTabType, Player, LeaderboardFilterOptions } from '../types/leaderboard-types';


const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'CryptoKing',
    avatar: '/nft1.png',
    trophies: 32450,
    level: 150,
    clan: 'Crypto Warriors',
    rank: 1,
    isOnline: true,
    isFriend: true,
  },
  {
    id: '2',
    name: 'NFTHunter',
    avatar: '/nft2.png',
    trophies: 31280,
    level: 145,
    clan: 'Token Masters',
    rank: 2,
    isOnline: true,
    isFriend: true,
  },
  {
    id: '3',
    name: 'BlockchainBeast',
    avatar: '/nft3.png',
    trophies: 30150,
    level: 142,
    clan: 'Crypto Warriors',
    rank: 3,
    isOnline: true,
    isFriend: false,
  },
  {
    id: '4',
    name: 'StarknetPro',
    avatar: '/nft4.png',
    trophies: 29870,
    level: 138,
    clan: 'L2 Legends',
    rank: 4,
    isOnline: true,
    isFriend: false,
  },
  {
    id: '5',
    name: 'TokenMaster',
    avatar: '/nft5.png',
    trophies: 28950,
    level: 135,
    clan: 'Token Masters',
    rank: 5,
    isOnline: true,
    isFriend: true,
  },
  {
    id: '6',
    name: 'u/Warmix7',
    avatar: '/nft6.png',
    trophies: 15644,
    level: 42,
    clan: 'Crypto Warriors',
    rank: 6,
    isOnline: true,
    isFriend: false,
    isCurrentUser: true,
  },
  {
    id: '7',
    name: 'ZkRollup',
    avatar: '/nft1.png',
    trophies: 14320,
    level: 39,
    clan: 'L2 Legends',
    rank: 7,
    isOnline: true,
    isFriend: false,
  },
  {
    id: '8',
    name: 'CryptoNoob',
    avatar: '/nft2.png',
    trophies: 12450,
    level: 35,
    clan: 'Token Masters',
    rank: 8,
    isOnline: true,
    isFriend: true,
  },
];


export const useLeaderboard = create<LeaderboardState>()(
  immer((set) => ({
    players: [],
    filteredPlayers: [],
    isLoading: false,
    error: null,
    activeTab: LeaderboardTabType.GLOBAL,
    searchQuery: '',
    filterOptions: {
      timeFrame: 'all',
    },

    // Set the list of players
    setPlayers: (players: Player[]) => {
      set((state) => {
        state.players = players;
        state.filteredPlayers = applyFilters(players, state.searchQuery, state.filterOptions, state.activeTab);
      });
    },

    // Set the active tab (Global, Friends, Clan)
    setActiveTab: (tab: LeaderboardTabType) => {
      set((state) => {
        state.activeTab = tab;
        state.filteredPlayers = applyFilters(state.players, state.searchQuery, state.filterOptions, tab);
      });
    },

    // Set the search query
    setSearchQuery: (query: string) => {
      set((state) => {
        state.searchQuery = query;
        state.filteredPlayers = applyFilters(state.players, query, state.filterOptions, state.activeTab);
      });
    },

    // Set filter options
    setFilterOptions: (options: LeaderboardFilterOptions) => {
      set((state) => {
        state.filterOptions = options;
        state.filteredPlayers = applyFilters(state.players, state.searchQuery, options, state.activeTab);
      });
    },

    // Fetch leaderboard data (currently mock, will be replaced with actual API/blockchain call)
    fetchLeaderboard: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // In a real implementation, replace this with:
        // const players = await fetchLeaderboardFromBlockchain();
        const players = [...mockPlayers];
        
        set((state) => {
          state.players = players;
          state.filteredPlayers = applyFilters(players, state.searchQuery, state.filterOptions, state.activeTab);
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'An unknown error occurred';
          state.isLoading = false;
        });
      }
    },
  }))
);


function applyFilters(
  players: Player[],
  searchQuery: string,
  filterOptions: LeaderboardFilterOptions,
  activeTab: LeaderboardTabType
): Player[] {
  let filtered = [...players];

  if (activeTab === LeaderboardTabType.FRIENDS) {
    filtered = filtered.filter((player) => player.isFriend);
  } else if (activeTab === LeaderboardTabType.CLAN) {
    const currentUserClan = filtered.find((p) => p.isCurrentUser)?.clan || '';
    filtered = filtered.filter((player) => player.clan === currentUserClan);
  }

  // Apply search filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((player) => 
      player.name.toLowerCase().includes(query) || 
      player.clan.toLowerCase().includes(query)
    );
  }

  // Apply additional filters if present
  if (filterOptions.timeFrame && filterOptions.timeFrame !== 'all') {
    // This would depend on having timestamp data for the trophies
    // For now, just pass through
  }

  if (filterOptions.minTrophies) {
    filtered = filtered.filter((player) => player.trophies >= filterOptions.minTrophies!);
  }

  if (filterOptions.maxTrophies) {
    filtered = filtered.filter((player) => player.trophies <= filterOptions.maxTrophies!);
  }

  if (filterOptions.clanFilter) {
    filtered = filtered.filter((player) => 
      player.clan.toLowerCase() === filterOptions.clanFilter!.toLowerCase()
    );
  }

  // Sort by trophies (descending)
  return filtered.sort((a, b) => b.trophies - a.trophies);
}

export default useLeaderboard;