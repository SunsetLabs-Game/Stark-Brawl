"use client"

import type { ShopItem } from "@/types/shop-types"
import { renderPrice, getRarityBgColor, getRarityBorderColor } from "@/utils/shop-utils"

interface ShopItemCardProps {
  item: ShopItem
  index: number
  handleShowItemDetails: (item: ShopItem) => void
  handleAddToCart: (item: ShopItem) => void
}

export default function ShopItemCard({ item, index, handleShowItemDetails, handleAddToCart }: ShopItemCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${getRarityBgColor(item.rarity)} rounded-xl overflow-hidden border-2 ${getRarityBorderColor(
        item.rarity,
      )} hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer`}
      onClick={() => handleShowItemDetails(item)}
      style={{
        animation: `fadeIn 0.5s ease-out ${0.1 * index}s both`,
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            {item.isNew && <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">NEW</div>}
            {item.isNFT && (
              <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full mr-2 flex items-center">
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
                  className="h-3 w-3 mr-1"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
                NFT
              </div>
            )}
            {item.isLimited && (
              <div className="bg-red-500/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
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
                  className="h-3 w-3 mr-1"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {item.timeRemaining}
              </div>
            )}
          </div>
          {item.rarity && (
            <div
              className={`text-xs px-2 py-0.5 rounded-full ${
                item.rarity === "legendary"
                  ? "bg-yellow-500/80 text-yellow-900"
                  : item.rarity === "epic"
                    ? "bg-pink-500/80 text-white"
                    : "bg-blue-500/80 text-white"
              }`}
            >
              {item.rarity.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex justify-center mb-3">
          <div className="hover:scale-105 transition-transform duration-300 relative">
            {item.category === "gems" ? (
              <div className="flex items-center justify-center h-32 w-32 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-full">
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
                  className="h-16 w-16 text-pink-400"
                >
                  <path d="M12 2v8"></path>
                  <path d="m4.93 10.93 1.41 1.41"></path>
                  <path d="M2 18h2"></path>
                  <path d="M20 18h2"></path>
                  <path d="m19.07 10.93-1.41 1.41"></path>
                  <path d="M22 22H2"></path>
                  <path d="m16 6-4 4-4-4"></path>
                  <path d="M16 18a4 4 0 0 0-8 0"></path>
                </svg>
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.name.split(" ").pop()}
                </div>
              </div>
            ) : item.category === "coins" ? (
              <div className="flex items-center justify-center h-32 w-32 bg-gradient-to-br from-yellow-500/30 to-amber-600/30 rounded-full">
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
                  className="h-16 w-16 text-yellow-400"
                >
                  <circle cx="8" cy="8" r="6"></circle>
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                  <path d="M7 6h1v4"></path>
                  <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                </svg>
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.name.split(" ").pop()}
                </div>
              </div>
            ) : item.category === "special" ? (
              <div className="flex items-center justify-center h-32 w-32 bg-gradient-to-br from-blue-500/30 to-green-600/30 rounded-full">
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
                  className="h-16 w-16 text-blue-400"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                  <path d="M16.5 9.4 7.55 4.24"></path>
                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                  <line x1="12" x2="12" y1="22" y2="12"></line>
                </svg>
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.name.includes("Starter") ? "STARTER" : "SPECIAL"}
                </div>
              </div>
            ) : item.category === "bundles" && item.rarity === "legendary" ? (
              <div className="flex items-center justify-center h-32 w-32 bg-gradient-to-br from-yellow-400/50 to-amber-700/50 rounded-full border-2 border-yellow-300">
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
                  className="h-16 w-16 text-yellow-300"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                  <path d="M16.5 9.4 7.55 4.24"></path>
                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                  <line x1="12" x2="12" y1="22" y2="12"></line>
                </svg>
                <div className="absolute top-0 right-0 bg-yellow-500 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  LEGENDARY
                </div>
              </div>
            ) : (
              <img
                src={item.image || "/placeholder.svg?height=128&width=128"}
                alt={item.name}
                className="object-contain h-32"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                }}
              />
            )}
            {item.tokenId && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                {item.tokenId}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
        <p className="text-white/70 text-sm mb-3 line-clamp-2 h-10">{item.description}</p>

        <div className="flex justify-between items-center">
          {renderPrice(item.price, item.priceType, item.discount)}
          <button
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none px-3 py-1 rounded-md flex items-center"
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart(item)
            }}
          >
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
              className="h-4 w-4 mr-1"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

