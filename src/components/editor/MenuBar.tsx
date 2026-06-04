import { Scissors, Command, Sun, Moon, CircleUser, Check } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { useProjectStore } from '@/store/project'

interface MenuBarProps {
  onPaletteOpen: () => void
  onThemeToggle: () => void
  isDark: boolean
}

const MENUS = ['File', 'Edit', 'Project'] as const

export function MenuBar({ onPaletteOpen, onThemeToggle, isDark }: MenuBarProps) {
  const projectName = useProjectStore((s) => s.settings.name)

  return (
    <header className="h-12 shrink-0 bg-surface-1 border-b border-border flex items-center gap-1 px-2">
      {/* Brand */}
      <div className="flex items-center gap-2 pr-2 shrink-0">
        <div
          className="h-7 w-7 rounded-md grid place-items-center text-[#06121a]"
          style={{ background: '#58d3ff' }}
          aria-hidden="true"
        >
          <Scissors size={15} strokeWidth={2.5} />
        </div>
        <span className="font-semibold tracking-tight text-fg">HurrCut</span>
      </div>

      {/* App menus */}
      <nav aria-label="App menus" className="flex items-center">
        {MENUS.map((m) => (
          <button
            key={m}
            className="h-8 px-2.5 rounded-md text-sm text-fg-dim hover:bg-surface-2 hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {m}
          </button>
        ))}
      </nav>

      {/* Project chip */}
      <div className="flex-1 flex justify-center px-4">
        <div className="h-8 px-3 rounded-md border border-border flex items-center gap-2 max-w-xs">
          <span className="text-sm text-fg truncate">{projectName}</span>
          <span className="flex items-center gap-1 text-xs text-fg-faint shrink-0">
            <Check size={11} className="text-signal-ok" />
            saved
          </span>
        </div>
      </div>

      {/* Right controls */}
      <IconButton
        aria-label="Open command palette"
        tooltip="Command palette (⌘K)"
        icon={
          <span className="flex items-center gap-1 text-xs text-fg-dim px-1">
            <Command size={13} />K
          </span>
        }
        onClick={onPaletteOpen}
        className="border border-border"
      />
      <IconButton
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        icon={isDark ? <Sun size={15} /> : <Moon size={15} />}
        onClick={onThemeToggle}
      />
      <IconButton
        aria-label="Account"
        icon={<CircleUser size={18} />}
      />
    </header>
  )
}
