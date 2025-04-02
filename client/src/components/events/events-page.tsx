"use client"

import { useState } from "react"
import EventHeader from "@/components/events/EventHeader"
import SideMenu from "@/components/events/SideMenu"
import EventSearch from "@/components/events/EventSearch"
import EventTabs from "@/components/events/EventTabs"
import FeaturedEvent from "@/components/events/FeaturedEvent"
import type { Event } from "@/types/events"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const featuredEvent: Event = {
    title: "World Championship Finals",
    description:
      "The ultimate Brawl Stars showdown! Watch the best players compete for the championship title and massive prizes.",
    date: "Apr 15, 2025",
    time: "18:00 UTC",
    location: "Global",
    type: "tournament",
    rewards: ["Championship Trophy", "1,000,000 Gems", "Exclusive Skin"],
    isFeatured: true,
    image: "/nft3.png",
  }

  const upcomingEvents: Event[] = [
    {
      title: "Gem Grab Championship",
      description:
        "Compete with players worldwide in this special Gem Grab tournament. Top players will receive exclusive rewards!",
      date: "Mar 25, 2025",
      time: "14:00 UTC",
      location: "Global",
      type: "tournament",
      rewards: ["500 Gems", "Exclusive Skin", "Trophy Points"],
      participants: 1458,
      maxParticipants: 2000,
      image: "/nft2.png",
    },
    {
      title: "Weekend Challenge",
      description: "Win 9 battles in a row to claim all rewards in this special weekend challenge!",
      date: "Mar 22, 2025",
      time: "09:00 UTC",
      type: "challenge",
      rewards: ["Mega Box", "Coins", "Power Points"],
      progress: 35,
      progressTotal: 100,
      image: "/nft2.png",
    },
    {
      title: "Brawl-O-Ween Special",
      description: "Join this spooky special event and collect Halloween-themed rewards and skins!",
      date: "Mar 30, 2025",
      time: "18:00 UTC",
      location: "Haunted Arena",
      type: "special",
      rewards: ["Halloween Skin", "Special Pins", "Brawl Box"],
      image: "/nft3.png",
    },
    {
      title: "Brawler Release Tournament",
      description: "Be the first to master the newest Brawler in this special tournament with exclusive rewards!",
      date: "Apr 5, 2025",
      time: "12:00 UTC",
      location: "Training Camp",
      type: "tournament",
      rewards: ["New Brawler", "Brawler Skin", "Power Points"],
      participants: 876,
      maxParticipants: 5000,
      image: "/nft2.png",
    },
  ]

  const liveEvents: Event[] = [
    {
      title: "Power League Season Finals",
      description: "Watch the top players compete in the Power League Season Finals!",
      date: "Today",
      time: "Live Now",
      location: "Championship Arena",
      type: "tournament",
      rewards: ["League Skin", "Star Points", "Trophy"],
      progress: 75,
      progressTotal: 100,
      image: "/nft2.png",
    },
    {
      title: "Brawl Ball Cup",
      description: "The most exciting Brawl Ball tournament of the season is happening now!",
      date: "Today",
      time: "Live Now",
      location: "Stadium",
      type: "tournament",
      rewards: ["Cup Trophy", "Gems", "Special Pins"],
      progress: 50,
      progressTotal: 100,
      image: "/nft2.png",
    },
    {
      title: "Showdown Survival",
      description: "Last player standing wins! Join now for this intense battle royale event.",
      date: "Today",
      time: "Live Now",
      location: "Skull Creek",
      type: "challenge",
      rewards: ["Survival Badge", "Coins", "Mega Box"],
      progress: 25,
      progressTotal: 100,
      image: "/nft2.png",
    },
  ]

  const pastEvents: Event[] = [
    {
      title: "Winter Championship",
      description: "The winter championship has concluded. Check out the results!",
      date: "Feb 15, 2025",
      time: "18:00 UTC",
      location: "Snow Fort",
      type: "tournament",
      rewards: ["Winter Trophy", "Gems", "Winter Skin"],
      image: "/nft4.png",
    },
    {
      title: "Lunar New Year Challenge",
      description: "This special event celebrating the Lunar New Year has ended.",
      date: "Jan 25, 2025",
      time: "14:00 UTC",
      type: "challenge",
      rewards: ["Lunar Skin", "Red Envelopes", "Coins"],
      image: "/nft2.png",
    },
  ]

  const filterEvents = (events: Event[]) => {
    if (!searchQuery) return events
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredUpcoming = filterEvents(upcomingEvents)
  const filteredLive = filterEvents(liveEvents)
  const filteredPast = filterEvents(pastEvents)

  return (
    <div className="min-h-screen bg-blue-950 text-white">
      <EventHeader />
      <SideMenu />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <EventSearch onSearch={setSearchQuery} />
        {!searchQuery && <FeaturedEvent event={featuredEvent} />}
        <EventTabs upcomingEvents={filteredUpcoming} liveEvents={filteredLive} pastEvents={filteredPast} />
      </div>
    </div>
  )
}
