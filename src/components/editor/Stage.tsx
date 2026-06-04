import { useCallback, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Magnet, Frame, Film } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { fmtTime, KIND_COLOR } from '@/lib/utils'
import { clipDur } from '@/lib/utils'

function PreviewCanvas() {
  const clips = useProjectStore((s) => s.clips)
  const assets = useProjectStore((s) => s.assets)
  const playhead = useProjectStore((s) => s.playhead)
  const safeGuides = useProjectStore((s) => s.safeGuides)
  const settings = useProjectStore((s) => s.settings)

  const active = clips
    .filter((c) => playhead >= c.start && playhead < c.start + clipDur(c) && c.kind !== 'audio')
    .sort((a, b) => a.trackId - b.trackId) // lower trackId renders on top

  return (
    <div
      className="relative bg-black rounded-lg overflow-hidden"
      style={{ width: 'min(100%, 720px)', aspectRatio: '16 / 9' }}
      role="img"
      aria-label={`Preview at ${fmtTime(playhead)}`}
    >
      {active.length === 0 && (
        <div className="absolute inset-0 grid place-items-center text-fg-faint text-xs">
          Add media to the timeline to preview
        </div>
      )}

      {active.map((c) => {
        const filter = [
          `brightness(${c.brightness}%)`,
          `contrast(${c.contrast}%)`,
          `saturate(${c.saturate}%)`,
          `blur(${c.blur}px)`,
          c.grayscale > 0 ? `grayscale(${c.grayscale}%)` : '',
          c.sepia > 0 ? `sepia(${c.sepia}%)` : '',
        ].filter(Boolean).join(' ')

        const transform = `translate(-50%,-50%) translate(${c.x}px,${c.y}px) scale(${c.scale / 100}) rotate(${c.rotate}deg)`
        const baseStyle: React.CSSProperties = {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform,
          opacity: c.opacity / 100,
          filter,
        }

        const asset = assets.find((a) => a.id === c.assetId)

        if (c.kind === 'text') {
          return (
            <div
              key={c.id}
              style={{
                ...baseStyle,
                color: c.textColor ?? '#fff',
                fontWeight: c.fontWeight ?? 800,
                fontSize: (c.fontSize ?? 64) * 0.42,
                textShadow: '0 2px 12px rgba(0,0,0,.5)',
                whiteSpace: 'nowrap',
              }}
            >
              {c.text}
            </div>
          )
        }

        if (c.kind === 'shape') {
          return (
            <div
              key={c.id}
              style={{
                ...baseStyle,
                width: '70%',
                height: 56,
                borderRadius: 8,
                background: 'rgba(199,165,255,0.75)',
              }}
            />
          )
        }

        // video / image placeholder
        return (
          <div
            key={c.id}
            style={{
              ...baseStyle,
              width: '78%',
              height: '78%',
              borderRadius: 6,
              background: 'rgba(12,22,32,0.9)',
              border: `1px solid ${KIND_COLOR.video}55`,
              display: 'grid',
              placeItems: 'center',
              color: KIND_COLOR.video,
            }}
          >
            <div className="text-center">
              <Film size={22} aria-hidden="true" />
              <p className="text-xs mt-1 text-fg-faint">{asset?.name ?? c.name}</p>
            </div>
          </div>
        )
      })}

      {/* Safe guides overlay */}
      {safeGuides && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ outline: '1px dashed rgba(255,255,255,0.18)', outlineOffset: '-8%' }}
          aria-hidden="true"
        />
      )}

      {/* Canvas size watermark */}
      <div className="absolute bottom-1 right-2 text-xs font-mono tabular-nums text-fg-faint/50 pointer-events-none" aria-hidden="true">
        {settings.width}×{settings.height}
      </div>
    </div>
  )
}

export function Stage() {
  const playhead = useProjectStore((s) => s.playhead)
  const isPlaying = useProjectStore((s) => s.isPlaying)
  const zoom = useProjectStore((s) => s.zoom)
  const snap = useProjectStore((s) => s.snap)
  const safeGuides = useProjectStore((s) => s.safeGuides)
  const clips = useProjectStore((s) => s.clips)
  const setPlayhead = useProjectStore((s) => s.setPlayhead)
  const setPlaying = useProjectStore((s) => s.setPlaying)
  const setZoom = useProjectStore((s) => s.setZoom)
  const setSnap = useProjectStore((s) => s.setSnap)
  const setSafeGuides = useProjectStore((s) => s.setSafeGuides)

  const duration = clips.reduce((m, c) => Math.max(m, c.start + clipDur(c)), 0) || 1

  // RAF playback loop
  const rafRef = useRef(0)
  const lastRef = useRef(0)

  const tick = useCallback(
    (now: number) => {
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now
      const store = useProjectStore.getState()
      const next = store.playhead + dt
      if (next >= duration) {
        store.setPlaying(false)
        store.setPlayhead(duration)
        return
      }
      store.setPlayhead(next)
      rafRef.current = requestAnimationFrame(tick)
    },
    [duration],
  )

  useEffect(() => {
    if (isPlaying) {
      lastRef.current = performance.now()
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, tick])

  return (
    <main className="flex-1 min-w-0 bg-surface flex flex-col">
      {/* Preview */}
      <div className="flex-1 min-h-0 grid place-items-center p-6">
        <PreviewCanvas />
      </div>

      {/* Transport bar — under preview (Jakob's Law convention for video editors) */}
      <div className="h-12 shrink-0 bg-surface-1 border-t border-border flex items-center gap-2 px-3">
        <IconButton
          aria-label="Go to start"
          icon={<SkipBack size={16} />}
          onClick={() => setPlayhead(0)}
        />
        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={() => setPlaying(!isPlaying)}
          className="h-9 w-9 grid place-items-center rounded-full bg-fg text-surface transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <IconButton
          aria-label="Go to end"
          icon={<SkipForward size={16} />}
          onClick={() => setPlayhead(duration)}
        />

        {/* Timecode */}
        <div className="px-2 font-mono tabular-nums text-sm" aria-live="off" aria-atomic="true">
          <span className="text-fg">{fmtTime(playhead)}</span>
          <span className="text-fg-faint"> / {fmtTime(duration)}</span>
        </div>

        <div className="flex-1" />

        {/* Timeline controls (zoom, snap, guides) */}
        <div className="flex items-center gap-1">
          <IconButton
            aria-label="Zoom out timeline"
            icon={<ZoomOut size={15} />}
            onClick={() => setZoom(zoom - 16)}
          />
          <span className="text-xs font-mono tabular-nums text-fg-faint w-10 text-center" aria-label="Zoom level">
            {zoom}px
          </span>
          <IconButton
            aria-label="Zoom in timeline"
            icon={<ZoomIn size={15} />}
            onClick={() => setZoom(zoom + 16)}
          />
          <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />
          <button
            onClick={() => setSnap(!snap)}
            aria-pressed={snap}
            className={[
              'h-8 px-2 rounded flex items-center gap-1.5 text-xs border transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              snap
                ? 'border-fg-dim text-fg bg-surface-2'
                : 'border-border text-fg-dim hover:bg-surface-2 hover:text-fg',
            ].join(' ')}
          >
            <Magnet size={14} aria-hidden="true" />
            Snap
          </button>
          <button
            onClick={() => setSafeGuides(!safeGuides)}
            aria-pressed={safeGuides}
            className={[
              'h-8 px-2 rounded flex items-center gap-1.5 text-xs border transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              safeGuides
                ? 'border-fg-dim text-fg bg-surface-2'
                : 'border-border text-fg-dim hover:bg-surface-2 hover:text-fg',
            ].join(' ')}
          >
            <Frame size={14} aria-hidden="true" />
            Guides
          </button>
        </div>
      </div>
    </main>
  )
}
