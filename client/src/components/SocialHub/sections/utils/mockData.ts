import nft4 from "@/assets/nft4.png"
import nft5 from "@/assets/nft5.png"
import nft2 from "@/assets/nft2.png"
import nft3 from "@/assets/nft3.png"

export interface Clan {
  id: number;
  image:string;
  name: string;
  tag: string;
  trophies: number;
  members: number;
  maxMembers: number;
  description: string;
  region: string;
  status: "Open" | "Invite Only" | "Closed";
  requiredTrophies: number;
}

export const clansData: Clan[] = [
    {
      id: 1,
      image:nft4,
      name: "Crypto Warriors",
      tag: "#CW2023",
      trophies: 850000,
      members: 28,
      maxMembers: 30,
      description: "Top clan for crypto enthusiasts and gamers. Weekly tournaments with NFT prizes!",
      region: "Global",
      status: "Invite Only",
      requiredTrophies: 10000
    },
    {
      id: 2,
      image:nft2,
      name: "Token Masters",
      tag: "#TM456",
      trophies: 720000,
      members: 25,
      maxMembers: 30,
      description: "Friendly clan focused on helping each other grow. Active daily!",
      region: "Americas",
      status: "Open",
      requiredTrophies: 2000
    },
    {
      id: 3,
      image:nft5,
      name: "L2 Legends",
      tag: "#L2L789",
      trophies: 680000,
      members: 22,
      maxMembers: 30,
      description: "Layer 2 enthusiasts until scaling our way to the top of the leaderboards.",
      region: "Europe",
      status: "Invite Only",
      requiredTrophies: 10000
    },
    {
      id: 4,
      image:nft3,
      name: "NFT Collectors",
      tag: "#NFTC",
      trophies: 520000,
      members: 18,
      maxMembers: 30,
      description: "For avid NFT collectors and traders. Share tips and showcase your collection!",
      region: "Asia",
      status: "Closed",
      requiredTrophies: 50000
    },
  ];