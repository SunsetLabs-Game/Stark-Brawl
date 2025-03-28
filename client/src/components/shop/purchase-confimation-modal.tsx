"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShopItem } from "./@types/shop-types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  item: ShopItem;
  onClose: () => void;
  onConfirm: (item: ShopItem) => void;
}

export const PurchaseConfirmationModal = ({ item, onClose, onConfirm }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-purple-900 to-fuchsia-900 rounded-xl p-6 w-full max-w-md border-2 border-pink-500/50 text-white shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Confirm Purchase</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/80 mb-6">
            Are you sure you want to purchase{" "}
            <span className="font-semibold text-white">{item.name}</span> for{" "}
            <span className="font-semibold text-pink-400">
              {item.price} {item.priceType === "eth" ? "ETH" : "coins"}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              className="text-white hover:text-red-400"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => onConfirm(item)}
            >
              Confirm
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
