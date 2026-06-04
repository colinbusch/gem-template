import { PanelBottom } from 'lucide-react'
import { useProjectStore } from '@/store/project'
import { uid } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'

// SAMPLE packs — clearly marked; catalog comes from /api/catalog/* in Phase 6
const SAMPLE_PACKS = [
  { id: 'p1', label: 'Clean titles', kind: 'text' as const },
  { id: 'p2', label: 'Subscribe hooks', kind: 'shape' as const },
  { id: 'p3', label: 'Lower thirds', kind: 'shape' as const },
]

export function CreatorPacks() {
  const clips = useProjectStore((s) => s.clips)
  const playhead = useProjectStore((s) => s.playhead)
  const tracks = useProjectStore((s) => s.tracks)
  const addClip = useProjectStore((s) => s.addClip)
  const _pushHistory = useProjectStore((s) => s._pushHistory)

  const handleInsert = (kind: TimelineClip['kind'], label: string) => {
    _pushHistory()
    const track = tracks.find((t) => t.kind === kind) ?? tracks[0]
    const newClip: TimelineClip = {
      id: uid(),
      kind,
      trackId: track.id,
      name: label,
      start: Math.round(playhead),
      in: 0,
      out: 3,
      speed: 1,
      x: 0, y: 0, scale: 100, rotate: 0, opacity: 100,
      volume: 100, muted: false,
      fit: 'contain', blend: 'source-over',
      brightness: 100, contrast: 100, saturate: 100, blur: 0, hue: 0,
      grayscale: 0, sepia: 0,
      cropL: 0, cropR: 0, cropT: 0, cropB: 0,
      fadeIn: 0, fadeOut: 0,
      chroma: false, keyColor: '#00ff00', keyThreshold: 0,
      text: kind === 'text' ? label : undefined,
      fontSize: 64,
    }
    addClip(newClip)
  }

  void clips // Phase 6: filter packs by project context

  return (
    <div className="flex flex-col gap-0.5">
      {/* TODO: Phase 6 — load from /api/catalog/packs; add kind filters */}
      <p className="text-xs text-fg-faint px-1 pb-1">Sample packs — Phase 6 loads catalog</p>
      {SAMPLE_PACKS.map((p) => (
        <div key={p.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-2">
          <div
            className="h-8 w-12 rounded grid place-items-center shrink-0"
            style={{ background: '#c7a5ff', color: '#1c1430' }}
            aria-hidden="true"
          >
            <PanelBottom size={14} />
          </div>
          <span className="flex-1 text-sm text-fg truncate">{p.label}</span>
          <button
            onClick={() => handleInsert(p.kind, p.label)}
            className="h-7 px-2 rounded text-xs text-fg-dim border border-border hover:bg-surface hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
          >
            Insert
          </button>
        </div>
      ))}
    </div>
  )
}
