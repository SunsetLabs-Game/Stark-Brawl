"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import EventCard from "./EventCard"
import EventCounter from "./EventCounter"
import type { Event } from "@/types/events"

interface EventTabsProps {
  upcomingEvents: Event[]
  liveEvents: Event[]
  pastEvents: Event[]
}

export default function EventTabs({ upcomingEvents, liveEvents, pastEvents }: EventTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid grid-cols-3 mb-8 bg-blue-800 rounded-md">
        <TabsTrigger
          value="upcoming"
          className="data-[state=active]:bg-yellow-500 data-[state=active]:text-blue-900 data-[state=active]:font-bold"
        >
          Upcoming
        </TabsTrigger>
        <TabsTrigger
          value="live"
          className="data-[state=active]:bg-yellow-500 data-[state=active]:text-blue-900 data-[state=active]:font-bold relative"
        >
          Live Now
          {liveEvents.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {liveEvents.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="past"
          className="data-[state=active]:bg-yellow-500 data-[state=active]:text-blue-900 data-[state=active]:font-bold"
        >
          Past Events
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-6">
        <EventCounter count={upcomingEvents.length} type="upcoming" />
        {upcomingEvents.map((event, index) => (
          <EventCard key={index} event={event} showParticipants={true} />
        ))}
      </TabsContent>

      <TabsContent value="live" className="space-y-6">
        <EventCounter count={liveEvents.length} type="live" />
        {liveEvents.map((event, index) => (
          <EventCard key={index} event={event} isLive={true} showProgress={true} />
        ))}
      </TabsContent>

      <TabsContent value="past" className="space-y-6">
        <EventCounter count={pastEvents.length} type="past" />
        {pastEvents.map((event, index) => (
          <EventCard key={index} event={event} isPast={true} />
        ))}
      </TabsContent>
    </Tabs>
  )
}

