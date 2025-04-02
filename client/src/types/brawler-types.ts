export interface Brawler {
  id: number
  name: string
  image: string
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
  power: number
  rank: number
  trophies: number
  maxTrophies: number
  tokenId?: string
  isNFT?: boolean
  isNew?: boolean
  stats: {
    health: number
    damage: number
    speed: number
    range: number
  }
  abilities: {
    name: string
    description: string
    icon: string
  }[]
  description: string
}

