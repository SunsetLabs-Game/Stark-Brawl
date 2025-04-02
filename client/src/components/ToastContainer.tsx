"use client"

import { useToast } from "@/hooks/useToast"

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slideIn ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : toast.type === "warning"
                ? "bg-yellow-500 text-yellow-900"
                : toast.type === "info"
                  ? "bg-blue-500 text-white"
                  : "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
          }`}
        >
          <div className="flex-1">
            <h4 className="font-bold">{toast.title}</h4>
            {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
      ))}
    </div>
  )
}

