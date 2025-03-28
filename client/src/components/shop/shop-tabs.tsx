"use client";

import { useState } from "react";
import { Sparkles, Coins, Gem, Flame, Crown, Gift, Wallet } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import BrawlersGrid from "./BrawlersGrid";
import BrawlerDetailsModal from "./brawler-details-modal";
import SkinCard from "../skin-shop/skin-card";
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
    {
      id: "3",
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
      id: "4",
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
      id: "5",
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
    }
    // Otros brawlers...
  ];

  const tabs = [
    {
      id: "featured",
      label: "Featured",
      icon: <Sparkles className="h-4 w-4 mr-2" />
    },
    {
      id: "brawlers",
      label: "Brawlers",
      icon: <Flame className="h-4 w-4 mr-2" />
    },
    {
      id: "skins",
      label: "Skins",
      icon: <Crown className="h-4 w-4 mr-2" />
    },
    {
      id: "gems",
      label: "Gems",
      icon: <Gem className="h-4 w-4 mr-2" />
    },
    {
      id: "coins",
      label: "Coins",
      icon: <Coins className="h-4 w-4 mr-2" />
    },
    {
      id: "bundles",
      label: "Bundles",
      icon: <Gift className="h-4 w-4 mr-2" />
    },
    {
      id: "nfts",
      label: "NFTs",
      icon: <Wallet className="h-4 w-4 mr-2" />
    }
  ]

  const nftItems = brawlers.filter(
    (item) =>
      item.isNFT &&
      (!item.isLimited || item.timeRemaining !== "Expired")
  );

  const bundleItems = brawlers.filter(
    (item) =>
      item.category === "bundles" &&
      (!item.isLimited || item.timeRemaining !== "Expired")
  );

  return (
    <div className="text-white">
      <Tabs
        defaultValue="featured"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-purple-900/50 border border-pink-500/30 p-1 w-full grid grid-cols-7 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`${activeTab === tab.id ? "bg-gradient-to-r from-pink-500 to-orange-500 [&>*]:text-black !text-black" : "text-white/70"} py-2`}
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="featured">
          <BrawlersGrid
            brawlers={brawlers}
            onSelectBrawler={setSelectedBrawler}
          />
        </TabsContent>

        <TabsContent value="skins">
          <SkinCard />
        </TabsContent>

        <TabsContent value="nfts">
          <BrawlersGrid
            brawlers={nftItems}
            onSelectBrawler={setSelectedBrawler}
          />
        </TabsContent>

        <TabsContent value="bundles">
          <BrawlersGrid
            brawlers={bundleItems}
            onSelectBrawler={setSelectedBrawler}
          />
        </TabsContent>

        {selectedBrawler && (
          <BrawlerDetailsModal
            brawler={selectedBrawler}
            onClose={() => setSelectedBrawler(null)}
            onBuyNow={() => { }}
            onAddToCart={() => { }}
          />
        )}
      </Tabs>
    </div>
  );
}

export default ShopTabs;
