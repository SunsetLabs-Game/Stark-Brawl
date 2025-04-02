"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Info, Wallet, Lock } from "lucide-react"
import BrawlerStats from "@/components/brawler-details/brawler-stats"
import BrawlerAbilities from "@/components/brawler-details/brawler-abilities"
import type { Brawler } from "@/types/brawler-types"

interface BrawlerDetailsModalProps {
  brawler: Brawler
  onClose: () => void
}

export default function BrawlerDetailsModal({ brawler, onClose }: BrawlerDetailsModalProps) {
  const getRarityBorderColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-yellow-500"
      case "epic": return "border-pink-500"
      case "rare": return "border-blue-500"
      default: return "border-gray-500"
    }
  }

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "from-yellow-600/30 to-amber-800/30"
      case "epic": return "from-pink-600/30 to-purple-800/30"
      case "rare": return "from-blue-600/30 to-indigo-800/30"
      default: return "from-gray-600/30 to-gray-800/30"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-gradient-to-br ${getRarityBgColor(brawler.rarity)} from-purple-900 to-fuchsia-900 rounded-xl p-6 max-w-2xl w-full border-2 ${getRarityBorderColor(brawler.rarity)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            {brawler.isNFT && (
              <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
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
            <div className={`text-xs px-2 py-0.5 rounded-full ${
              brawler.rarity === "legendary"
                ? "bg-yellow-500/80 text-yellow-900"
                : brawler.rarity === "epic"
                ? "bg-pink-500/80 text-white"
                : "bg-blue-500/80 text-white"
            }`}>
              {brawler.rarity.toUpperCase()}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img
                src={brawler.image || "/placeholder.svg"}
                alt={brawler.name}
                width={200}
                height={200}
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
              {brawler.tokenId && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-yellow-900 px-3 py-1 rounded-full font-bold flex items-center">
                  <Wallet className="h-4 w-4 mr-1" />
                  {brawler.tokenId}
                </div>
              )}
            </motion.div>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-2">{brawler.name}</h2>
            <p className="text-white/80 mb-4">{brawler.description}</p>

            {brawler.isNFT && (
              <div className="bg-blue-900/30 p-3 rounded-lg mb-4 border border-blue-500/30">
                <div className="flex items-center mb-2">
                  <Info className="h-4 w-4 text-blue-400 mr-2" />
                  <h3 className="text-white font-bold">NFT Information</h3>
                </div>
                <p className="text-white/70 text-sm">
                  This brawler is a unique NFT on the Starknet blockchain. Once purchased, it will be transferred to
                  your wallet and can be traded on supported marketplaces.
                </p>
              </div>
            )}

            {brawler.unlocked ? (
              <>
                <BrawlerStats stats={brawler.stats} />
                <BrawlerAbilities abilities={brawler.abilities} />
              </>
            ) : (
              <div className="bg-purple-800/50 p-4 rounded-lg border border-purple-700 text-center">
                <p className="text-white mb-3">This brawler is locked. Unlock it to view stats and abilities!</p>
                <Button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  Unlock Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
