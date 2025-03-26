export interface ShopItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  priceType: "gems" | "coins" | "tokens" | "usd" | "eth";
  discount?: number;
  category: "brawlers" | "skins" | "coins" | "gems" | "special" | "bundles";
  rarity?: "common" | "rare" | "epic" | "legendary";
  isNFT?: boolean;
  tokenId?: string;
  isNew?: boolean;
  isLimited?: boolean;
  timeRemaining?: string;
}
