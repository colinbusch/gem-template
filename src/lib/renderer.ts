import type { TimelineClip, MediaAsset, ProjectSettings } from '@/store/types'
import { clipDur } from '@/lib/utils'

function mediaTimeForClip(clip: TimelineClip, playhead: number): number {
  return Math.max(0, clip.in + (playhead - clip.start) * clip.speed)
}

function buildFilter(c: TimelineClip): string {
  const parts: string[] = []
  if (c.brightness !== 100) parts.push(`brightness(${c.brightness}%)`)
  if (c.contrast !== 100) parts.push(`contrast(${c.contrast}%)`)
  if (c.saturate !== 100) parts.push(`saturate(${c.saturate}%)`)
  if (c.blur > 0) parts.push(`blur(${c.blur}px)`)
  if (c.hue !== 0) parts.push(`hue-rotate(${c.hue}deg)`)
  if (c.grayscale > 0) parts.push(`grayscale(${c.grayscale}%)`)
  if (c.sepia > 0) parts.push(`sepia(${c.sepia}%)`)
  return parts.length > 0 ? parts.join(' ') : 'none'
}

// Source/dest rects for contain / cover / fill with crop support.
// All dest coords are relative to the transform origin (canvas center after transform).
function calcDrawRects(
  srcW: number,
  srcH: number,
  canvasW: number,
  canvasH: number,
  fit: TimelineClip['fit'],
  cropL: number,
  cropR: number,
  cropT: number,
  cropB: number,
) {
  const cL = (cropL / 100) * srcW
  const cR = (cropR / 100) * srcW
  const cT = (cropT / 100) * srcH
  const cB = (cropB / 100) * srcH
  const croppedW = Math.max(1, srcW - cL - cR)
  const croppedH = Math.max(1, srcH - cT - cB)

  if (fit === 'fill') {
    return { sx: cL, sy: cT, sw: croppedW, sh: croppedH, dx: -canvasW / 2, dy: -canvasH / 2, dw: canvasW, dh: canvasH }
  }

  const srcAR = croppedW / croppedH
  const dstAR = canvasW / canvasH

  if (fit === 'contain') {
    const dw = srcAR > dstAR ? canvasW : canvasH * srcAR
    const dh = srcAR > dstAR ? canvasW / srcAR : canvasH
    return { sx: cL, sy: cT, sw: croppedW, sh: croppedH, dx: -dw / 2, dy: -dh / 2, dw, dh }
  }

  // cover — expand source crop to fill canvas
  const sw = srcAR > dstAR ? croppedH * dstAR : croppedW
  const sh = srcAR > dstAR ? croppedH : croppedW / dstAR
  return {
    sx: cL + (croppedW - sw) / 2,
    sy: cT + (croppedH - sh) / 2,
    sw,
    sh,
    dx: -canvasW / 2,
    dy: -canvasH / 2,
    dw: canvasW,
    dh: canvasH,
  }
}

export class Renderer {
  readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  readonly videoPool: Map<string, HTMLVideoElement> = new Map()
  private readonly imageCache: Map<string, HTMLImageElement> = new Map()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    this.ctx = ctx
  }

  getVideoEl(asset: MediaAsset): HTMLVideoElement {
    let el = this.videoPool.get(asset.id)
    if (!el) {
      el = document.createElement('video')
      el.preload = 'auto'
      el.muted = true
      el.playsInline = true
      if (asset.url) el.src = asset.url
      this.videoPool.set(asset.id, el)
    }
    return el
  }

  private getImageEl(asset: MediaAsset): HTMLImageElement {
    let el = this.imageCache.get(asset.id)
    if (!el) {
      el = new Image()
      if (asset.url) el.src = asset.url
      this.imageCache.set(asset.id, el)
    }
    return el
  }

  // Seek all active video clips to the correct media time; resolves when all seeks complete.
  seekAll(clips: TimelineClip[], assets: MediaAsset[], playhead: number): Promise<void> {
    const promises: Promise<void>[] = []
    for (const clip of clips) {
      if (clip.kind !== 'video') continue
      const asset = assets.find((a) => a.id === clip.assetId)
      if (!asset?.url) continue
      const el = this.getVideoEl(asset)
      const t = mediaTimeForClip(clip, playhead)
      if (Math.abs(el.currentTime - t) < 0.017) continue
      promises.push(
        new Promise<void>((resolve) => {
          const cleanup = () => {
            el.removeEventListener('seeked', cleanup)
            el.removeEventListener('error', cleanup)
            resolve()
          }
          el.addEventListener('seeked', cleanup)
          el.addEventListener('error', cleanup)
          el.currentTime = t
        }),
      )
    }
    return Promise.all(promises).then(() => undefined)
  }

  render(clips: TimelineClip[], assets: MediaAsset[], playhead: number, settings: ProjectSettings): void {
    const { width: W, height: H, bg } = settings
    const ctx = this.ctx

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Lower trackId renders first (underneath); audio clips are not visible
    const active = clips
      .filter((c) => playhead >= c.start && playhead < c.start + clipDur(c) && c.kind !== 'audio')
      .sort((a, b) => a.trackId - b.trackId)

    for (const clip of active) {
      const asset = clip.assetId ? assets.find((a) => a.id === clip.assetId) : undefined
      this.drawClip(ctx, clip, asset, W, H, playhead)
    }
  }

  private drawClip(
    ctx: CanvasRenderingContext2D,
    clip: TimelineClip,
    asset: MediaAsset | undefined,
    W: number,
    H: number,
    playhead: number,
  ): void {
    ctx.save()

    // Compute fade-adjusted alpha
    const elapsed = playhead - clip.start
    const remaining = clip.start + clipDur(clip) - playhead
    let alpha = clip.opacity / 100
    if (clip.fadeIn > 0 && elapsed < clip.fadeIn) alpha *= elapsed / clip.fadeIn
    else if (clip.fadeOut > 0 && remaining < clip.fadeOut) alpha *= remaining / clip.fadeOut
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha))

    ctx.globalCompositeOperation = clip.blend

    const filter = buildFilter(clip)
    if (filter !== 'none') ctx.filter = filter

    // Transform origin = canvas center + clip offset
    ctx.translate(W / 2 + clip.x, H / 2 + clip.y)
    ctx.rotate((clip.rotate * Math.PI) / 180)
    ctx.scale(clip.scale / 100, clip.scale / 100)

    if (clip.kind === 'text') {
      this.drawText(ctx, clip)
    } else if (clip.kind === 'shape') {
      this.drawShape(ctx, clip, W, H)
    } else if (clip.kind === 'video' && asset?.url) {
      const el = this.getVideoEl(asset)
      if (el.readyState >= 2) {
        const srcW = el.videoWidth || asset.width || 1920
        const srcH = el.videoHeight || asset.height || 1080
        const r = calcDrawRects(srcW, srcH, W, H, clip.fit, clip.cropL, clip.cropR, clip.cropT, clip.cropB)
        ctx.drawImage(el, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh)
      }
    } else if ((clip.kind === 'image' || clip.kind === 'overlay') && asset?.url) {
      const el = this.getImageEl(asset)
      if (el.complete && el.naturalWidth > 0) {
        const srcW = el.naturalWidth
        const srcH = el.naturalHeight
        const r = calcDrawRects(srcW, srcH, W, H, clip.fit, clip.cropL, clip.cropR, clip.cropT, clip.cropB)
        ctx.drawImage(el, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh)
      }
    }

    ctx.restore()
  }

  private drawText(ctx: CanvasRenderingContext2D, clip: TimelineClip): void {
    const text = clip.text ?? ''
    const fontSize = clip.fontSize ?? 64
    const fontWeight = clip.fontWeight ?? 800
    const fontFamily = clip.fontFamily ?? 'system-ui, sans-serif'
    const color = clip.textColor ?? '#ffffff'
    const align = (clip.textAlign ?? 'center') as CanvasTextAlign
    const lineH = fontSize * (clip.textLineHeight ?? 1.2)

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.textAlign = align
    ctx.textBaseline = 'middle'

    const lines = text.split('\n')
    lines.forEach((line, i) => {
      const yOff = (i - (lines.length - 1) / 2) * lineH
      if (clip.textBackground) {
        const metrics = ctx.measureText(line)
        const pad = clip.textPadding ?? 8
        const bx = align === 'center' ? -metrics.width / 2 - pad : -pad
        ctx.fillStyle = clip.textBackground
        if (clip.textBorderRadius) {
          ctx.beginPath()
          ctx.roundRect(bx, yOff - fontSize / 2 - pad, metrics.width + pad * 2, fontSize + pad * 2, clip.textBorderRadius)
          ctx.fill()
        } else {
          ctx.fillRect(bx, yOff - fontSize / 2 - pad, metrics.width + pad * 2, fontSize + pad * 2)
        }
      }
      ctx.fillStyle = color
      ctx.fillText(line, 0, yOff)
    })
  }

  private drawShape(ctx: CanvasRenderingContext2D, clip: TimelineClip, W: number, H: number): void {
    const kind = clip.shapeKind ?? 'rect'
    const color = clip.shapeColor ?? 'rgba(199,165,255,0.75)'
    const borderColor = clip.shapeBorderColor
    const borderWidth = clip.shapeBorderWidth ?? 0
    const cornerRadius = clip.shapeCornerRadius ?? 0
    const shapeW = W * 0.5
    const shapeH = H * 0.1

    ctx.fillStyle = color
    ctx.beginPath()
    if (kind === 'ellipse') {
      ctx.ellipse(0, 0, shapeW / 2, shapeH / 2, 0, 0, Math.PI * 2)
    } else if (cornerRadius > 0) {
      ctx.roundRect(-shapeW / 2, -shapeH / 2, shapeW, shapeH, cornerRadius)
    } else {
      ctx.rect(-shapeW / 2, -shapeH / 2, shapeW, shapeH)
    }
    ctx.fill()

    if (borderColor && borderWidth > 0) {
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.stroke()
    }
  }

  dispose(): void {
    for (const el of this.videoPool.values()) {
      el.pause()
      el.src = ''
      el.load()
    }
    this.videoPool.clear()
    this.imageCache.clear()
  }
}
