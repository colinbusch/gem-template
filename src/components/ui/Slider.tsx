import type { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  unit?: string
  // value must be a number for the tabular-nums display
  value: number
  min?: number
  max?: number
  step?: number
}

const Slider = ({ label, unit = '', value, min = 0, max = 100, step = 1, className = '', ...props }: SliderProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs text-fg-dim font-medium">{label}</label>
        <span className="text-xs font-mono tabular-nums text-fg-dim">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        className={[
          'h-1 w-full cursor-pointer appearance-none rounded-full bg-surface-2',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fg',
          '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
        ].join(' ')}
        {...props}
      />
    </div>
  )
}

export { Slider }
