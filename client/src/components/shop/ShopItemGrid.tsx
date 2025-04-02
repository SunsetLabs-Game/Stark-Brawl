import type { ShopItem } from "@/types/shop-types"
import ShopItemCard from "@/components/shop/ShopItemCard"

interface ShopItemGridProps {
  activeTab: string
  getFilteredItems: (category: string) => ShopItem[]
  handleShowItemDetails: (item: ShopItem) => void
  handleAddToCart: (item: ShopItem) => void
}

export default function ShopItemGrid({
  activeTab,
  getFilteredItems,
  handleShowItemDetails,
  handleAddToCart,
}: ShopItemGridProps) {
  const filteredItems = getFilteredItems(activeTab)

  if (filteredItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
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
          className="h-16 w-16 text-white/30 mb-4"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <p className="text-white/70 text-lg mb-2">No items found</p>
        <p className="text-white/50 text-sm">Try selecting a different category</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => (
          <ShopItemCard
            key={item.id}
            item={item}
            index={index}
            handleShowItemDetails={handleShowItemDetails}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  )
}

