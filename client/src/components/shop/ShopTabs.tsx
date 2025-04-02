"use client"

interface ShopTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function ShopTabs({ activeTab, setActiveTab }: ShopTabsProps) {
  const tabs = [
    { id: "all", label: "All Items" },
    { id: "featured", label: "Featured" },
    { id: "brawlers", label: "Brawlers" },
    { id: "skins", label: "Skins" },
    { id: "gems", label: "Gems" },
    { id: "coins", label: "Coins" },
    { id: "special", label: "Special Offers" },
    { id: "bundles", label: "Bundles" },
    { id: "nft", label: "NFT Items" },
  ]

  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

