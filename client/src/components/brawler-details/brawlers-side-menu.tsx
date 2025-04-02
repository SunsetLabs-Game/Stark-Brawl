"use client"

import { ShoppingCart, Users, Gamepad2, Newspaper } from "lucide-react"

interface BrawlersSideMenuProps {
  onNavigate: (route: string) => void
}

export default function BrawlersSideMenu({ onNavigate }: BrawlersSideMenuProps) {
  return (
    <div className="absolute left-0 top-16 bottom-0 w-20 flex flex-col items-center pt-4 z-10">
      <div className="flex flex-col gap-4 items-center">
        <div
          className="w-16 h-16 bg-pink-600 hover:bg-pink-500 rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
          onClick={() => onNavigate("/shop")}
        >
          <ShoppingCart className="h-6 w-6 text-white mb-1" />
          <span className="text-xs text-white">SHOP</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            5
          </div>
        </div>

        <div
          className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
          onClick={() => onNavigate("/social")}
        >
          <Users className="h-6 w-6 text-white mb-1" />
          <span className="text-xs text-white">SOCIAL</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            17
          </div>
        </div>

        <div
          className="w-16 h-16 bg-orange-600 hover:bg-orange-500 rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
          onClick={() => onNavigate("/brawlers")}
        >
          <Gamepad2 className="h-6 w-6 text-white mb-1" />
          <span className="text-xs text-white">BRAWLERS</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            20
          </div>
        </div>

        <div
          className="w-16 h-16 bg-green-600 hover:bg-green-500 rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
          onClick={() => onNavigate("/events")}
        >
          <Newspaper className="h-6 w-6 text-white mb-1" />
          <span className="text-xs text-white">EVENTS</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </div>
        </div>
      </div>
    </div>
  )
}

