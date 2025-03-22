"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PriceDisplay } from "./price-display";
import { ItemImage } from "./item-image";
import type { ShopItem } from "./@types/shop-types";
import { getRarityBgColor, getRarityBorderColor } from "./utils/shop-utils";
import { Clock, Wallet } from "lucide-react";

interface ShopItemCardProps {
  item: ShopItem;
  index: number;
  onShowDetails: (item: ShopItem) => void;
  onAddToCart: (item: ShopItem) => void;
}

export function ShopItemCard({
  item,
  index,
  onShowDetails,
  onAddToCart,
}: ShopItemCardProps) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`bg-gradient-to-br ${getRarityBgColor(
        item.rarity
      )} rounded-xl overflow-hidden border-2 ${getRarityBorderColor(
        item.rarity
      )} hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300`}
      onClick={() => onShowDetails(item)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            {item.isNew && (
              <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                NEW
              </div>
            )}
            {item.isNFT && (
              <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full mr-2 flex items-center">
                <Wallet className="h-3 w-3 mr-1" />
                NFT
              </div>
            )}
            {item.isLimited && (
              <div className="bg-red-500/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                <Clock className="h-3 w-3 mr-1" />
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
          <ItemImage item={item} />
        </div>

        <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
        <p className="text-white/70 text-sm mb-3 line-clamp-2 h-10">
          {item.description}
        </p>

        <div className="flex justify-between items-center">
          <PriceDisplay
            price={item.price}
            priceType={item.priceType}
            discount={item.discount}
          />
          <Button
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
