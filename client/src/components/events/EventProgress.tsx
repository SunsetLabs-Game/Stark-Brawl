interface EventProgressProps {
    progress: number
    total?: number
  }
  
  export default function EventProgress({ progress, total = 100 }: EventProgressProps) {
    const percentage = Math.min(100, Math.max(0, (progress / total) * 100))
  
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm">Challenge Progress</span>
          <span className="text-sm font-bold">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-blue-900 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }
  
  