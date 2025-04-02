"use client"

import { useNavigate } from "react-router-dom"

export default function SideMenu() {
  const navigate = useNavigate()

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
      <div className="flex flex-col space-y-4">
        <div
          className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer flex flex-col items-center justify-center"
          onClick={() => navigate("/shop")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4M20 12a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v2a2 2 0 002 2M20 12v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4"
            />
          </svg>
          <span className="text-xs text-white">SHOP</span>
        </div>
        <div
          className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer flex flex-col items-center justify-center"
          onClick={() => navigate("/brawlers")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-xs text-white">BRAWLERS</span>
        </div>
        <div
          className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
          onClick={() => navigate("/social")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-xs text-white">SOCIAL</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </div>
        </div>
        <div
          className="w-16 h-16 bg-yellow-500 hover:bg-yellow-400 rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
          onClick={() => navigate("/events")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-900 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-blue-900 font-bold">EVENTS</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            5
          </div>
        </div>
      </div>
    </div>
  )
}

