export interface Event {
  id?: string
  title: string
  description: string
  date: string
  time: string
  location?: string
  type: "tournament" | "challenge" | "special"
  image?: string
  rewards: string[]
  participants?: number
  maxParticipants?: number
  progress?: number
  progressTotal?: number
  isFeatured?: boolean
}

