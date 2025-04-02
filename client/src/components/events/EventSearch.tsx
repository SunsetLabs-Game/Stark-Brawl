"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function EventSearch({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto mb-6">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-blue-300" />
      </div>
      <Input
        type="text"
        placeholder="Search events..."
        className="pl-10 py-2 bg-blue-900/50 border-blue-700 text-white placeholder-blue-300 w-full rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="absolute inset-y-0 right-3 flex items-center">
        <div className="flex items-center gap-2">
          <span className="text-blue-300 text-sm">Filters</span>
          <div className="bg-blue-800 rounded p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

