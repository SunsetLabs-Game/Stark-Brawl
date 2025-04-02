"use client"

import { motion } from "framer-motion"

export default function BrawlersLoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-purple-900 overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Yellow%20Black%20Brush%20Streetwear%20Brand%20Logo-zD8Md0oiJ9lER4AzNLlZFoV1UuXgLP.png"
          alt="Brawl Stars Logo"
          className="h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        />
      </motion.div>

      <div className="mt-8 w-64 h-4 bg-purple-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5 }}
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-white text-lg font-bold"
      >
        Loading brawlers...
      </motion.p>
    </div>
  )
}

