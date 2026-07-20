import { useEffect, useRef, useState, useCallback } from 'react'
import { Search } from 'lucide-react'

export interface CommandItem {
  id: string
  label: string
  description?: string
  shortcut?: string
  group?: string
  onSelect: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  items: CommandItem[]
}

const CommandPalette = ({ open, onClose, items }: CommandPaletteProps) => {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()),
      )
    : items

  const confirm = useCallback(
    (item: CommandItem) => {
      item.onSelect()
      onClose()
      setQuery('')
      setActive(0)
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  if (!open) return null

  return (
    // scrim — backdrop-blur only as overlay scrim (manual exception)
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 backdrop-blur-sm bg-black/40"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-surface-1 shadow-elevate overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
          if (e.key === 'Enter' && filtered[active]) confirm(filtered[active])
          if (e.key === 'Escape') onClose()
        }}
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search size={14} className="text-fg-faint shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
            aria-label="Search commands"
          />
        </div>
        <ul
          className="max-h-72 overflow-y-auto py-1"
          role="listbox"
          aria-label="Commands"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-fg-faint">No commands found</li>
          )}
          {filtered.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === active}
              className={[
                'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors',
                i === active ? 'bg-surface-2' : 'hover:bg-surface-2',
              ].join(' ')}
              onClick={() => confirm(item)}
              onMouseEnter={() => setActive(i)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-fg">{item.label}</span>
                {item.description && (
                  <span className="text-xs text-fg-faint">{item.description}</span>
                )}
              </div>
              {item.shortcut && (
                <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-fg-faint">
                  {item.shortcut}
                </kbd>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { CommandPalette }
