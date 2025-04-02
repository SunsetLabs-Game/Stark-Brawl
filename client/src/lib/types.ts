export interface GameMode {
    id: string
    name: string
    description: string
    icon: string
    iconType: "target" | "crown"
    timeLeft?: string
    playerCount: number
    xpReward: number
    color: string
  }
  
  