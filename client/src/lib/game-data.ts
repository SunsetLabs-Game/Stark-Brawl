import type { GameMode } from "./types"

export const gameModes: GameMode[] = [
  {
    id: "battle-royale",
    name: "Battle Royale",
    description: "Survive & Conquer",
    icon: "/placeholder.svg?height=24&width=24",
    iconType: "target",
    timeLeft: "51m 43s",
    playerCount: 25,
    xpReward: 100,
    color: "#b9377a",
  },
  {
    id: "treasure-hunt",
    name: "Treasure Hunt",
    description: "Find the Hidden Gems",
    icon: "/placeholder.svg?height=24&width=24",
    iconType: "crown",
    playerCount: 20,
    xpReward: 80,
    color: "#5a2ca0",
  },
  {
    id: "arena-clash",
    name: "Arena Clash",
    description: "Team Domination",
    icon: "/placeholder.svg?height=24&width=24",
    iconType: "crown",
    playerCount: 15,
    xpReward: 75,
    color: "#5a2ca0",
  },
  {
    id: "boss-fight",
    name: "Boss Fight",
    description: "Epic Boss Challenge",
    icon: "/placeholder.svg?height=24&width=24",
    iconType: "crown",
    playerCount: 30,
    xpReward: 120,
    color: "#5a2ca0",
  },
]

