"use client"

import { useState } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({
    title,
    description,
    type = "success",
  }: {
    title: string
    description?: string
    type?: "success" | "error" | "warning" | "info"
  }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, type }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 3000)

    return id
  }

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return { toast, toasts, removeToast }
}

