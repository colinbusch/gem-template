import { HardDrive, RefreshCw } from 'lucide-react'

export function WorkspaceBar() {
  return (
    <div className="h-9 shrink-0 bg-surface-1 border-b border-border flex items-center justify-between px-3 text-xs text-fg-faint">
      <div className="flex items-center gap-2">
        <HardDrive size={13} aria-hidden="true" />
        <span>Workspace</span>
        <span className="text-fg-dim">Local · OPFS</span>
      </div>
      <div className="flex items-center gap-2">
        <RefreshCw size={13} aria-hidden="true" />
        <span>Folder sync</span>
        <span className="text-fg-dim font-mono">~/.hurrcut</span>
        {/* TODO: Phase 9 — real FSA sync status */}
        <span className="text-signal-ok">in sync</span>
      </div>
    </div>
  )
}
