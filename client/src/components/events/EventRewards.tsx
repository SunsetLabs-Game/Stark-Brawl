import { Trophy, Gift, Star } from "lucide-react"

interface EventRewardsProps {
  rewards: string[]
  type?: "gems" | "skins" | "points" | "box" | "coins" | "power" | "halloween" | "pins" | "brawl"
}

export default function EventRewards({ rewards, type = "gems" }: EventRewardsProps) {
  const getIcon = (reward: string) => {
    if (reward.toLowerCase().includes("gem")) return <Star className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("skin")) return <Gift className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("point")) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("box")) return <Gift className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("coin")) return <Star className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("power")) return <Star className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("halloween")) return <Gift className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("pin")) return <Star className="h-4 w-4 text-yellow-500" />
    if (reward.toLowerCase().includes("brawl")) return <Gift className="h-4 w-4 text-yellow-500" />
    return <Star className="h-4 w-4 text-yellow-500" />
  }

  return (
    <div>
      <h4 className="font-semibold mb-2">Rewards:</h4>
      <div className="flex flex-wrap gap-2">
        {rewards.map((reward, index) => (
          <span key={index} className="bg-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
            {getIcon(reward)}
            <span className="ml-1">{reward}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

