export interface ShopItem {
  id: string
  name: string
  description: string
  image: string
  price: number
  priceType: "gems" | "coins" | "tokens" | "usd" | "eth"
  discount?: number
  category: "brawlers" | "skins" | "coins" | "gems" | "special" | "bundles"
  rarity?: "common" | "rare" | "epic" | "legendary"
  isNFT?: boolean
  tokenId?: string
  isNew?: boolean
  isLimited?: boolean
  timeRemaining?: string
}

export interface FeaturedOffer {
  id: string
  title: string
  description: string
  image: string
  price: number
  priceType: "gems" | "usd" | "eth"
  background: string
  timeRemaining?: string
  isNew?: boolean
}

