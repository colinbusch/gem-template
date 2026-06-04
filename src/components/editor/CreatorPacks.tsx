import { useEffect, useState } from 'react'
import { PanelBottom, AlertTriangle, RefreshCw } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { uid } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'

type PackKind = 'text' | 'shape' | 'overlay'
type CatalogStatus = 'loading' | 'loaded' | 'error'

interface Pack {
  id: string
  label: string
  kind: PackKind
}

// SAMPLE packs — clearly marked; Phase 6 loads from /api/catalog/packs
const SAMPLE_PACKS: Pack[] = [
  { id: 'p1', label: 'Clean titles',       kind: 'text' },
  { id: 'p2', label: 'Subscribe hook',     kind: 'shape' },
  { id: 'p3', label: 'Lower third',        kind: 'shape' },
  { id: 'p4', label: 'Minimal overlay',    kind: 'overlay' },
  { id: 'p5', label: 'Caption band',       kind: 'text' },
]

const KIND_FILTERS: { value: PackKind | null; label: string }[] = [
  { value: null,      label: 'All' },
  { value: 'text',    label: 'Text' },
  { value: 'shape',   label: 'Shape' },
  { value: 'overlay', label: 'Overlay' },
]

const pulse = 'bg-surface-2 animate-pulse motion-reduce:animate-none'

export function CreatorPacks() {
  const playhead   = useProjectStore((s) => s.playhead)
  const tracks     = useProjectStore((s) => s.tracks)
  const addClip    = useProjectStore((s) => s.addClip)
  const _pushHistory = useProjectStore((s) => s._pushHistory)

  const [status, setStatus]     = useState<CatalogStatus>('loading')
  const [packs, setPacks]       = useState<Pack[]>([])
  const [activeKind, setActiveKind] = useState<PackKind | null>(null)

  // Simulated catalog fetch — Phase 6 replaces with /api/catalog/packs
  useEffect(() => {
    setStatus('loading')
    const t = setTimeout(() => {
      // Simulate occasional fetch failure for demo purposes (never in tests)
      setPacks(SAMPLE_PACKS)
      setStatus('loaded')
    }, 900)
    return () => clearTimeout(t)
  }, [])

  const filtered = activeKind ? packs.filter((p) => p.kind === activeKind) : packs

  const handleInsert = (kind: TimelineClip['kind'], label: string) => {
    _pushHistory()
    const track = tracks.find((t) => t.kind === kind) ?? tracks[0]
    const newClip: TimelineClip = {
      id: uid(), kind, trackId: track.id, name: label,
      start: Math.round(playhead), in: 0, out: 3, speed: 1,
      x: 0, y: 0, scale: 100, rotate: 0, opacity: 100,
      volume: 100, muted: false, fit: 'contain', blend: 'source-over',
      brightness: 100, contrast: 100, saturate: 100, blur: 0, hue: 0,
      grayscale: 0, sepia: 0, cropL: 0, cropR: 0, cropT: 0, cropB: 0,
      fadeIn: 0, fadeOut: 0, chroma: false, keyColor: '#00ff00', keyThreshold: 0,
      text: kind === 'text' ? label : undefined, fontSize: 64,
    }
    addClip(newClip)
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-1.5" aria-label="Loading creator packs" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-12 rounded-md ${pulse}`} />
        ))}
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div
        role="alert"
        className="rounded border p-3 flex flex-col gap-2 text-xs"
        style={{ background: 'rgb(240 96 107 / 0.08)', borderColor: 'rgb(240 96 107 / 0.3)', color: '#f0606b' }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} aria-hidden="true" />
          <span>Couldn't load creator packs.</span>
        </div>
        <button
          onClick={() => {
            setStatus('loading')
            setTimeout(() => { setPacks(SAMPLE_PACKS); setStatus('loaded') }, 900)
          }}
          className="h-7 px-2 rounded border self-start flex items-center gap-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ borderColor: 'rgb(240 96 107 / 0.4)', color: '#f0606b' }}
        >
          <RefreshCw size={11} aria-hidden="true" />
          Retry
        </button>
      </div>
    )
  }

  // ── Loaded state ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-fg-faint">Sample packs — Phase 6 loads catalog</p>

      {/* Kind filters */}
      <div className="flex gap-1 flex-wrap" role="group" aria-label="Filter by kind">
        {KIND_FILTERS.map((f) => (
          <button
            key={String(f.value)}
            onClick={() => setActiveKind(f.value)}
            className={[
              'h-6 px-2 rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              activeKind === f.value
                ? 'bg-surface-2 text-fg border border-border-strong'
                : 'text-fg-dim border border-border hover:bg-surface-2 hover:text-fg',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Pack list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<PanelBottom size={18} />}
          title="No packs match"
          description={`No ${activeKind ?? ''} packs in the catalog.`}
        />
      ) : (
        <div className="flex flex-col gap-0.5">
          {filtered.map((p) => (
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
      )}
    </div>
  )
}
