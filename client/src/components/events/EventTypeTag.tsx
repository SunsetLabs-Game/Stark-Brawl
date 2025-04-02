interface EventTypeTagProps {
    type: string
  }
  
  export default function EventTypeTag({ type }: EventTypeTagProps) {
    const colors = {
      tournament: "bg-purple-600",
      challenge: "bg-green-600",
      special: "bg-orange-500",
    }
  
    const colorClass = colors[type as keyof typeof colors] || "bg-blue-600"
  
    return (
      <span className={`${colorClass} px-3 py-1 rounded-full text-sm`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }
  
  