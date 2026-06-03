import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // aria-label is required — icon-only buttons must have accessible text
  'aria-label': string
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  tooltip?: string
}

const sizeClasses = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', active = false, tooltip, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        title={tooltip ?? props['aria-label']}
        className={[
          'inline-flex items-center justify-center rounded transition-colors select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
          active
            ? 'text-fg bg-surface-2'
            : 'text-fg-dim hover:text-fg hover:bg-surface-2',
          'disabled:opacity-40 disabled:pointer-events-none',
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {icon}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'

export { IconButton }
