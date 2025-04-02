"use client"

import { Heart, Sword, Zap, Target } from "lucide-react"

interface BrawlerStatsProps {
  stats: {
    health: number
    damage: number
    speed: number
    range: number
  }
}

export default function BrawlerStats({ stats }: BrawlerStatsProps) {
  return (
    <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-700 mb-4">
      <h3 className="text-white font-bold mb-3">Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-red-400 mr-1" />
              <span className="text-white text-sm">Health</span>
            </div>
            <span className="text-white text-sm">{stats.health}%</span>
          </div>
          <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
              style={{ width: `${stats.health}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <Sword className="h-4 w-4 text-orange-400 mr-1" />
              <span className="text-white text-sm">Damage</span>
            </div>
            <span className="text-white text-sm">{stats.damage}%</span>
          </div>
          <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
              style={{ width: `${stats.damage}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-white text-sm">Speed</span>
            </div>
            <span className="text-white text-sm">{stats.speed}%</span>
          </div>
          <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              style={{ width: `${stats.speed}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-white text-sm">Range</span>
            </div>
            <span className="text-white text-sm">{stats.range}%</span>
          </div>
          <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              style={{ width: `${stats.range}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

