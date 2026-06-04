import { useRef } from 'react'
import { Film, AlertTriangle } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { KIND_COLOR, PLAYHEAD_COLOR, clipDur, clamp } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'

type DragMode = 'move' | 'left' | 'right'
interface DragRef {
  id: string
  mode: DragMode
  startX: number
  origStart: number
  origIn: number
  origOut: number
}

const LABEL_W = 80 // px — sticky left track-label column

export function Timeline() {
  const clips = useProjectStore((s) => s.clips)
  const tracks = useProjectStore((s) => s.tracks)
  const assets = useProjectStore((s) => s.assets)
  const zoom = useProjectStore((s) => s.zoom)
  const snap = useProjectStore((s) => s.snap)
  const playhead = useProjectStore((s) => s.playhead)

  const selectClip = useProjectStore((s) => s.selectClip)
  const selectedClipId = useProjectStore((s) => s.selectedClipId)
  const setPlayhead = useProjectStore((s) => s.setPlayhead)
  const moveClip = useProjectStore((s) => s.moveClip)
  const trimClip = useProjectStore((s) => s.trimClip)
  const _pushHistory = useProjectStore((s) => s._pushHistory)

  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragRef | null>(null)

  const duration = clips.reduce((m, c) => Math.max(m, c.start + clipDur(c)), 0)
  const totalWidth = Math.max(duration, 8) * zoom + LABEL_W + 80

  const snapTo = (v: number) => snap ? Math.round(v * 4) / 4 : v

  // ── Clip drag ──────────────────────────────────────────────────────────────
  const onClipDown = (e: React.PointerEvent, clip: TimelineClip, mode: DragMode) => {
    e.stopPropagation()
    selectClip(clip.id)
    _pushHistory()
    drag.current = {
      id: clip.id,
      mode,
      startX: e.clientX,
      origStart: clip.start,
      origIn: clip.in,
      origOut: clip.out,
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onMove = (e: PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = (e.clientX - d.startX) / zoom

    if (d.mode === 'move') {
      moveClip(d.id, clamp(snapTo(d.origStart + dx), 0, Infinity))
    } else if (d.mode === 'right') {
      const newOut = Math.max(d.origIn + 0.25, snapTo(d.origOut + dx))
      trimClip(d.id, { start: d.origStart, in: d.origIn, out: newOut })
    } else if (d.mode === 'left') {
      const ns = clamp(snapTo(d.origStart + dx), 0, Infinity)
      const delta = ns - d.origStart
      const newIn = d.origIn // in-point stays — trimming start adjusts out to keep duration
      const newOut = Math.max(newIn + 0.25, d.origOut - delta)
      trimClip(d.id, { start: ns, in: newIn, out: newOut })
    }
  }

  const onUp = () => {
    drag.current = null
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }

  // ── Ruler scrub ────────────────────────────────────────────────────────────
  const onRulerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const move = (ev: PointerEvent) => {
      const x = ev.clientX - rect.left + el.scrollLeft - LABEL_W
      setPlayhead(clamp(x / zoom, 0, Infinity))
    }
    move(e.nativeEvent)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // ── Ruler ticks ────────────────────────────────────────────────────────────
  const ticks: number[] = []
  for (let s = 0; s <= Math.ceil(duration) + 1; s++) ticks.push(s)

  if (clips.length === 0) {
    return (
      <div className="h-56 shrink-0 bg-surface-1 border-t border-border flex items-center justify-center">
        <EmptyState
          icon={<Film size={20} />}
          title="Timeline is empty"
          description="Add media from the Media bin or use the Add bar above."
        />
      </div>
    )
  }

  return (
    <div
      className="h-56 shrink-0 bg-surface-1 border-t border-border flex flex-col"
      role="region"
      aria-label="Timeline"
    >
      <div ref={scrollRef} className="flex-1 overflow-auto relative" style={{ overscrollBehaviorX: 'none' }}>
        <div style={{ width: totalWidth, minHeight: '100%' }}>

          {/* Ruler */}
          <div
            className="h-7 sticky top-0 bg-surface-1 border-b border-border z-10 cursor-ew-resize select-none"
            onPointerDown={onRulerDown}
            role="scrollbar"
            aria-label="Timeline ruler — drag to scrub"
            aria-orientation="horizontal"
          >
            <div className="relative h-full" style={{ marginLeft: LABEL_W }}>
              {ticks.map((s) => (
                <div
                  key={s}
                  className="absolute top-0 h-full text-xs font-mono tabular-nums text-fg-faint border-l border-border pl-1 flex items-center"
                  style={{ left: s * zoom }}
                  aria-hidden="true"
                >
                  {s}s
                </div>
              ))}
            </div>
          </div>

          {/* Track lanes */}
          {tracks.map((track) => {
            const trackClips = clips.filter((c) => c.trackId === track.id)
            const color = KIND_COLOR[track.kind] ?? '#58d3ff'
            return (
              <div
                key={track.id}
                className="h-12 border-b border-border relative flex"
                role="row"
                aria-label={track.label}
              >
                {/* Track label — sticky left */}
                <div
                  className="w-20 shrink-0 bg-surface-1 border-r border-border flex items-center gap-1.5 px-2 text-xs text-fg-dim sticky left-0 z-10"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {track.label}
                </div>

                {/* Clips */}
                <div className="relative flex-1">
                  {trackClips.map((c) => {
                    const dur = clipDur(c)
                    const clipColor = KIND_COLOR[c.kind] ?? '#58d3ff'
                    const isSel = c.id === selectedClipId
                    const isMissing = !!assets.find((a) => a.id === c.assetId && a.missing)

                    return (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${c.name} — ${c.kind} clip`}
                        aria-selected={isSel}
                        onPointerDown={(e) => onClipDown(e, c, 'move')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectClip(c.id) } }}
                        className="absolute top-1 bottom-1 rounded-md overflow-hidden cursor-grab active:cursor-grabbing focus-visible:outline-none"
                        style={{
                          left: c.start * zoom,
                          width: Math.max(8, dur * zoom),
                          background: `${clipColor}22`,
                          border: `1px solid ${clipColor}`,
                          boxShadow: isSel ? `0 0 0 2px ${clipColor}` : 'none',
                        }}
                      >
                        <div className="h-full flex items-center px-2 gap-1 text-xs" style={{ color: clipColor }}>
                          {isMissing && (
                            <AlertTriangle size={11} style={{ color: '#f0606b', flexShrink: 0 }} aria-label="Missing asset" />
                          )}
                          <span className="truncate">{c.name}</span>
                        </div>
                        {/* Trim handle — left */}
                        <div
                          onPointerDown={(e) => { e.stopPropagation(); onClipDown(e, c, 'left') }}
                          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize"
                          style={{ background: clipColor }}
                          aria-hidden="true"
                        />
                        {/* Trim handle — right */}
                        <div
                          onPointerDown={(e) => { e.stopPropagation(); onClipDown(e, c, 'right') }}
                          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize"
                          style={{ background: clipColor }}
                          aria-hidden="true"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Playhead — spans full height, pointer-events-none */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-20"
            style={{ left: LABEL_W + playhead * zoom, width: 2, background: PLAYHEAD_COLOR }}
            aria-hidden="true"
          >
            {/* Arrow marker */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: -4,
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `6px solid ${PLAYHEAD_COLOR}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
