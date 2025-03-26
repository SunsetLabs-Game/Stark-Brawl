"use client";

import { motion } from "framer-motion";
import type { ShopItem } from "./@types/shop-types";

interface BrawlerImageProps {
  brawler: ShopItem;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function BrawlerImage({
  brawler,
  size = "md",
  animate = false,
}: BrawlerImageProps) {
  // Controla el ancho/alto según size
  const dimensions = {
    sm: { width: 60, height: 60 },
    md: { width: 120, height: 120 },
    lg: { width: 200, height: 200 },
  };
  const { width, height } = dimensions[size];

  // Wrapper para animación
  const MotionWrapper = animate
    ? ({ children }: { children: React.ReactNode }) => (
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
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
      <img
        src={brawler.image || "/placeholder.svg"}
        alt={brawler.name}
        width={width}
        height={height}
        style={{ objectFit: "contain" }} 
        className={`rounded ${
          animate ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : ""
        }`}
      />
    </MotionWrapper>
  );
}