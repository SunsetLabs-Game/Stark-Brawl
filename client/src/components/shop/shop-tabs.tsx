"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Coins, Gem } from "lucide-react";

interface ShopTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ShopTabs({ activeTab, setActiveTab }: ShopTabsProps) {
  return (
    <Tabs
      defaultValue="featured"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="bg-purple-900/50 border border-pink-500/30 p-1 w-full grid grid-cols-3 h-auto">
        <TabsTrigger
          value="featured"
          className={`${
            activeTab === "featured"
              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              : "text-white/70"
          } py-2`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Featured
        </TabsTrigger>

        <TabsTrigger
          value="gems"
          className={`${
            activeTab === "gems"
              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              : "text-white/70"
          } py-2`}
        >
          <Gem className="h-4 w-4 mr-2" />
          Gems
        </TabsTrigger>
        <TabsTrigger
          value="coins"
          className={`${
            activeTab === "coins"
              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              : "text-white/70"
          } py-2`}
        >
          <Coins className="h-4 w-4 mr-2" />
          Coins
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
