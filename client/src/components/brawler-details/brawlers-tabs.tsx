"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Wallet } from "lucide-react"

interface BrawlersTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function BrawlersTabs({ activeTab, onTabChange }: BrawlersTabsProps) {
  return (
    <div className="px-4 py-2">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-purple-800/50 border border-purple-700 p-1 w-full grid grid-cols-7 h-auto">
          <TabsTrigger
            value="all"
            className={`${activeTab === "all" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="unlocked"
            className={`${activeTab === "unlocked" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            Unlocked
          </TabsTrigger>
          <TabsTrigger
            value="locked"
            className={`${activeTab === "locked" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            <Lock className="h-4 w-4 mr-1" />
            Locked
          </TabsTrigger>
          <TabsTrigger
            value="nft"
            className={`${activeTab === "nft" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            <Wallet className="h-4 w-4 mr-1" />
            NFT
          </TabsTrigger>
          <TabsTrigger
            value="rarity-legendary"
            className={`${activeTab === "rarity-legendary" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            Legendary
          </TabsTrigger>
          <TabsTrigger
            value="rarity-epic"
            className={`${activeTab === "rarity-epic" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            Epic
          </TabsTrigger>
          <TabsTrigger
            value="rarity-rare"
            className={`${activeTab === "rarity-rare" ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : "text-white/70"} py-2`}
          >
            Rare
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

