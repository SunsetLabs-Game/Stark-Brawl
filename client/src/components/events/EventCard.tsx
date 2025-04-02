import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventTypeTag from "./EventTypeTag"
import EventRewards from "./EventRewards"
import LiveIndicator from "./LiveIndicator"
import ParticipantCounter from "./ParticipantCounter"
import EventProgress from "./EventProgress"
import type { Event } from "@/types/events"

interface EventCardProps {
  event: Event
  isLive?: boolean
  isPast?: boolean
  showProgress?: boolean
  showParticipants?: boolean
}

export default function EventCard({ event, isLive, isPast, showProgress, showParticipants }: EventCardProps) {
  return (
    <div className="bg-blue-800 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row mb-6">
      <div className="md:w-1/3 relative">
        <img
          src={event.image || "/placeholder.svg?height=200&width=200"}
          alt={event.title}
          className="w-full h-full object-cover min-h-[150px]"
        />
        {isLive && <LiveIndicator />}
        {isPast && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-xl">COMPLETED</span>
          </div>
        )}
      </div>
      <div className="md:w-2/3 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{event.title}</h3>
          <EventTypeTag type={event.type} />
        </div>
        <p className="text-gray-300 mb-4">{event.description}</p>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-yellow-500" />
            <span>{event.time}</span>
          </div>
          {event.location && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-yellow-500" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {showProgress && event.progress && <EventProgress progress={event.progress} total={event.progressTotal} />}

        {showParticipants && event.participants && (
          <ParticipantCounter current={event.participants} total={event.maxParticipants || 2000} />
        )}

        <div className="mb-4">
          <EventRewards rewards={event.rewards} />
        </div>

        <Button
          className={`w-full ${isPast ? "bg-gray-600" : "bg-yellow-500 hover:bg-yellow-400"} text-blue-900 font-bold`}
          disabled={isPast}
        >
          {isPast ? "View Results" : isLive ? "Join Now" : "Register"}
        </Button>
      </div>
    </div>
  )
}

