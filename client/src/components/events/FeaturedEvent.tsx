import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventTypeTag from "./EventTypeTag"
import type { Event } from "@/types/events"

interface FeaturedEventProps {
  event: Event
}

export default function FeaturedEvent({ event }: FeaturedEventProps) {
  return (
    <div className="bg-blue-800/50 rounded-xl overflow-hidden shadow-lg mb-8 relative">
      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md">FEATURED EVENT</div>

      <div className="absolute top-4 right-4">
        <EventTypeTag type={event.type} />
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h2>
            <p className="text-blue-100 mb-6">{event.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <Button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold w-fit">
            Register Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="md:w-1/2 min-h-[200px] md:min-h-[300px] relative">
          <img
            src={event.image || "/placeholder.svg?height=300&width=500"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

