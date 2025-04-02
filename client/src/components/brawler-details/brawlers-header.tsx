"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Star, Wallet, Volume2, VolumeX, Crown } from "lucide-react"

interface BrawlersHeaderProps {
  username: string
  totalTrophies: number
  walletAddress: string
  level: number
  currencies: {
    gems: number
    coins: number
    tickets?: number
    tokens?: number
    eth?: number
  }
  muted: boolean
  onToggleSound: () => void
  onBackToDashboard: () => void
}

export default function BrawlersHeader({
  username,
  totalTrophies,
  walletAddress,
  level,
  currencies,
  muted,
  onToggleSound,
  onBackToDashboard,
}: BrawlersHeaderProps) {
  return (
    <div className="h-16 bg-purple-900 border-b border-purple-800 flex justify-between items-center px-4 z-10 relative">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10" onClick={onBackToDashboard}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-600 rounded-full overflow-hidden border-2 border-yellow-400 mr-3 flex items-center justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%283%29-QGCcias2jfmXbISldcsGrNqMuDO5c1.png"
            alt="Profile"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        <div>
          <div className="flex items-center">
            <p className="text-white font-bold">{username}</p>
            <div className="ml-2 bg-purple-800/50 px-2 py-0.5 rounded-full text-xs text-white flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1" />
              <span>LEVEL {level}</span>
            </div>
          </div>
        </div>

        <div className="ml-6 bg-purple-800/50 px-3 py-1 rounded-lg border border-purple-700 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-white font-bold">{totalTrophies}</span>
        </div>

        <div className="ml-4 bg-purple-800/50 px-3 py-1 rounded-lg border border-purple-700 flex items-center">
          <Wallet className="h-4 w-4 text-white/70 mr-1" />
          <span className="text-white/90 text-sm">{walletAddress}</span>
        </div>
      </div>

      <div className="flex space-x-3 items-center">
        <div className="bg-purple-800/70 px-3 py-1 rounded-lg flex items-center border border-purple-700">
          <Star className="h-5 w-5 text-pink-400 mr-1" />
          <span className="text-white font-bold">{currencies.gems}</span>
        </div>

        <div className="bg-purple-800/70 px-3 py-1 rounded-lg flex items-center border border-purple-700">
          <Crown className="h-5 w-5 text-yellow-500 mr-1" />
          <span className="text-white font-bold">{currencies.coins}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="bg-purple-800/50 border border-purple-700 hover:bg-purple-700/70"
          onClick={onToggleSound}
        >
          {muted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
        </Button>
      </div>
    </div>
  )
}
