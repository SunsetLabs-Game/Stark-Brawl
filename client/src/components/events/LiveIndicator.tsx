export default function LiveIndicator() {
    return (
      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
        <span className="animate-pulse mr-2 h-2 w-2 bg-white rounded-full"></span>
        LIVE
      </div>
    )
  }
  
  