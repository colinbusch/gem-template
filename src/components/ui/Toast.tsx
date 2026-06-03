import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'

export type ToastKind = 'info' | 'success' | 'error' | 'warn'

export interface ToastData {
  id: string
  message: string
  kind?: ToastKind
  action?: { label: string; onClick: () => void }
  duration?: number
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void
}

const kindClasses: Record<ToastKind, string> = {
  info: 'border-border',
  success: 'border-signal-ok/40',
  error: 'border-signal-error/40',
  warn: 'border-signal-warn/40',
}

const Toast = ({ id, message, kind = 'info', action, duration = 4500, onDismiss }: ToastProps) => {
  const dismiss = useCallback(() => onDismiss(id), [id, onDismiss])

  useEffect(() => {
    const t = setTimeout(dismiss, duration)
    return () => clearTimeout(t)
  }, [dismiss, duration])

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'flex items-center gap-3 min-w-64 max-w-sm rounded border bg-surface-1 px-3 py-2.5 shadow-elevate',
        kindClasses[kind],
      ].join(' ')}
    >
      <p className="flex-1 text-sm text-fg">{message}</p>
      {action && (
        <button
          onClick={() => { action.onClick(); dismiss() }}
          className="text-xs font-medium text-accent hover:text-accent-hover shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {action.label}
        </button>
      )}
      <IconButton
        aria-label="Dismiss"
        icon={<X size={14} />}
        size="sm"
        onClick={dismiss}
        className="-mr-1"
      />
    </div>
  )
}

// Global toast container — renders in bottom-right
interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export { Toast, ToastContainer }
export type { ReactNode }
