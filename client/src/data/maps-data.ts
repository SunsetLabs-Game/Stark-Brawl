import {
  Cavern,
  Creek,
  Echo,
  Factory,
  Forsaken,
  Galactic,
  Lunar,
  NebulaDark,
  Nebula,
  Neon,
  Quantum,
  Shadow,
  SnowyHighlands,
  Solar,
  Stadium,
  Starlight,
  Stellar,
  ToxicSwamp,
} from "@/assets/maps";

export interface OfficialMap {
  featured?: boolean;
  name: string;
  mode: string;
  status: string;
  likes: number | null;
  dislikes: number | null;
  players: number | null;
  image?: string;
}

export interface CommunityMap {
  featured?: boolean;
  name: string;
  mode: string;
  creator?: string;
  status?: string;
  created: string;
  likes: number | null;
  dislikes: number | null;
  players: number | null;
  image?: string;
}

export interface MyMap {
  type: string;
  name: string;
  mode: string;
  published?: boolean;
  status: string;
  lastEdited: string;
  likes: number | null;
  dislikes: number | null;
  players: number | null;
  image?: string;
}

export interface MapsData {
  official: OfficialMap[];
  community: CommunityMap[];
  mine: MyMap[];
}

export const mapsData: MapsData = {
  official: [
    {
      featured: true,
      name: "Crystal Cavern",
      mode: "Gem Grab",
      status: "Current",
      likes: 24680,
      dislikes: 1250000,
      players: null,
      image: Cavern,
    },
    {
      name: "Forsaken Falls",
      mode: "Showdown",
      status: "In 2 hours",
      likes: 22450,
      dislikes: 980000,
      players: null,
      image: Forsaken,
    },
    {
      name: "Super Stadium",
      mode: "Brawl Ball",
      status: "In 4 hours",
      likes: null,
      dislikes: null,
      players: null,
      image: Stadium,
    },
    {
      name: "Lunar Base",
      mode: "Bounty",
      status: "In 6 hours",
      likes: 18000,
      dislikes: 750000,
      players: null,
      image: Lunar,
    },
    {
      name: "Starlight Plains",
      mode: "Heist",
      status: "In 8 hours",
      likes: 19500,
      dislikes: 820000,
      players: null,
      image: Starlight,
    },
    {
      name: "Meteor Shower",
      mode: "Siege",
      status: "In 10 hours",
      likes: 21000,
      dislikes: 900000,
      players: null,
      image: Solar,
    },
    {
      name: "Galactic Core",
      mode: "Hot Zone",
      status: "In 12 hours",
      likes: 23000,
      dislikes: 950000,
      players: null,
      image: Galactic,
    },
  ],
  community: [
    {
      featured: true,
      name: "Skull Creek",
      mode: "Showdown",
      creator: "SuperNova42",
      status: "Featured",
      created: "2 days ago",
      likes: 8750,
      dislikes: 1230,
      players: 45000,
      image: Creek,
    },
    {
      name: "Gem Factory",
      mode: "Gem Grab",
      creator: "GalaxyWarrior",
      created: "3 days ago",
      likes: 7650,
      dislikes: 980,
      players: 38000,
      image: Factory,
    },
    {
      name: "Twisted Tunnels",
      mode: "Brawl Ball",
      creator: "CosmicEntity",
      created: "5 days ago",
      likes: 400,
      dislikes: 1280,
      players: 34300,
      image: Galactic,
    },
    {
      name: "Frosty Peaks",
      mode: "Bounty",
      creator: "StarBlazer",
      created: "1 week ago",
      likes: 6500,
      dislikes: 850,
      players: 32000,
      image: Stellar,
    },
    {
      name: "Echo Caverns",
      mode: "Heist",
      creator: "NovaKnight",
      created: "4 days ago",
      likes: 7200,
      dislikes: 1100,
      players: 40000,
      image: Echo,
    },
    {
      name: "Shadow Realm",
      mode: "Siege",
      creator: "DarkMatter",
      created: "6 days ago",
      likes: 5800,
      dislikes: 900,
      players: 35000,
      image: Shadow,
    },
    {
      name: "Neon Circuit",
      mode: "Hot Zone",
      creator: "CyberSmith",
      created: "3 days ago",
      likes: 8000,
      dislikes: 1200,
      players: 42000,
      image: Neon,
    },
  ],
  mine: [
    {
      type: "Published",
      name: "Cosmic Arena",
      mode: "Gem Grab",
      status: "Published",
      lastEdited: "5 days ago",
      likes: 1250,
      dislikes: 320,
      players: 8500,
      image: Starlight,
    },
    {
      type: "Draft",
      name: "Asteroid Belt",
      mode: "Showdown",
      status: "Published",
      lastEdited: "1 week ago",
      likes: 980,
      dislikes: 210,
      players: 6200,
      image: Lunar,
    },
    {
      type: "Draft",
      name: "Nebula Nexus",
      mode: "Brawl Ball",
      status: "Draft",
      lastEdited: "1 day ago",
      likes: null,
      dislikes: null,
      players: null,
      image: Nebula,
    },
    {
      type: "Draft",
      name: "Stellar Drift",
      mode: "Bounty",
      status: "Published",
      lastEdited: "2 days ago",
      likes: 1100,
      dislikes: 280,
      players: 7500,
      image: Stellar,
    },
    {
      type: "Published",
      name: "Quantum Rift",
      mode: "Heist",
      status: "Draft",
      lastEdited: "3 days ago",
      published: true,
      likes: 1100,
      dislikes: 280,
      players: 7500,
      image: Quantum,
    },
    {
      type: "Draft",
      name: "Solar Flare",
      mode: "Siege",
      status: "Published",
      lastEdited: "4 days ago",
      likes: 900,
      dislikes: 190,
      players: 5800,
      image: Solar,
    },
    {
      type: "Draft",
      name: "Dark Nebula",
      published: true,
      mode: "Hot Zone",
      status: "Draft",
      lastEdited: "6 days ago",
      likes: 1100,
      dislikes: 280,
      players: 7500,
      image: NebulaDark,
    },
    {
      type: "Draft",
      name: "Snowy Highlands",
      mode: "Tower Defense",
      status: "Draft",
      lastEdited: "1 hour ago",
      likes: 1000,
      dislikes: 100,
      players: 2000,
      image: SnowyHighlands,
    },
    {
      type: "Draft",
      name: "Toxic Swamp",
      mode: "Tower Defense",
      status: "Draft",
      lastEdited: "1 hour ago",
      likes: 1100,
      dislikes: 10,
      players: 2500,
      image: ToxicSwamp,
    },
  ],
};
