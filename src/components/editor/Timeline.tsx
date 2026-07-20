import { useEffect, useRef, useState } from 'react'
import { Film, AlertTriangle } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { KIND_COLOR, PLAYHEAD_COLOR, clipDur, clamp } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'

// ─── Constants ────────────────────────────────────────────────────────────────
const LABEL_W = 80   // px — sticky track-label column width
const RULER_H = 28   // px — ruler row height (h-7)
const LANE_H = 48    // px — each track lane height (h-12)
const BUFFER_S = 2   // seconds of extra rendering buffer past visible edge

// ─── Adaptive tick spacing ─────────────────────────────────────────────────────
// Returns tick interval in seconds such that ticks are at least MIN_TICK_PX apart.
const MIN_TICK_PX = 50
const NICE_INTERVALS = [0.5, 1, 2, 5, 10, 30, 60, 120, 300, 600]

function tickInterval(zoom: number): number {
  return NICE_INTERVALS.find((n) => n * zoom >= MIN_TICK_PX) ?? 600
}

// ─── Drag state (ref — no re-renders during drag) ─────────────────────────────
type DragMode = 'move' | 'left' | 'right'
interface DragRef {
  id: string
  mode: DragMode
  startX: number
  origStart: number
  origIn: number
  origOut: number
  trackId: number
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Timeline() {
  const clips      = useProjectStore((s) => s.clips)
  const tracks     = useProjectStore((s) => s.tracks)
  const assets     = useProjectStore((s) => s.assets)
  const zoom       = useProjectStore((s) => s.zoom)
  const snap       = useProjectStore((s) => s.snap)
  const playhead   = useProjectStore((s) => s.playhead)
  const selectedId = useProjectStore((s) => s.selectedClipId)

  const selectClip      = useProjectStore((s) => s.selectClip)
  const setPlayhead     = useProjectStore((s) => s.setPlayhead)
  const _pushHistory    = useProjectStore((s) => s._pushHistory)
  const _setClipLive    = useProjectStore((s) => s._setClipLive)

  // ── Scroll + container size (drives virtual window) ───────────────────────
  const scrollRef    = useRef<HTMLDivElement>(null)
  const [scrollLeft, setScrollLeft]     = useState(0)
  const [containerW, setContainerW]     = useState(800)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Drag ref (no useState — avoids re-renders per frame) ──────────────────
  const drag = useRef<DragRef | null>(null)

  // ── Derived values ─────────────────────────────────────────────────────────
  const duration   = clips.reduce((m, c) => Math.max(m, c.start + clipDur(c)), 0)
  const totalWidth = Math.max(duration, 8) * zoom + LABEL_W + 80

  const snapFn  = (v: number) => snap ? Math.round(v * 4) / 4 : v
  const interval = tickInterval(zoom)

  // Visible time window with buffer
  const visStart = scrollLeft / zoom - BUFFER_S
  const visEnd   = (scrollLeft + containerW) / zoom + BUFFER_S

  // Virtual ticks: only those in the visible window
  const firstTick = Math.max(0, Math.floor(visStart / interval) * interval)
  const lastTick  = Math.ceil(visEnd / interval) * interval
  const ticks: number[] = []
  for (let s = firstTick; s <= lastTick + interval; s += interval) {
    ticks.push(Math.round(s * 1000) / 1000) // avoid floating-point drift
  }

  // ── Clip drag ──────────────────────────────────────────────────────────────
  function onClipDown(e: React.PointerEvent, clip: TimelineClip, mode: DragMode) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    selectClip(clip.id)
    _pushHistory()           // one entry per gesture
    drag.current = {
      id: clip.id, mode,
      startX: e.clientX,
      origStart: clip.start,
      origIn: clip.in,
      origOut: clip.out,
      trackId: clip.trackId,
    }
  }

  function onClipMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d) return
    const dx = (e.clientX - d.startX) / zoom

    if (d.mode === 'move') {
      _setClipLive(d.id, { start: clamp(snapFn(d.origStart + dx), 0, Infinity) })
    } else if (d.mode === 'right') {
      const newOut = Math.max(d.origIn + 0.25, snapFn(d.origOut + dx))
      _setClipLive(d.id, { start: d.origStart, in: d.origIn, out: newOut })
    } else {
      // left trim: start moves, right edge stays fixed
      const ns    = clamp(snapFn(d.origStart + dx), 0, Infinity)
      const delta = ns - d.origStart
      const newOut = Math.max(d.origIn + 0.25, d.origOut - delta)
      _setClipLive(d.id, { start: ns, in: d.origIn, out: newOut })
    }
  }

  function onClipUp(e: React.PointerEvent) {
    e.currentTarget.releasePointerCapture(e.pointerId)
    drag.current = null
  }

  // ── Ruler scrub ────────────────────────────────────────────────────────────
  function onRulerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId)
    const el = scrollRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const calcTime = (clientX: number) => {
      const x = clientX - rect.left + el.scrollLeft - LABEL_W
      return clamp(x / zoom, 0, Infinity)
    }
    setPlayhead(calcTime(e.clientX))

    const onMove = (ev: PointerEvent) => setPlayhead(calcTime(ev.clientX))
    const onUp   = () => { e.currentTarget?.releasePointerCapture(e.pointerId); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // ── Empty state ────────────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-56 shrink-0 bg-surface-1 border-t border-border flex flex-col"
      role="region"
      aria-label="Timeline"
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative"
        style={{ overscrollBehaviorX: 'none' }}
        onScroll={(e) => setScrollLeft((e.currentTarget).scrollLeft)}
      >
        {/* Content width */}
        <div style={{ width: totalWidth, height: RULER_H + tracks.length * LANE_H }}>

          {/* ── Ruler ── */}
          <div
            className="sticky top-0 bg-surface-1 border-b border-border z-10 cursor-ew-resize select-none"
            style={{ height: RULER_H, marginLeft: LABEL_W }}
            onPointerDown={onRulerDown}
            role="slider"
            aria-label="Timeline ruler — drag to scrub"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={Math.round(playhead * 10) / 10}
          >
            <div className="relative h-full">
              {ticks.map((s) => (
                <div
                  key={s}
                  className="absolute top-0 h-full flex items-center border-l border-border text-xs font-mono tabular-nums text-fg-faint pl-1"
                  style={{ left: s * zoom }}
                  aria-hidden="true"
                >
                  {s % 1 === 0 ? `${s}s` : `${s.toFixed(1)}`}
                </div>
              ))}
            </div>
          </div>

          {/* ── Track lanes ── */}
          {tracks.map((track) => {
            const trackClips = clips.filter((c) => c.trackId === track.id)
            // Only render clips visible in the current scroll window
            const visClips = trackClips.filter((c) => {
              const end = c.start + clipDur(c)
              return end > visStart && c.start < visEnd
            })
            const color = KIND_COLOR[track.kind] ?? '#58d3ff'

            return (
              <div
                key={track.id}
                className="relative border-b border-border flex"
                style={{ height: LANE_H }}
                role="row"
                aria-label={track.label}
              >
                {/* Track label — sticky left */}
                <div
                  className="bg-surface-1 border-r border-border flex items-center gap-1.5 px-2 text-xs text-fg-dim sticky left-0 z-10 shrink-0"
                  style={{ width: LABEL_W, height: LANE_H }}
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {track.label}
                </div>

                {/* Clip blocks — positioned absolutely within the lane */}
                {visClips.map((c) => {
                  const dur      = clipDur(c)
                  const clipCol  = KIND_COLOR[c.kind] ?? '#58d3ff'
                  const isSel    = c.id === selectedId
                  const isMissing = !!assets.find((a) => a.id === c.assetId && a.missing)

                  return (
                    <div
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${c.name} (${c.kind})`}
                      aria-selected={isSel}
                      onPointerDown={(e) => onClipDown(e, c, 'move')}
                      onPointerMove={onClipMove}
                      onPointerUp={onClipUp}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectClip(c.id) }
                      }}
                      className="absolute top-1 bottom-1 rounded-md overflow-hidden cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{
                        left: LABEL_W + c.start * zoom,
                        width: Math.max(8, dur * zoom),
                        background: `${clipCol}22`,
                        border: `1px solid ${clipCol}`,
                        // selection ring uses the clip's signal color, not accent
                        boxShadow: isSel ? `0 0 0 2px ${clipCol}` : 'none',
                      }}
                    >
                      <div
                        className="h-full flex items-center px-2 gap-1 text-xs pointer-events-none"
                        style={{ color: clipCol }}
                      >
                        {isMissing && (
                          <AlertTriangle size={11} style={{ color: '#f0606b', flexShrink: 0 }} aria-label="Missing asset" />
                        )}
                        <span className="truncate">{c.name}</span>
                      </div>

                      {/* Left trim handle */}
                      <div
                        onPointerDown={(e) => { e.stopPropagation(); onClipDown(e, c, 'left') }}
                        onPointerMove={onClipMove}
                        onPointerUp={onClipUp}
                        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
                        style={{ background: clipCol }}
                        aria-hidden="true"
                      />
                      {/* Right trim handle */}
                      <div
                        onPointerDown={(e) => { e.stopPropagation(); onClipDown(e, c, 'right') }}
                        onPointerMove={onClipMove}
                        onPointerUp={onClipUp}
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
                        style={{ background: clipCol }}
                        aria-hidden="true"
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* ── Playhead ── spans ruler + all lanes, pointer-events-none ── */}
          <div
            className="absolute top-0 pointer-events-none z-20"
            style={{
              left: LABEL_W + playhead * zoom,
              width: 2,
              // bottom: 0 doesn't work inside overflow-hidden parent; use full content height
              height: RULER_H + tracks.length * LANE_H,
              background: PLAYHEAD_COLOR,
            }}
            aria-hidden="true"
          >
            {/* Downward triangle marker on the ruler */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: -4,
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `7px solid ${PLAYHEAD_COLOR}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
