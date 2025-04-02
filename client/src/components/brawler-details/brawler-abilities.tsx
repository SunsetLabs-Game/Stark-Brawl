"use client"

import { Sparkles } from "lucide-react"

interface Ability {
  name: string
  description: string
  icon: string
}

interface BrawlerAbilitiesProps {
  abilities: Ability[]
}

export default function BrawlerAbilities({ abilities }: BrawlerAbilitiesProps) {
  return (
    <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-700">
      <h3 className="text-white font-bold mb-3">Abilities</h3>
      <div className="space-y-3">
        {abilities.map((ability, index) => (
          <div key={index} className="bg-purple-900/50 p-3 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-700 to-fuchsia-800 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                {ability.icon ? (
                  <img
                    src={ability.icon}
                    alt={ability.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ) : (
                  <Sparkles className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-pink-400">{ability.name}</h4>
                <p className="text-white/80 text-sm">{ability.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
