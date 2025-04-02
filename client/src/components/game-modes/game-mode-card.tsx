import { Clock, Users, Award } from "lucide-react"
import type { GameMode } from "@/lib/types"
import Image from "next/image"

interface GameModeCardProps {
  gameMode: GameMode
}

export default function GameModeCard({ gameMode }: GameModeCardProps) {
  const { name, description, icon, iconType, timeLeft, playerCount, xpReward, color } = gameMode

  return (
    <div
      className={`rounded-xl p-4 transition-transform duration-200 hover:scale-105 cursor-pointer`}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#3a1a60] flex items-center justify-center flex-shrink-0">
          {iconType === "target" ? (
            <div className="w-8 h-8 rounded-full border-2 border-[#ff5757] flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-[#ff5757] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#ff5757]"></div>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <Image src={icon || "/placeholder.svg"} alt={name} width={24} height={24} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl uppercase">{name}</h3>
          <p className="text-white/80 text-sm mb-3">{description}</p>

          <div className="flex flex-wrap gap-4">
            {timeLeft && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-white/70" />
                <span className="text-white text-sm">{timeLeft}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-[#ffb258]" />
              <span className="text-[#ffb258] text-sm">{playerCount}</span>
            </div>

            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#58c3ff]" />
              <span className="text-[#58c3ff] text-sm">{xpReward} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

