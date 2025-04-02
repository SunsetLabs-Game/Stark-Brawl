"use client"

import type { FeaturedOffer } from "@/types/shop-types"
import { shopItems } from "@/pages/shop"

interface ShopFeaturedCarouselProps {
  featuredOffers: FeaturedOffer[]
  currentSlide: number
  setCurrentSlide: (slide: number) => void
  handleShowItemDetails: (item: any) => void
}

export default function ShopFeaturedCarousel({
  featuredOffers,
  currentSlide,
  setCurrentSlide,
  handleShowItemDetails,
}: ShopFeaturedCarouselProps) {
  return (
    <div className="relative h-64 mb-6 overflow-hidden rounded-xl">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {featuredOffers.map((offer, index) => (
          <div
            key={offer.id}
            className={`min-w-full h-full bg-gradient-to-r ${offer.background} rounded-xl p-6 flex items-center`}
          >
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {offer.isNew && (
                  <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">NEW</div>
                )}
                {offer.timeRemaining && (
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
                    {offer.timeRemaining}
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{offer.title}</h2>
              <p className="text-white/80 mb-4">{offer.description}</p>
              <div className="flex items-center">
                <button
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-md"
                  onClick={() => {
                    const item = shopItems.find(
                      (item) =>
                        (item.isNFT && offer.title.includes("LEGENDARY")) ||
                        (item.isNew && offer.isNew) ||
                        (item.isLimited && offer.timeRemaining),
                    )
                    if (item) handleShowItemDetails(item)
                  }}
                >
                  View Details
                </button>
                <div className="ml-4 bg-black/30 px-3 py-1 rounded-lg flex items-center">
                  {offer.priceType === "gems" && (
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
                      className="h-5 w-5 text-pink-400 mr-1"
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
                  )}
                  {offer.priceType === "usd" && (
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
                      className="h-5 w-5 text-green-400 mr-1"
                    >
                      <path d="M12 2v20"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  )}
                  {offer.priceType === "eth" && (
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
                      className="h-5 w-5 text-blue-400 mr-1"
                    >
                      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                    </svg>
                  )}
                  <span className="text-white font-bold">
                    {offer.priceType === "usd"
                      ? `$${offer.price}`
                      : offer.priceType === "eth"
                        ? `${offer.price} ETH`
                        : offer.price}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className="animate-[bounce_3s_ease-in-out_infinite]">
                <img
                  src={offer.image || "/placeholder.svg?height=200&width=200"}
                  alt={offer.title}
                  className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ width: "200px", height: "200px" }}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles del carrusel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredOffers.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/30"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white hover:bg-black/50"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredOffers.length) % featuredOffers.length)}
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
          className="h-6 w-6"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>

      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white hover:bg-black/50"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredOffers.length)}
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
          className="h-6 w-6"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>
    </div>
  )
}

