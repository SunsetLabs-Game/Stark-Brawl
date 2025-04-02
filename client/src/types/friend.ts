export interface FriendRequest {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  trophies: number;
  mutualFriends: number;
  timestamp: Date;
}

export interface FriendCardInterface {
  avatar: string;
  username: string;
  online_status: "Online" | "Offline" | "In Game" | "Away";
  level: number;
  clan_affiliation: string;
  trophies: number;
}
