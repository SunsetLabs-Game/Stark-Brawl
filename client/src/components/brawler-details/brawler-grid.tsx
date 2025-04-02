"use client"

import BrawlerCard from "@/components/brawler-details/brawler-card"
import type { Brawler } from "@/types/brawler-types"

interface BrawlerGridProps {
  brawlers: Brawler[]
  onSelectBrawler: (brawler: Brawler) => void
}

export default function BrawlerGrid({ brawlers, onSelectBrawler }: BrawlerGridProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {brawlers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-white text-lg">No brawlers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brawlers.map((brawler) => (
            <BrawlerCard key={brawler.id} brawler={brawler} onSelect={onSelectBrawler} />
          ))}
        </div>
      )}
    </div>
  )
}

