"use client"
import { Link } from "react-router-dom"
import type { ShopItem } from "@/types/shop-types"

interface ShopHeaderProps {
  username: string
  totalTrophies: number
  walletAddress: string
  level: number
  currencies: {
    gems: number
    tickets: number
    coins: number
    tokens: number
    eth: number
  }
  cartItems: ShopItem[]
  muted: boolean
  toggleSound: () => void
  setShowCart: (show: boolean) => void
}

export default function ShopHeader({
  username,
  totalTrophies,
  walletAddress,
  level,
  currencies,
  cartItems,
  muted,
  toggleSound,
  setShowCart,
}: ShopHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-900/80 to-fuchsia-900/80 backdrop-blur-md z-20 flex items-center justify-between px-4 border-b border-purple-700/50">
      <div className="flex items-center">
        <Link to="/dashboard" className="flex items-center mr-4 text-white hover:text-pink-400 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          <span className="ml-2 font-bold hidden sm:inline">Back</span>
        </Link>

        <div className="flex items-center">
          <img
            src="/1.png"
            alt="Game Logo"
            className="h-8 mr-2"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=32&width=32"
            }}
          />
          <span className="text-white font-bold text-lg hidden md:inline">STARK BRAWL</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
          <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mr-1">
            💎
          </div>
          <span className="text-white text-sm font-bold">{currencies.gems}</span>
        </div>

        <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-1">
            🪙
          </div>
          <span className="text-white text-sm font-bold">{currencies.coins}</span>
        </div>

        <div className="flex items-center bg-white/10 rounded-full px-2 py-1 hidden sm:flex">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-1">
            🎫
          </div>
          <span className="text-white text-sm font-bold">{currencies.tokens}</span>
        </div>

        <div className="flex items-center bg-white/10 rounded-full px-2 py-1 hidden md:flex">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-1">
            Ξ
          </div>
          <span className="text-white text-sm font-bold">{currencies.eth.toFixed(3)}</span>
        </div>

        <button
          className="relative bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
          onClick={() => setShowCart(true)}
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>

        <button
          className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors hidden sm:block"
          onClick={toggleSound}
        >
          {muted ? "🔇" : "🔊"}
        </button>

        <div className="flex items-center bg-white/10 rounded-full pl-2 pr-3 py-1 ml-2">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">{level}</span>
          </div>
          <span className="text-white text-sm font-bold hidden md:inline">{username}</span>
        </div>
      </div>
    </div>
  )
}
