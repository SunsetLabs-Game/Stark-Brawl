"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Info, Wallet, Clock } from "lucide-react";
import { PriceDisplay } from "./price-display";
import { BrawlerImage } from "./brawler-image"; 
import type { ShopItem } from "./@types/shop-types";
import { getRarityBgColor, getRarityBorderColor } from "./utils/shop-utils";
import { PurchaseConfirmationModal } from "./purchase-confimation-modal";
import { CountdownTimer } from "@/components/shop/CountdownTimer";

interface BrawlerDetailsModalProps {
  brawler: ShopItem | null;
  onClose: () => void;
  onAddToCart?: (brawler: ShopItem) => void; 
  onBuyNow?: (brawler: ShopItem) => void;     
}

export function BrawlerDetailsModal({
  brawler,
  onClose,
  onAddToCart,
  onBuyNow,
}: BrawlerDetailsModalProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!brawler) return null;

  return (
    <AnimatePresence>
      <>
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
              brawler.rarity
            )} from-purple-900 to-fuchsia-900 
            rounded-xl p-6 max-w-2xl w-full border-2 
            ${getRarityBorderColor(brawler.rarity)}`}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                {brawler.isNew && (
                  <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                    NEW
                  </div>
                )}
                {brawler.isNFT && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full mr-2 flex items-center">
                    <Wallet className="h-3 w-3 mr-1" />
                    NFT
                  </div>
                )}
                {brawler.isLimited && (
                  <div className="bg-red-500/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <CountdownTimer 
                         timeRemaining={brawler.timeRemaining  ?? "Expired"} 
                          onExpire={() => console.log("⏱️ Expired:", brawler.name)} 
                           />
                  </div>
                )}
                {brawler.rarity && (
                  <div
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      brawler.rarity === "legendary"
                        ? "bg-yellow-500/80 text-yellow-900"
                        : brawler.rarity === "epic"
                        ? "bg-pink-500/80 text-white"
                        : "bg-blue-500/80 text-white"
                    }`}
                  >
                    {brawler.rarity.toUpperCase()}
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
                <BrawlerImage brawler={brawler} size="lg" animate />
              </div>

              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {brawler.name}
                </h2>
                <p className="text-white/80 mb-4">{brawler.description}</p>

                {brawler.isNFT && (
                  <div className="bg-blue-900/30 p-3 rounded-lg mb-4 border border-blue-500/30">
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 text-blue-400 mr-2" />
                      <h3 className="text-white font-bold">NFT Information</h3>
                    </div>
                    <p className="text-white/70 text-sm">
                      This brawler is a unique NFT on Starknet. Once purchased, it will be transferred to your wallet.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <div className="text-lg font-bold text-white">Price:</div>
                  <PriceDisplay
                    price={brawler.price}
                    priceType={brawler.priceType}
                    discount={brawler.discount}
                  />
                </div>

                <div className="flex gap-3">
                  {onBuyNow && (
                    <Button
                      className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                      onClick={() => onBuyNow(brawler)}
                    >
                      Buy Now
                    </Button>
                  )}
                  {onAddToCart && (
                    <Button
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                      onClick={() => setShowConfirmModal(true)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {showConfirmModal && (
          <PurchaseConfirmationModal
            item={brawler}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={(confirmedItem) => {
              console.log("✅ Confirmed:", confirmedItem.name);
              setShowConfirmModal(false);
              onClose();
            }}
          />
        )}
      </>
    </AnimatePresence>
  );
}

export default BrawlerDetailsModal;
