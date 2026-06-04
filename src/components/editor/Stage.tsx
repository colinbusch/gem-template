import { useCallback, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Magnet, Frame } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { fmtTime, clipDur } from '@/lib/utils'
import { Renderer } from '@/lib/renderer'

export function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)

  const clips = useProjectStore((s) => s.clips)
  const assets = useProjectStore((s) => s.assets)
  const playhead = useProjectStore((s) => s.playhead)
  const settings = useProjectStore((s) => s.settings)
  const safeGuides = useProjectStore((s) => s.safeGuides)
  const isPlaying = useProjectStore((s) => s.isPlaying)
  const zoom = useProjectStore((s) => s.zoom)
  const snap = useProjectStore((s) => s.snap)
  const setPlayhead = useProjectStore((s) => s.setPlayhead)
  const setPlaying = useProjectStore((s) => s.setPlaying)
  const setZoom = useProjectStore((s) => s.setZoom)
  const setSnap = useProjectStore((s) => s.setSnap)
  const setSafeGuides = useProjectStore((s) => s.setSafeGuides)

  const duration = clips.reduce((m, c) => Math.max(m, c.start + clipDur(c)), 0) || 1
  const hasVisibleClips = clips.some(
    (c) => playhead >= c.start && playhead < c.start + clipDur(c) && c.kind !== 'audio',
  )

  const rafRef = useRef(0)
  const lastRef = useRef(0)

  // Create renderer once on mount; dispose on unmount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = settings.width
    canvas.height = settings.height
    const renderer = new Renderer(canvas)
    rendererRef.current = renderer
    const s = useProjectStore.getState()
    renderer.render(s.clips, s.assets, s.playhead, s.settings)
    return () => {
      renderer.dispose()
      rendererRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep canvas resolution in sync with project settings
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = settings.width
    canvas.height = settings.height
    const s = useProjectStore.getState()
    rendererRef.current?.render(s.clips, s.assets, s.playhead, s.settings)
  }, [settings.width, settings.height]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-render on any preview-relevant state change (scrub, clip edit, etc.)
  useEffect(() => {
    rendererRef.current?.render(clips, assets, playhead, settings)
  }, [clips, assets, playhead, settings])

  // Sync video element playback state when play/pause changes
  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) return
    const { clips: c, assets: a, playhead: ph } = useProjectStore.getState()
    for (const clip of c) {
      if (clip.kind !== 'video') continue
      const asset = a.find((x) => x.id === clip.assetId)
      if (!asset?.url) continue
      const el = renderer.getVideoEl(asset)
      if (isPlaying) {
        el.currentTime = Math.max(0, clip.in + (ph - clip.start) * clip.speed)
        el.play().catch(() => {})
      } else {
        el.pause()
        el.currentTime = Math.max(0, clip.in + (ph - clip.start) * clip.speed)
      }
    }
  }, [isPlaying])

  // RAF playback loop
  const tick = useCallback(
    (now: number) => {
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now
      const store = useProjectStore.getState()
      const next = store.playhead + dt
      if (next >= duration) {
        store.setPlaying(false)
        store.setPlayhead(duration)
        rendererRef.current?.render(store.clips, store.assets, duration, store.settings)
        return
      }
      store.setPlayhead(next)
      rendererRef.current?.render(store.clips, store.assets, next, store.settings)
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
        <div
          className="relative rounded-lg overflow-hidden"
          style={{ width: 'min(100%, 720px)', aspectRatio: '16 / 9', background: settings.bg }}
          role="img"
          aria-label={`Preview at ${fmtTime(playhead)}`}
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          {!hasVisibleClips && (
            <div className="absolute inset-0 grid place-items-center text-fg-faint text-xs pointer-events-none">
              Add media to the timeline to preview
            </div>
          )}

          {safeGuides && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ outline: '1px dashed rgba(255,255,255,0.18)', outlineOffset: '-8%' }}
              aria-hidden="true"
            />
          )}

          <div
            className="absolute bottom-1 right-2 text-xs font-mono tabular-nums pointer-events-none"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            aria-hidden="true"
          >
            {settings.width}×{settings.height}
          </div>
        </div>
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

        <div className="px-2 font-mono tabular-nums text-sm" aria-live="off" aria-atomic="true">
          <span className="text-fg">{fmtTime(playhead)}</span>
          <span className="text-fg-faint"> / {fmtTime(duration)}</span>
        </div>

        <div className="flex-1" />

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
