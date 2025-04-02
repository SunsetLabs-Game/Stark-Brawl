"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trophy, Crown, Zap, Lock, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Brawler } from "@/types/brawler-types"

interface BrawlerCardProps {
  brawler: Brawler
  onSelect: (brawler: Brawler) => void
}

export default function BrawlerCard({ brawler, onSelect }: BrawlerCardProps) {
  const { toast } = useToast()

  const getRarityBorderColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-500"
      case "epic":
        return "border-pink-500"
      case "rare":
        return "border-blue-500"
      default:
        return "border-gray-500"
    }
  }

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-yellow-500/80 text-yellow-900"
      case "epic":
        return "bg-pink-500/80 text-white"
      case "rare":
        return "bg-blue-500/80 text-white"
      default:
        return "bg-gray-500/80 text-white"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-purple-800/70 rounded-xl overflow-hidden border-2 ${getRarityBorderColor(
        brawler.rarity
      )} hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer`}
      onClick={() => onSelect(brawler)}
    >
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            {brawler.isNew && (
              <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">NEW</div>
            )}
            {brawler.isNFT && (
              <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full mr-2 flex items-center">
                <Wallet className="h-3 w-3 mr-1" />
                NFT
              </div>
            )}
            {!brawler.unlocked && (
              <div className="bg-gray-500/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </div>
            )}
          </div>
          <div className={`text-xs px-2 py-0.5 rounded-full ${getRarityBgColor(brawler.rarity)}`}>
            {brawler.rarity.toUpperCase()}
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${
                !brawler.unlocked ? "grayscale" : ""
              }`}
            >
              <img
                src={brawler.image || "/placeholder.svg"}
                alt={brawler.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            {brawler.tokenId && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                {brawler.tokenId}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-white font-bold text-center mb-2">{brawler.name}</h3>

        {brawler.unlocked ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-white text-sm">{brawler.trophies}</span>
              </div>
              <div className="flex items-center">
                <Crown className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-white text-sm">Rank {brawler.rank}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-purple-900/50 px-3 py-1 rounded-lg flex items-center">
                <Zap className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-white text-sm">Power {brawler.power}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              onClick={(e) => {
                e.stopPropagation()
                toast(`Visit the shop to unlock ${brawler.name}!`)
              }}
            >
              Unlock
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
