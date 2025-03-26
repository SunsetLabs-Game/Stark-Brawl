"use client";

import type React from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import { Gem, Coins, Gift, Wallet } from "lucide-react";

interface ItemImageProps {
  item: {
    category: string;
    name: string;
    image: string;
    rarity?: string;
    tokenId?: string;
  };
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function ItemImage({
  item,
  size = "md",
  animate = false,
}: ItemImageProps) {
  const dimensions = {
    sm: {
      width: 60,
      height: 60,
      iconSize: "h-8 w-8",
      containerSize: "h-16 w-16",
      textSize: "text-xs",
    },
    md: {
      width: 120,
      height: 120,
      iconSize: "h-16 w-16",
      containerSize: "h-32 w-32",
      textSize: "text-xs",
    },
    lg: {
      width: 200,
      height: 200,
      iconSize: "h-24 w-24",
      containerSize: "h-48 w-48",
      textSize: "text-sm",
    },
  };

  const { width, height, iconSize, containerSize, textSize } = dimensions[size];

  const MotionWrapper = animate
    ? ({ children }: { children: React.ReactNode }) => (
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {children}
        </motion.div>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          {children}
        </motion.div>
      );

  return (
    <MotionWrapper>
      {item.category === "gems" ? (
        <div
          className={`flex items-center justify-center ${containerSize} bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-full`}
        >
          <Gem className={`${iconSize} text-pink-400`} />
          <div
            className={`absolute top-0 right-0 bg-green-500 text-white ${textSize} px-2 py-0.5 rounded-full`}
          >
            {item.name.split(" ").pop()}
          </div>
        </div>
      ) : item.category === "coins" ? (
        <div
          className={`flex items-center justify-center ${containerSize} bg-gradient-to-br from-yellow-500/30 to-amber-600/30 rounded-full`}
        >
          <Coins className={`${iconSize} text-yellow-400`} />
          <div
            className={`absolute top-0 right-0 bg-green-500 text-white ${textSize} px-2 py-0.5 rounded-full`}
          >
            {item.name.split(" ").pop()}
          </div>
        </div>
      ) : item.category === "special" ? (
        <div
          className={`flex items-center justify-center ${containerSize} bg-gradient-to-br from-blue-500/30 to-green-600/30 rounded-full`}
        >
          <Gift className={`${iconSize} text-blue-400`} />
          <div
            className={`absolute top-0 right-0 bg-green-500 text-white ${textSize} px-2 py-0.5 rounded-full`}
          >
            {item.name.includes("Starter") ? "STARTER" : "SPECIAL"}
          </div>
        </div>
      ) : item.category === "bundles" && item.rarity === "legendary" ? (
        <div
          className={`flex items-center justify-center ${containerSize} bg-gradient-to-br from-yellow-400/50 to-amber-700/50 rounded-full border-2 border-yellow-300`}
        >
          <Gift className={`${iconSize} text-yellow-300`} />
          <div
            className={`absolute top-0 right-0 bg-yellow-500 text-yellow-900 ${textSize} px-2 py-0.5 rounded-full font-bold`}
          >
            LEGENDARY
          </div>
        </div>
      ) : (
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={width}
          height={height}
          className={`object-contain ${size === "md" ? "h-32" : ""} ${
            animate ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : ""
          }`}
        />
      )}
      {item.tokenId && (
        <div
          className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-yellow-900 ${textSize} px-2 py-0.5 rounded-full font-bold ${
            size === "lg" ? "flex items-center" : ""
          }`}
        >
          {size === "lg" && <Wallet className="h-4 w-4 mr-1" />}
          {item.tokenId}
        </div>
      )}
    </MotionWrapper>
  );
}
