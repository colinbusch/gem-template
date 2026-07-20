import { useState } from 'react'
import { ChevronDown, ChevronRight, Package, Sparkles, X } from 'lucide-react'
import { Inspector } from './Inspector'
import { CreatorPacks } from './CreatorPacks'
import { AiAssistant } from './AiAssistant'
import { StatusRail } from './StatusRail'

function Collapsible({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full h-9 px-3 flex items-center gap-2 text-sm text-fg-dim hover:bg-surface-2 hover:text-fg transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-expanded={open}
      >
        {open
          ? <ChevronDown size={14} aria-hidden="true" />
          : <ChevronRight size={14} aria-hidden="true" />}
        <Icon size={14} aria-hidden="true" />
        <span className="font-medium">{title}</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

function RailContents({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {onClose && (
        <div className="flex items-center justify-end h-9 px-2 border-b border-border shrink-0">
          <button
            onClick={onClose}
            className="h-7 w-7 rounded grid place-items-center text-fg-dim hover:bg-surface-2 hover:text-fg transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close inspector"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-auto min-h-0">
        <Inspector />
        <Collapsible title="Creator packs" icon={Package}>
          <CreatorPacks />
        </Collapsible>
        <Collapsible title="AI assistant" icon={Sparkles}>
          <AiAssistant />
        </Collapsible>
      </div>
      <StatusRail />
    </>
  )
}

export interface RightRailProps {
  isNarrow: boolean
  isOpen: boolean
  onClose: () => void
}

export function RightRail({ isNarrow, isOpen, onClose }: RightRailProps) {
  if (isNarrow) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        {/* Slide-in drawer */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-72 bg-surface-1 border-l border-border flex flex-col shadow-elevate transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-label="Inspector and tools"
          aria-hidden={!isOpen}
          inert={!isOpen ? '' as unknown as boolean : undefined}
        >
          <RailContents onClose={onClose} />
        </aside>
      </>
    )
  }

  return (
    <aside
      className="w-72 shrink-0 bg-surface-1 border-l border-border flex flex-col min-h-0"
      aria-label="Inspector and tools"
    >
      <RailContents />
    </aside>
  )
}
