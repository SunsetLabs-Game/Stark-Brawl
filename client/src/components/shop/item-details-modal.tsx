"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Info, Wallet, Clock } from "lucide-react";
import { PriceDisplay } from "./price-display";
import { ItemImage } from "./item-image";
import type { ShopItem } from "./@types/shop-types";
import { getRarityBgColor, getRarityBorderColor } from "./utils/shop-utils";

interface ItemDetailsModalProps {
  item: ShopItem | null;
  onClose: () => void;
  onAddToCart: (item: ShopItem) => void;
  onBuyNow: (item: ShopItem) => void;
}

export function ItemDetailsModal({
  item,
  onClose,
  onAddToCart,
  onBuyNow,
}: ItemDetailsModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-gradient-to-br ${getRarityBgColor(
              item.rarity
            )} from-purple-900 to-fuchsia-900 rounded-xl p-6 max-w-2xl w-full border-2 ${getRarityBorderColor(
              item.rarity
            )}`}
            onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
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
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 flex justify-center">
                <ItemImage item={item} size="lg" animate={true} />
              </div>

              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {item.name}
                </h2>
              </div>

              <div className="md:w-1/2">
                <p className="text-white/80 mb-4">{item.description}</p>
                <p className="text-white/80 mb-4">{item.description}</p>

                {item.isNFT && (
                  <div className="bg-blue-900/30 p-3 rounded-lg mb-4 border border-blue-500/30">
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 text-blue-400 mr-2" />
                      <h3 className="text-white font-bold">NFT Information</h3>
                    </div>
                    <p className="text-white/70 text-sm">
                      This item is a unique NFT on the Starknet blockchain. Once
                      purchased, it will be transferred to your wallet and can
                      be traded on supported marketplaces.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <div className="text-lg font-bold text-white">Price:</div>
                  <PriceDisplay
                    price={item.price}
                    priceType={item.priceType}
                    discount={item.discount}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                    onClick={() => onBuyNow(item)}
                  >
                    Buy Now
                  </Button>
                  <Button
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    onClick={() => onAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
