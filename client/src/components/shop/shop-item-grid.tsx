import type { ShopItem } from "./@types/shop-types";
import { ShopItemCard } from "./shop-item-card";

interface ShopItemGridProps {
  items: ShopItem[];
  onShowDetails: (item: ShopItem) => void;
  onAddToCart: (item: ShopItem) => void;
}

export function ShopItemGrid({
  items,
  onShowDetails,
  onAddToCart,
}: ShopItemGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <ShopItemCard
          key={item.id}
          item={item}
          index={index}
          onShowDetails={onShowDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
