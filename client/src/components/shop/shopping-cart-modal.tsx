"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { PriceDisplay } from "./price-display";
import type { ShopItem } from "./@types/shop-types";

interface ShoppingCartModalProps {
  show: boolean;
  items: ShopItem[];
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export function ShoppingCartModal({
  show,
  items,
  onClose,
  onRemoveItem,
  onCheckout,
}: ShoppingCartModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-end z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="bg-gradient-to-br from-purple-900 to-fuchsia-900 h-full w-full max-w-md p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 text-white mr-2" />
                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
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

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-16 w-16 text-white/30 mb-4" />
                <p className="text-white/70 text-lg mb-6">Your cart is empty</p>
                <Button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="bg-white/10 rounded-lg p-3 flex items-center"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain mr-3"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-bold">{item.name}</h3>
                        <div className="flex justify-between items-center">
                          <PriceDisplay
                            price={item.price}
                            priceType={item.priceType}
                            discount={item.discount}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => onRemoveItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">Subtotal</span>
                    <span className="text-white font-bold">
                      {items.reduce((total, item) => {
                        if (item.priceType === "gems")
                          return total + item.price;
                        return total;
                      }, 0)}{" "}
                      Gems
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">ETH Items</span>
                    <span className="text-white font-bold">
                      {items.reduce((total, item) => {
                        if (item.priceType === "eth") return total + item.price;
                        return total;
                      }, 0)}{" "}
                      ETH
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/70">USD Items</span>
                    <span className="text-white font-bold">
                      $
                      {items
                        .reduce((total, item) => {
                          if (item.priceType === "usd")
                            return total + item.price;
                          return total;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-6 text-lg font-bold"
                  onClick={onCheckout}
                >
                  Checkout
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
