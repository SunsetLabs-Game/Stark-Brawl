interface EventCounterProps {
    count: number
    type: string
  }
  
  export default function EventCounter({ count, type }: EventCounterProps) {
    return (
      <div className="text-white mb-4">
        <span className="font-bold">{count}</span> {type} events
      </div>
    )
  }
  
  