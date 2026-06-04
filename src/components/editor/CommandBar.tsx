import { Upload, Type, Square, Zap, PanelBottom, Undo2, Redo2, Scissors, Copy, Trash2, Download, Loader2 } from 'lucide-react'
import { useProjectStore } from '@/store/project'
import { uid, clipDur } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'

function BarGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start shrink-0">
      <span className="text-xs uppercase tracking-wide text-fg-faint mb-0.5 pl-1">{label}</span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  )
}

function BarBtn({
  icon: Icon,
  onClick,
  disabled = false,
  children,
}: {
  icon: React.ElementType
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-8 px-2 rounded flex items-center gap-1.5 text-xs text-fg-dim hover:bg-surface-2 hover:text-fg disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon size={14} aria-hidden="true" />
      {children}
    </button>
  )
}

export function CommandBar({ onImport }: { onImport: () => void }) {
  const clips = useProjectStore((s) => s.clips)
  const tracks = useProjectStore((s) => s.tracks)
  const playhead = useProjectStore((s) => s.playhead)
  const selectedClipId = useProjectStore((s) => s.selectedClipId)
  const isExporting = useProjectStore((s) => s.isExporting)
  const assets = useProjectStore((s) => s.assets)

  const addClip = useProjectStore((s) => s.addClip)
  const removeClip = useProjectStore((s) => s.removeClip)
  const selectClip = useProjectStore((s) => s.selectClip)
  const undo = useProjectStore((s) => s.undo)
  const redo = useProjectStore((s) => s.redo)
  const _pushHistory = useProjectStore((s) => s._pushHistory)
  const _history = useProjectStore((s) => s._history)
  const _historyIdx = useProjectStore((s) => s._historyIdx)
  const setExporting = useProjectStore((s) => s.setExporting)
  const setExportState = useProjectStore((s) => s.setExportState)

  const selected = clips.find((c) => c.id === selectedClipId) ?? null
  const missingClips = clips.filter((c) => assets.find((a) => a.id === c.assetId && a.missing))

  const handleAddClip = (kind: TimelineClip['kind'], name: string) => {
    _pushHistory()
    const track = tracks.find((t) => t.accepts.includes(kind)) ?? tracks[0]
    const newClip: TimelineClip = {
      id: uid(), kind, trackId: track.id, name,
      start: Math.round(playhead), in: 0, out: 3, speed: 1,
      x: 0, y: 0, scale: 100, rotate: 0, opacity: 100,
      volume: 100, muted: false, fit: 'contain', blend: 'source-over',
      brightness: 100, contrast: 100, saturate: 100, blur: 0, hue: 0,
      grayscale: 0, sepia: 0, cropL: 0, cropR: 0, cropT: 0, cropB: 0,
      fadeIn: 0, fadeOut: 0, chroma: false, keyColor: '#00ff00', keyThreshold: 0,
      text: kind === 'text' ? 'New text' : undefined, fontSize: 64,
    }
    addClip(newClip)
    selectClip(newClip.id)
  }

  const handleSplit = () => {
    if (!selected) return
    if (playhead <= selected.start || playhead >= selected.start + clipDur(selected)) return
    _pushHistory()
    const leftOut = selected.in + (playhead - selected.start)
    const rightClip: TimelineClip = {
      ...selected,
      id: uid(),
      start: playhead,
      in: leftOut,
      out: selected.out,
    }
    // shorten left side
    useProjectStore.getState().updateClip(selected.id, { out: leftOut })
    addClip(rightClip)
    selectClip(rightClip.id)
  }

  const handleDuplicate = () => {
    if (!selected) return
    _pushHistory()
    const duped: TimelineClip = {
      ...selected,
      id: uid(),
      start: selected.start + clipDur(selected),
    }
    addClip(duped)
    selectClip(duped.id)
  }

  const handleDelete = () => {
    if (!selected) return
    removeClip(selected.id)
    // undo available via the 80-entry history (store handles it)
  }

  const handleExport = () => {
    if (missingClips.length) {
      setExportState('error')
      return
    }
    setExporting(true)
    setExportState('exporting')
    // TODO: Phase 9 — real MediaRecorder / FFmpeg WASM export
    let progress = 0
    const iv = setInterval(() => {
      progress = Math.min(100, progress + 7)
      if (progress >= 100) {
        clearInterval(iv)
        setExporting(false)
        setExportState('done')
      }
    }, 130)
  }

  const canUndo = _historyIdx > 0
  const canRedo = _historyIdx < _history.length - 1

  return (
    <div
      className="h-14 shrink-0 bg-surface-1 border-t border-border flex items-center gap-3 px-3 overflow-x-auto"
      role="toolbar"
      aria-label="Editor command bar"
    >
      <BarGroup label="Add">
        <BarBtn icon={Upload} onClick={onImport}>Import</BarBtn>
        <BarBtn icon={Type} onClick={() => handleAddClip('text', 'New text')}>Text</BarBtn>
        <BarBtn icon={Square} onClick={() => handleAddClip('shape', 'Shape')}>Shape</BarBtn>
        <BarBtn icon={Zap} onClick={() => handleAddClip('shape', 'Hook')}>Hook</BarBtn>
        <BarBtn icon={PanelBottom} onClick={() => handleAddClip('shape', 'Lower-third')}>Lower-third</BarBtn>
      </BarGroup>

      <div className="w-px h-8 bg-border shrink-0" aria-hidden="true" />

      <BarGroup label="Edit">
        <BarBtn icon={Undo2} onClick={undo} disabled={!canUndo}>Undo</BarBtn>
        <BarBtn icon={Redo2} onClick={redo} disabled={!canRedo}>Redo</BarBtn>
        <BarBtn icon={Scissors} onClick={handleSplit} disabled={!selected}>Split</BarBtn>
        <BarBtn icon={Copy} onClick={handleDuplicate} disabled={!selected}>Duplicate</BarBtn>
        {/* Delete is destructive — visually quieted, undo available via history */}
        <BarBtn icon={Trash2} onClick={handleDelete} disabled={!selected}>Delete</BarBtn>
      </BarGroup>

      <div className="flex-1" />

      {/* Export = the single accent (primary path to outcome) */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="h-9 px-4 rounded-md bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium flex items-center gap-2 disabled:opacity-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 shrink-0"
        aria-label={isExporting ? `Exporting…` : 'Export WebM'}
      >
        {isExporting
          ? <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          : <Download size={15} aria-hidden="true" />}
        {isExporting ? 'Exporting…' : 'Export WebM'}
      </button>
    </div>
  )
}
