"use client"

import { useState, useEffect } from "react"
import type { ShopItem, FeaturedOffer } from "@/types/shop-types"
import ShopHeader from "@/components/shop/ShopHeader"
import ShopSidebar from "@/components/shop/ShopSidebar"
import ShopTabs from "@/components/shop/ShopTabs"
import ShopFeaturedCarousel from "@/components/shop/ShopFeaturedCarousel"
import ShopItemGrid from "@/components/shop/ShopItemGrid"
import ShopItemDetails from "@/components/shop/ShopItemDetails"
import ShopCart from "@/components/shop/ShopCart"
import ToastContainer from "@/components/ToastContainer"
import { useToast } from "@/hooks/useToast"

export default function ShopPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [muted, setMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showItemDetails, setShowItemDetails] = useState<ShopItem | null>(null)
  const [cartItems, setCartItems] = useState<ShopItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)


  const [username] = useState("u/Warmix7")
  const [totalTrophies] = useState(15644)
  const [walletAddress] = useState("0x1234...5678")
  const [level] = useState(42)


  const [currencies, setCurrencies] = useState({
    gems: 5546,
    tickets: 8,
    coins: 489,
    tokens: 41,
    eth: 0.05,
  })


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const toggleSound = () => {
    setMuted(!muted)
    toast({
      title: muted ? "Sound enabled" : "Sound disabled",
    })
  }


  const handleShowItemDetails = (item: ShopItem) => {
    setShowItemDetails(item)
  }


  const handleCloseItemDetails = () => {
    setShowItemDetails(null)
  }


  const handleAddToCart = (item: ShopItem) => {
    setCartItems((prev) => [...prev, item])
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })

    if (showItemDetails) {
      setShowItemDetails(null)
    }
  }

  const handleBuyNow = (item: ShopItem) => {
    // Simular compra
    toast({
      title: "Purchase successful!",
      description: `You have purchased ${item.name}.`,
    })

    if (item.priceType === "gems") {
      setCurrencies((prev) => ({
        ...prev,
        gems: prev.gems - item.price,
      }))
    } else if (item.priceType === "coins") {
      setCurrencies((prev) => ({
        ...prev,
        coins: prev.coins - item.price,
      }))
    } else if (item.priceType === "eth") {
      setCurrencies((prev) => ({
        ...prev,
        eth: prev.eth - item.price,
      }))
    }

    if (showItemDetails) {
      setShowItemDetails(null)
    }
  }

  const getFilteredItems = (category: string) => {
    if (category === "featured") {
      return shopItems.filter((item) => item.isNew || item.isLimited || item.discount)
    }

    if (category === "nft") {
      return shopItems.filter((item) => item.isNFT)
    }

    if (category === "all" || category === "") {
      return shopItems
    }

    return shopItems.filter((item) => item.category === category)
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-violet-800 to-fuchsia-700 overflow-hidden">
        <div className="relative mb-6 animate-pulse">
          <img
            src="/assets/logo.png"
            alt="Brawl Stars Logo"
            className="h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=96&width=96"
            }}
          />
        </div>

        <div className="mt-8 w-64 h-4 bg-purple-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full animate-[progress_1.5s_ease-in-out]"
            style={{ width: "100%" }}
          />
        </div>

        <p className="mt-4 text-white text-lg font-bold">Loading shop...</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-b from-purple-900 via-violet-800 to-fuchsia-700">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">

          <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-violet-800 to-fuchsia-700" />

          <div className="absolute inset-0 bg-[url('/assets/background.webp')] bg-cover bg-center opacity-30" />
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
      </div>


      <ShopHeader
        username={username}
        totalTrophies={totalTrophies}
        walletAddress={walletAddress}
        level={level}
        currencies={currencies}
        cartItems={cartItems}
        muted={muted}
        toggleSound={toggleSound}
        setShowCart={setShowCart}
      />

      <ShopSidebar />

      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 flex items-center">
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
          className="h-8 w-8 text-white mr-2"
        >
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
          <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
          <path d="M21 16h-2"></path>
          <path d="M12 9v12"></path>
        </svg>
        <h1 className="text-3xl font-bold text-white">SHOP</h1>
      </div>


      <div className="absolute inset-0 pt-36 pb-4 px-4 z-10 overflow-hidden">
        <div className="h-full max-w-[2000px] mx-auto flex flex-col">

          <ShopFeaturedCarousel
            featuredOffers={featuredOffers}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            handleShowItemDetails={handleShowItemDetails}
          />


          <ShopTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <ShopItemGrid
            activeTab={activeTab}
            getFilteredItems={getFilteredItems}
            handleShowItemDetails={handleShowItemDetails}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {showItemDetails && (
        <ShopItemDetails
          item={showItemDetails}
          handleCloseItemDetails={handleCloseItemDetails}
          handleBuyNow={handleBuyNow}
          handleAddToCart={handleAddToCart}
        />
      )}

      {showCart && (
        <ShopCart cartItems={cartItems} setCartItems={setCartItems} setShowCart={setShowCart} toast={toast} />
      )}

      {/* Toasts */}
      <ToastContainer />


      <div className="absolute bottom-1 right-1 text-xs text-white/50">v2.0.0 Starknet Edition</div>
    </div>
  )
}

export const shopItems: ShopItem[] = [
  // Brawlers
  {
    id: "brawler-1",
    name: "Cyber Warrior",
    description: "A legendary cyber warrior with devastating attacks and a unique shield ability.",
    image: "/nft1.png",
    price: 349,
    priceType: "gems",
    category: "brawlers",
    rarity: "legendary",
    isNFT: true,
    tokenId: "#9876",
    isNew: true,
  },
  {
    id: "brawler-2",
    name: "Mystic Archer",
    description: "Master of the bow with piercing arrows and magical abilities.",
    image: "/nft2.png",
    price: 249,
    priceType: "gems",
    category: "brawlers",
    rarity: "epic",
    isNFT: true,
    tokenId: "#7654",
  },
  {
    id: "brawler-3",
    name: "Golden Knight",
    description: "A powerful knight with golden armor and devastating melee attacks.",
    image: "/nft3.png",
    price: 0.015,
    priceType: "eth",
    category: "brawlers",
    rarity: "legendary",
    isNFT: true,
    tokenId: "#5432",
    isLimited: true,
    timeRemaining: "2d 5h",
  },

  // Skins
  {
    id: "skin-1",
    name: "Cyber Samurai",
    description: "Futuristic samurai skin with neon effects and unique animations.",
    image: "/nft4.png",
    price: 149,
    priceType: "gems",
    category: "skins",
    rarity: "epic",
    isNFT: true,
    tokenId: "#3210",
  },
  {
    id: "skin-2",
    name: "Desert Warrior",
    description: "Sand-themed warrior with unique desert storm abilities.",
    image: "/nft5.png",
    price: 80,
    priceType: "gems",
    discount: 20,
    category: "skins",
    rarity: "rare",
  },
  {
    id: "skin-3",
    name: "Golden Gladiator",
    description: "Exclusive golden skin with special effects and animations.",
    image: "/nft6.png",
    price: 299,
    priceType: "gems",
    category: "skins",
    rarity: "legendary",
    isNFT: true,
    tokenId: "#1098",
    isLimited: true,
    timeRemaining: "5d 12h",
  },

  // Currency packs
  {
    id: "gems-1",
    name: "Gem Pack S",
    description: "A small pack of gems to boost your collection.",
    image: "/wallet.png",
    price: 4.99,
    priceType: "usd",
    category: "gems",
    isNew: true,
  },
  {
    id: "gems-2",
    name: "Gem Pack M",
    description: "A medium pack of gems with bonus coins.",
    image: "/wallet.png",
    price: 9.99,
    priceType: "usd",
    category: "gems",
    discount: 10,
  },
  {
    id: "gems-3",
    name: "Gem Pack L",
    description: "A large pack of gems with significant bonus coins.",
    image: "/wallet.png",
    price: 19.99,
    priceType: "usd",
    category: "gems",
    discount: 15,
  },
  {
    id: "coins-1",
    name: "Coin Pack S",
    description: "A small pack of coins for upgrades.",
    image: "/crown.png",
    price: 80,
    priceType: "gems",
    category: "coins",
  },
  {
    id: "coins-2",
    name: "Coin Pack M",
    description: "A medium pack of coins with bonus tokens.",
    image: "/crown.png",
    price: 150,
    priceType: "gems",
    category: "coins",
    discount: 5,
  },

  // Special offers
  {
    id: "special-1",
    name: "Starter Pack",
    description: "Perfect for new players! Get a head start with gems, coins, and a rare brawler.",
    image: "/shopping-cart.png",
    price: 4.99,
    priceType: "usd",
    category: "special",
    isNew: true,
  },
  {
    id: "special-2",
    name: "Weekend Warrior",
    description: "Limited weekend offer with bonus XP and special tokens.",
    image: "/shopping-cart.png",
    price: 9.99,
    priceType: "usd",
    category: "special",
    isLimited: true,
    timeRemaining: "1d 23h",
  },
  {
    id: "bundle-1",
    name: "Legendary Bundle",
    description: "Exclusive bundle with a guaranteed legendary brawler NFT and 1000 gems.",
    image: "/shopping-cart.png",
    price: 0.05,
    priceType: "eth",
    category: "bundles",
    rarity: "legendary",
    isNFT: true,
    isLimited: true,
    timeRemaining: "3d 8h",
  },
]



export const featuredOffers: FeaturedOffer[] = [
  {
    id: "featured-1",
    title: "LEGENDARY BUNDLE",
    description: "Get a guaranteed legendary brawler NFT + 1000 gems",
    image: "/nft4.png",
    price: 0.05,
    priceType: "eth",
    background: "from-yellow-600 to-amber-800",
    timeRemaining: "3d 8h",
  },
  {
    id: "featured-2",
    title: "WEEKEND SPECIAL",
    description: "Double XP + Special Skin",
    image: "/nft2.png",
    price: 9.99,
    priceType: "usd",
    background: "from-blue-600 to-purple-800",
    timeRemaining: "1d 23h",
  },
  {
    id: "featured-3",
    title: "NEW BRAWLER: CYBER WARRIOR",
    description: "Exclusive legendary NFT brawler",
    image: "/nft1.png",
    price: 349,
    priceType: "gems",
    background: "from-pink-600 to-purple-800",
    isNew: true,
  },
]


