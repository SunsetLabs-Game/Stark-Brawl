"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Sword, Volume2, VolumeX } from "lucide-react"
import { Game } from "@/game/game"

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<Game | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const game = new Game(canvas)
    gameRef.current = game
    game.start()

    return () => {
      game.stop()
    }
  }, [])

  const toggleSound = () => {
    if (gameRef.current) {
      gameRef.current.toggleSound()
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={800} height={600} className="block" tabIndex={0} />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={toggleSound}
          className="bg-gray-800 p-2 rounded-full text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="bg-gray-800 p-2 rounded-full text-white opacity-70 flex items-center gap-1">
          <Sword size={16} />
          <span className="text-xs">Click to attack</span>
        </div>
      </div>
    </div>
  )
}

export default GameCanvas
