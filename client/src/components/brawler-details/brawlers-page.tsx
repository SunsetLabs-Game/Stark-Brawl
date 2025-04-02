"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import BrawlersHeader from "@/components/brawler-details/brawlers-header"
import BrawlersSideMenu from "@/components/brawler-details/brawlers-side-menu"
import BrawlersSearch from "@/components/brawler-details/brawlers-search"
import BrawlersTabs from "@/components/brawler-details/brawlers-tabs"
import BrawlerGrid from "@/components/brawler-details/brawler-grid"
import BrawlerDetailsModal from "@/components/brawler-details/brawler-details-modal"
import { getBrawlersData } from "@/lib/brawlers-data"
import type { Brawler } from "@/types/brawler-types"
import { motion } from "framer-motion"
import { Sword } from "lucide-react"



export default function BrawlersPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [muted, setMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrawler, setSelectedBrawler] = useState<Brawler | null>(null)
  const [sortBy, setSortBy] = useState<"trophies" | "power" | "rank">("trophies")
  const [brawlers, setBrawlers] = useState<Brawler[]>([])


interface BrawlerOld {
  id: number
  name: string
  image: string
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
  power: number
  rank: number
  trophies: number
  maxTrophies: number
  tokenId?: string
  isNFT?: boolean
  stats: {
    health: number
    damage: number
    speed: number
    range: number
  }
  abilities: {
    name: string
    description: string
    icon: string
  }[]
  description: string
}



  // User data
  const [username] = useState("u/Warmix7")
  const [totalTrophies] = useState(15644)
  const [walletAddress] = useState("0x1234...5678")
  const [level] = useState(42)
  const [currencies] = useState({
    gems: 5546,
    tickets: 8,
    coins: 489,
    tokens: 41,
    eth: 0.05,
  })

  // Load brawlers data
  useEffect(() => {
    const loadData = async () => {
      const data = await getBrawlersData()
      console.log("Brawlers loaded:", data) 
      setBrawlers(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // Handle brawler selection
  const handleSelectBrawler = (brawler: Brawler) => {
    setSelectedBrawler(brawler)
  }

  // Handle closing brawler details
  const handleCloseBrawlerDetails = () => {
    setSelectedBrawler(null)
  }

  // Toggle sound
  const toggleSound = () => {
    setMuted(!muted)
    toast(muted ? "Sound enabled" : "Sound disabled", "info")
  }

  // Get filtered brawlers based on active tab and search
  const getFilteredBrawlers = () => {
    if (!searchQuery && activeTab === "all") return brawlers

    let filtered = [...brawlers]

    // Filter by tab
    if (activeTab === "unlocked") {
      filtered = filtered.filter((brawler) => brawler.unlocked)
    } else if (activeTab === "locked") {
      filtered = filtered.filter((brawler) => !brawler.unlocked)
    } else if (activeTab === "nft") {
      filtered = filtered.filter((brawler) => brawler.isNFT)
    } else if (activeTab.includes("rarity-")) {
      const rarity = activeTab.split("-")[1]
      filtered = filtered.filter((brawler) => brawler.rarity === rarity)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((brawler) => brawler.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort brawlers
    if (sortBy === "trophies") {
      filtered.sort((a, b) => b.trophies - a.trophies)
    } else if (sortBy === "power") {
      filtered.sort((a, b) => b.power - a.power)
    } else if (sortBy === "rank") {
      filtered.sort((a, b) => b.rank - a.rank)
    }

    return filtered
  }

  if (loading) {
    return <BrawlersLoadingScreen />
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-purple-900">
      {/* Background particles */}
      <BackgroundParticles />

      {/* Header */}
      <BrawlersHeader
        username={username}
        totalTrophies={totalTrophies}
        walletAddress={walletAddress}
        level={level}
        currencies={currencies}
        muted={muted}
        onToggleSound={toggleSound}
        onBackToDashboard={() => navigate("/home")}
      />

      {/* Side Menu */}
      <BrawlersSideMenu onNavigate={(route) => navigate(route)} />

      {/* Main Content */}
      <div className="absolute left-20 right-0 top-16 bottom-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Title */}
          <div className="flex flex-col items-center pt-4 pb-2">
            <div className="flex items-center mb-2">
              <Sword className="h-6 w-6 text-orange-400 mr-2" />
              <h1 className="text-2xl font-bold text-white">BRAWLERS</h1>
            </div>
          </div>

          {/* Search and filters */}
          <BrawlersSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Tabs */}
          <BrawlersTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Brawlers grid */}
          <BrawlerGrid brawlers={getFilteredBrawlers()} onSelectBrawler={handleSelectBrawler} />
        </div>
      </div>

      {/* Brawler details modal */}
      {selectedBrawler && <BrawlerDetailsModal brawler={selectedBrawler} onClose={handleCloseBrawlerDetails} />}

      {/* Version */}
      <div className="absolute bottom-1 right-1 text-xs text-white/50">v2.0.0 Starknet Edition</div>
    </div>
  )
}

function BrawlersLoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-purple-900 overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Yellow%20Black%20Brush%20Streetwear%20Brand%20Logo-zD8Md0oiJ9lER4AzNLlZFoV1UuXgLP.png"
          alt="Brawl Stars Logo"
          className="h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        />
      </motion.div>

      <div className="mt-8 w-64 h-4 bg-purple-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5 }}
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-white text-lg font-bold"
      >
        Loading brawlers...
      </motion.p>
    </div>
  )
}

function BackgroundParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

