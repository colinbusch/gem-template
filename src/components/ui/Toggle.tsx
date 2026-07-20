import type { InputHTMLAttributes } from 'react'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  size?: 'sm' | 'md'
}

const Toggle = ({ label, size = 'md', className = '', ...props }: ToggleProps) => {
  const track = size === 'sm'
    ? 'h-4 w-7 after:h-3 after:w-3 after:left-0.5 checked:after:translate-x-3'
    : 'h-5 w-9 after:h-4 after:w-4 after:left-0.5 checked:after:translate-x-4'

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        {...props}
      />
      <span
        className={[
          'relative block rounded-full bg-surface-2 border border-border transition-colors',
          'peer-checked:bg-accent peer-checked:border-accent',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface',
          'after:absolute after:top-0.5 after:rounded-full after:bg-fg-faint after:transition-transform',
          'peer-checked:after:bg-accent-fg',
          track,
        ].join(' ')}
      />
      {label && <span className="text-sm text-fg-dim">{label}</span>}
    </label>
  )
}

export { Toggle }
