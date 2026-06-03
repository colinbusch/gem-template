import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  suffix?: ReactNode
}

const Field = ({ label, error, hint, optional = false, suffix, className = '', onBlur, ...props }: FieldProps) => {
  const [touched, setTouched] = useState(false)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="flex items-center gap-1 text-xs font-medium text-fg-dim">
        {label}
        {optional && <span className="text-fg-faint">(optional)</span>}
      </label>
      <div className="relative flex items-center">
        <input
          className={[
            'h-8 w-full rounded border bg-surface px-2 text-sm text-fg transition-colors',
            'placeholder:text-fg-faint',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
            touched && error
              ? 'border-signal-error'
              : 'border-border hover:border-border-strong',
            suffix ? 'pr-8' : '',
          ].join(' ')}
          onBlur={(e) => {
            setTouched(true)
            onBlur?.(e)
          }}
          {...props}
        />
        {suffix && (
          <span className="absolute right-2 text-xs text-fg-faint select-none">{suffix}</span>
        )}
      </div>
      {touched && error && (
        <p className="text-xs text-signal-error">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs text-fg-faint">{hint}</p>
      )}
    </div>
  )
}

interface NumberFieldProps extends Omit<FieldProps, 'onChange' | 'value'> {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

const NumberField = ({ value, onValueChange, min, max, step = 1, unit, ...props }: NumberFieldProps) => {
  return (
    <Field
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const v = parseFloat(e.target.value)
        if (!isNaN(v)) onValueChange(v)
      }}
      suffix={unit}
      className={`[&_input]:font-mono [&_input]:tabular-nums ${props.className ?? ''}`}
      {...props}
    />
  )
}

export { Field, NumberField }
