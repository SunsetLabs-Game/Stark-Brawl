import { FriendRequest } from '../../../../types/friend';

export const mockFriendRequests: FriendRequest[] = [
  {
    id: '1',
    username: 'Web3Wizard',
    avatarUrl: '/nft1.png',
    level: 120,
    trophies: 25600,
    mutualFriends: 3,
    timestamp: new Date('2024-03-10T10:00:00'),
  },
  {
    id: '2',
    username: 'DeFiDragon',
    avatarUrl: '/nft1.png',
    level: 95,
    trophies: 18900,
    mutualFriends: 1,
    timestamp: new Date('2024-03-10T09:00:00'),
  },
  {
    id: '3',
    username: 'MetaverseKing',
    avatarUrl: '/nft1.png',
    level: 110,
    trophies: 22400,
    mutualFriends: 5,
    timestamp: new Date('2024-03-10T08:00:00'),
  },
];
