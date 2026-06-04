import { useCallback, useEffect, useRef, useState } from 'react'
import { CommandPalette, ToastContainer, useToasts } from '@/components/ui'
import { BootSkeleton } from './BootSkeleton'
import { MenuBar } from './MenuBar'
import { WorkspaceBar } from './WorkspaceBar'
import { MediaBin } from './MediaBin'
import { Stage } from './Stage'
import { RightRail } from './RightRail'
import { CommandBar } from './CommandBar'
import { Timeline } from './Timeline'
import { useProjectStore } from '@/store/project'
import { loadFromOPFS } from '@/store/storage'
import { SAMPLE_ASSETS, SAMPLE_TRACKS, SAMPLE_CLIPS } from '@/lib/seed'
import { AlertTriangle } from 'lucide-react'
import type { CommandItem } from '@/components/ui'

function ExportFeedback() {
  const exportState    = useProjectStore((s) => s.exportState)
  const exportProgress = useProjectStore((s) => s.exportProgress)
  const assets         = useProjectStore((s) => s.assets)
  const clips          = useProjectStore((s) => s.clips)
  const markAssetMissing = useProjectStore((s) => s.markAssetMissing)
  const removeClip     = useProjectStore((s) => s.removeClip)
  const setExportState = useProjectStore((s) => s.setExportState)

  const missingClips = clips.filter((c) => assets.find((a) => a.id === c.assetId && a.missing))

  if (exportState === 'exporting') {
    return (
      <div className="h-1 bg-surface-2" role="progressbar" aria-label="Export progress" aria-valuenow={exportProgress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-accent transition-[width] duration-100 motion-reduce:transition-none"
          style={{ width: `${exportProgress}%` }}
        />
      </div>
    )
  }

  if (exportState === 'done') {
    return (
      <div
        role="status"
        className="px-3 py-1.5 flex items-center justify-between text-xs border-t"
        style={{ background: 'rgb(134 232 159 / 0.08)', color: '#86e89f', borderColor: 'rgb(134 232 159 / 0.3)' }}
      >
        <span>Export complete — WebM ready to download.</span>
        <button
          onClick={() => setExportState('idle')}
          className="h-6 px-2 rounded text-xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ borderColor: 'rgb(134 232 159 / 0.4)', color: '#86e89f' }}
        >
          Dismiss
        </button>
      </div>
    )
  }

  if (exportState === 'error' && missingClips.length > 0) {
    return (
      <div
        role="alert"
        className="px-3 py-2 flex items-center gap-3 text-xs border-t"
        style={{ background: 'rgb(240 96 107 / 0.08)', color: '#f0606b', borderColor: 'rgb(240 96 107 / 0.3)' }}
      >
        <AlertTriangle size={14} aria-hidden="true" />
        <span className="flex-1">
          Can't export — {missingClips.length} file{missingClips.length > 1 ? 's are' : ' is'} missing
          ({missingClips.map((c) => c.name).join(', ')}). Relink or remove to continue.
        </span>
        <button
          onClick={() => {
            assets.filter((a) => a.missing).forEach((a) => markAssetMissing(a.id, false))
            setExportState('idle')
          }}
          className="h-7 px-2 rounded text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ background: '#f0606b', color: '#fff' }}
        >
          Relink
        </button>
        <button
          onClick={() => {
            missingClips.forEach((c) => removeClip(c.id))
            setExportState('idle')
          }}
          className="h-7 px-2 rounded text-xs border border-border-strong text-fg-dim hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Remove
        </button>
      </div>
    )
  }

  return null
}

export function EditorShell() {
  const [booting, setBooting] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 1080)
  const [sideOpen, setSideOpen] = useState(false)
  const { toasts, push, dismiss } = useToasts()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Store actions for keyboard shortcuts
  const isPlaying = useProjectStore((s) => s.isPlaying)
  const selectedClipId = useProjectStore((s) => s.selectedClipId)
  const snap = useProjectStore((s) => s.snap)
  const setPlaying = useProjectStore((s) => s.setPlaying)
  const removeClip = useProjectStore((s) => s.removeClip)
  const undo = useProjectStore((s) => s.undo)
  const redo = useProjectStore((s) => s.redo)
  const setSnap = useProjectStore((s) => s.setSnap)

  // Boot: try OPFS, fall back to sample project
  useEffect(() => {
    const boot = async () => {
      const stored = await loadFromOPFS()
      if (!stored) {
        // Load sample data so the editor isn't blank on first run
        const store = useProjectStore.getState()
        if (store.assets.length === 0) SAMPLE_ASSETS.forEach((a) => store.addAsset(a))
        if (store.clips.length === 0) {
          // Replace default tracks with sample tracks
          Object.assign(store, { tracks: SAMPLE_TRACKS, clips: SAMPLE_CLIPS })
        }
      }
      setTimeout(() => setBooting(false), 700)
    }
    boot()
  }, [])

  // Narrow viewport detection (< 1080px collapses right rail)
  useEffect(() => {
    const update = () => {
      const narrow = window.innerWidth < 1080
      setIsNarrow(narrow)
      if (!narrow) setSideOpen(false)
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('hurrcut-theme', next ? 'dark' : 'light')
  }, [isDark])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      // ⌘K / Ctrl+K — always intercepted
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }

      if (typing) return

      if (e.code === 'Space') {
        e.preventDefault()
        setPlaying(!isPlaying)
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        redo()
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedClipId) {
        e.preventDefault()
        removeClip(selectedClipId)
        push({ message: 'Clip deleted', kind: 'info', action: { label: 'Undo', onClick: undo } })
      } else if (e.key === 'Escape') {
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPlaying, selectedClipId, setPlaying, removeClip, undo, redo, push])

  const paletteItems: CommandItem[] = [
    { id: 'import', label: 'Import media', description: 'Add files to the media bin', shortcut: '⌘I', onSelect: () => fileInputRef.current?.click() },
    { id: 'text', label: 'Add text clip', shortcut: 'T', onSelect: () => {} }, // wired via CommandBar
    { id: 'shape', label: 'Add shape clip', onSelect: () => {} },
    { id: 'split', label: 'Split clip at playhead', shortcut: 'S', onSelect: () => {} },
    { id: 'dup', label: 'Duplicate clip', onSelect: () => {} },
    { id: 'del', label: 'Delete clip', shortcut: '⌫', onSelect: () => { if (selectedClipId) { removeClip(selectedClipId); push({ message: 'Clip deleted', kind: 'info', action: { label: 'Undo', onClick: undo } }) } } },
    { id: 'snap', label: snap ? 'Disable snapping' : 'Enable snapping', shortcut: 'G', onSelect: () => setSnap(!snap) },
    { id: 'export', label: 'Export WebM', description: 'Primary export (⌘E)', onSelect: () => {} },
    { id: 'theme', label: isDark ? 'Switch to light mode' : 'Switch to dark mode', onSelect: toggleTheme },
    { id: 'undo', label: 'Undo', shortcut: '⌘Z', onSelect: undo },
    { id: 'redo', label: 'Redo', shortcut: '⌘⇧Z', onSelect: redo },
  ]

  if (booting) return <BootSkeleton />

  return (
    <div className="w-full h-screen bg-surface text-fg flex flex-col text-sm antialiased select-none overflow-hidden">
      {/* Row 1 — MenuBar 48px */}
      <MenuBar
        onPaletteOpen={() => setPaletteOpen(true)}
        onThemeToggle={toggleTheme}
        isDark={isDark}
        isNarrow={isNarrow}
        sideOpen={sideOpen}
        onSideToggle={() => setSideOpen((v) => !v)}
      />

      {/* Row 2 — WorkspaceBar */}
      <WorkspaceBar />

      {/* Row 3 — 3-col workspace */}
      <div className="flex-1 min-h-0 flex">
        <MediaBin />
        <Stage />
        <RightRail isNarrow={isNarrow} isOpen={sideOpen} onClose={() => setSideOpen(false)} />
      </div>

      {/* Export feedback (progress bar or error banner) */}
      <ExportFeedback />

      {/* Row 4 — CommandBar */}
      <CommandBar onImport={() => fileInputRef.current?.click()} />

      {/* Row 5 — Timeline */}
      <Timeline />

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,audio/*,image/*"
        className="sr-only"
        onChange={() => {}} // MediaBin owns the actual handler; this is a trigger proxy
        aria-label="Import media files"
      />

      {/* Toast container */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Command palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={paletteItems} />
    </div>
  )
}
