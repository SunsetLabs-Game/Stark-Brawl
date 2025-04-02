"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Trophy, Zap, Crown } from "lucide-react"

interface BrawlersSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: "trophies" | "power" | "rank"
  onSortChange: (sort: "trophies" | "power" | "rank") => void
}

export default function BrawlersSearch({ searchQuery, onSearchChange, sortBy, onSortChange }: BrawlersSearchProps) {
  return (
    <div className="px-4 py-2 flex justify-between items-center">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          placeholder="Search brawlers..."
          className="pl-10 bg-purple-800/50 border-purple-700 text-white placeholder:text-white/50"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className={`bg-purple-800/50 border-purple-700 text-white ${sortBy === "trophies" ? "bg-purple-700" : ""}`}
          onClick={() => onSortChange("trophies")}
        >
          <Trophy className="h-4 w-4 mr-1" />
          Trophies
        </Button>
        <Button
          variant="outline"
          className={`bg-purple-800/50 border-purple-700 text-white ${sortBy === "power" ? "bg-purple-700" : ""}`}
          onClick={() => onSortChange("power")}
        >
          <Zap className="h-4 w-4 mr-1" />
          Power
        </Button>
        <Button
          variant="outline"
          className={`bg-purple-800/50 border-purple-700 text-white ${sortBy === "rank" ? "bg-purple-700" : ""}`}
          onClick={() => onSortChange("rank")}
        >
          <Crown className="h-4 w-4 mr-1" />
          Rank
        </Button>
      </div>
    </div>
  )
}

