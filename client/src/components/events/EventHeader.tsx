"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function EventHeader() {
  const navigate = useNavigate()
  const [notifications] = useState(3)

  return (
    <header className="bg-blue-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="mr-4 bg-yellow-500 hover:bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-900 transform rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Events</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications}
          </span>
        </div>
        <div className="bg-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
          <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="rounded-full" />
        </div>
      </div>
    </header>
  )
}

