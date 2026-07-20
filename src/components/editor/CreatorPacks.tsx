import { useEffect, useState } from 'react'
import { PanelBottom, AlertTriangle, RefreshCw } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { fetchPacks } from '@/lib/catalog'
import { uid } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'
import type { CatalogPack, PackKind } from '@/lib/catalog'

type CatalogStatus = 'loading' | 'loaded' | 'error'

const KIND_FILTERS: { value: PackKind | null; label: string }[] = [
  { value: null,      label: 'All' },
  { value: 'text',    label: 'Text' },
  { value: 'shape',   label: 'Shape' },
  { value: 'overlay', label: 'Overlay' },
]

const pulse = 'bg-surface-2 animate-pulse motion-reduce:animate-none'

export function CreatorPacks() {
  const playhead      = useProjectStore((s) => s.playhead)
  const tracks        = useProjectStore((s) => s.tracks)
  const _pushHistory  = useProjectStore((s) => s._pushHistory)
  const addClipAction = useProjectStore((s) => s.addClip)
  const setAiJob      = useProjectStore((s) => s.setAiJob)

  const [status, setStatus]         = useState<CatalogStatus>('loading')
  const [packs, setPacks]           = useState<CatalogPack[]>([])
  const [activeKind, setActiveKind] = useState<PackKind | null>(null)

  const loadCatalog = () => {
    setStatus('loading')
    fetchPacks()
      .then((data) => { setPacks(data); setStatus('loaded') })
      .catch(() => setStatus('error'))
  }

  useEffect(loadCatalog, [])

  const filtered = activeKind ? packs.filter((p) => p.kind === activeKind) : packs

  const handleInsert = (pack: CatalogPack) => {
    const kind: TimelineClip['kind'] = pack.kind
    _pushHistory()
    const track = tracks.find((t) => t.kind === kind) ?? tracks[0]
    addClipAction({
      id: uid(), kind, trackId: track.id, name: pack.label,
      start: Math.round(playhead), in: 0, out: 3, speed: 1,
      x: 0, y: 0, scale: 100, rotate: 0, opacity: 100,
      volume: 100, muted: false, fit: 'contain', blend: 'source-over',
      brightness: 100, contrast: 100, saturate: 100, blur: 0, hue: 0,
      grayscale: 0, sepia: 0, cropL: 0, cropR: 0, cropT: 0, cropB: 0,
      fadeIn: 0, fadeOut: 0, chroma: false, keyColor: '#00ff00', keyThreshold: 0,
      text: kind === 'text' ? pack.label : undefined, fontSize: 64,
    })
  }

  const handlePlan = (pack: CatalogPack) => {
    // Set AI job to rough-cut-plan with the pack name as context
    // User can then open the AI assistant below and run it
    setAiJob('rough-cut-plan')
    // Scroll the right-rail so AI assistant is visible
    // (No forced scroll — user sees the job set in AI assistant section)
    void pack
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-1.5" aria-label="Loading creator packs" aria-busy="true">
        {[1, 2, 3].map((i) => <div key={i} className={`h-12 rounded-md ${pulse}`} />)}
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
          onClick={loadCatalog}
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
          description={`No ${activeKind ?? ''} packs available.`}
        />
      ) : (
        <div className="flex flex-col gap-0.5">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-md border border-border hover:bg-surface-2 transition-colors">
              <div className="flex items-center gap-2 p-1.5">
                <div
                  className="h-8 w-12 rounded grid place-items-center shrink-0 text-xs font-medium"
                  style={{ background: '#c7a5ff22', color: '#c7a5ff', border: '1px solid #c7a5ff44' }}
                  aria-hidden="true"
                >
                  <PanelBottom size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-fg truncate">{p.label}</p>
                  {p.description && <p className="text-xs text-fg-faint truncate">{p.description}</p>}
                </div>
              </div>
              <div className="flex gap-1 px-1.5 pb-1.5">
                <button
                  onClick={() => handleInsert(p)}
                  className="flex-1 h-6 rounded text-xs text-fg-dim border border-border hover:bg-surface hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Insert
                </button>
                <button
                  onClick={() => handlePlan(p)}
                  title="Set AI assistant to plan this pack"
                  className="flex-1 h-6 rounded text-xs text-fg-dim border border-border hover:bg-surface hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
