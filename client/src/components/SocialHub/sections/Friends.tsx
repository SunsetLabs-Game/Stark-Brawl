import React from 'react'
import { FriendCardInterface } from '../../../types/friend'
import { FriendsList } from './Friends/FriendsList'

const mocked_friends: FriendCardInterface[] = [
  {
    avatar: "/nft1.png",
    username: "CryptoKing",
    online_status: "Online",
    level: 150,
    clan_affiliation: "Cyrpto Warriors",
    trophies: 32450
  },
  {
    avatar: "/nft2.png",
    username: "NFTHunter",
    online_status: "Away",
    level: 145,
    clan_affiliation: "Token Masters",
    trophies: 31280
  },
  {
    avatar: "/nft3.png",
    username: "BlockchainBeast",
    online_status: "In Game",
    level: 142,
    clan_affiliation: "Crypto Warriors",
    trophies: 30150
  },
  {
    avatar: "/nft4.png",
    username: "StarknetPro",
    online_status: "Online",
    level: 138,
    clan_affiliation: "Legends",
    trophies: 29870
  },
  {
    avatar: "/nft5.png",
    username: "TokenMaster",
    online_status: "Offline",
    level: 135,
    clan_affiliation: "Token Masters",
    trophies: 28950
  },
  {
    avatar: "/nft6.png",
    username: "ZkRollup",
    online_status: "Away",
    level: 39,
    clan_affiliation: "L2 Legends",
    trophies: 14320
  }
];

interface FriendsProps {
  search: string;
}

const Friends = ({ search }: FriendsProps) => {
  return (
    <div className="text-white">
      <h2>Friends</h2>
      <FriendsList friends={mocked_friends} search={search} />
    </div>
  )
}

export default Friends 