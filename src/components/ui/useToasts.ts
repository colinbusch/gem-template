import { useState, useCallback } from 'react'
import type { ToastData } from './Toast'

let _id = 0

export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const push = useCallback((toast: Omit<ToastData, 'id'>): string => {
    const id = String(++_id)
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }])
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, push, dismiss } as const
}
