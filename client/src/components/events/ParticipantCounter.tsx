interface ParticipantCounterProps {
    current: number
    total: number
  }
  
  export default function ParticipantCounter({ current, total }: ParticipantCounterProps) {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100))
  
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm">Participants</span>
          <span className="text-sm">
            {current}/{total}
          </span>
        </div>
        <div className="w-full bg-blue-900 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }
  
  