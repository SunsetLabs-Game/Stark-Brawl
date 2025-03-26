"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Coins, Gem } from "lucide-react";
import BrawlersGrid from "./BrawlersGrid";
import BrawlerDetailsModal from "./brawler-details-modal";
import { ShopItem } from "./@types/shop-types";  


interface ShopTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ShopTabs({ activeTab, setActiveTab }: ShopTabsProps) {
  const [selectedBrawler, setSelectedBrawler] = useState<ShopItem | null>(null);

  const brawlers: ShopItem[] = [
    {
      id: "1",
      name: "Cyber Warrior",
      description: "A fire-powered brawler.",
      image: "/nft4.png",
      price: 1.5,
      priceType: "eth",
      discount: 0,
      category: "brawlers",
      rarity: "legendary",
      isNFT: true,
      tokenId: "0x123",
      isNew: true,
      isLimited: true,
      timeRemaining: "10h"
    },
    {
      id: "2",
      name: "Mystic Archer",
      description: "A stealthy brawler.",
      image: "nft2.png",
      price: 750,
      priceType: "coins",
      discount: 10,
      category: "skins",
      rarity: "epic",
      isNFT: false,
      tokenId: "0x456",
      isNew: false,
      isLimited: false,
      timeRemaining: "N/A"
    },
    // Otros brawlers...
  ];

  return (
    <div className="text-white">
      <Tabs
        defaultValue="featured"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-purple-900/50 border border-pink-500/30 p-1 w-full grid grid-cols-3 h-auto">
          <TabsTrigger
            value="featured"
            className={`${activeTab === "featured" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Featured
          </TabsTrigger>
          <TabsTrigger
            value="gems"
            className={`${activeTab === "gems" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            <Gem className="h-4 w-4 mr-2" />
            Gems
          </TabsTrigger>
          <TabsTrigger
            value="coins"
            className={`${activeTab === "coins" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            <Coins className="h-4 w-4 mr-2" />
            Coins
          </TabsTrigger>
        </TabsList>
        {activeTab === "featured" && (
          <BrawlersGrid brawlers={brawlers} onSelectBrawler={setSelectedBrawler} />
        )}
        {selectedBrawler && <BrawlerDetailsModal brawler={selectedBrawler} onClose={() => setSelectedBrawler(null)} onBuyNow={() => {}}
          onAddToCart={() => {}} />}
      </Tabs>
    </div>
  );
}
export default ShopTabs;