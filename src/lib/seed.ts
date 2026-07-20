// SAMPLE DATA — clearly marked; used only when no OPFS project exists.
// Do not use real names or real figures (manual §3 anti-pattern #2).
import type { MediaAsset, TimelineClip, Track } from '@/store/types'

export const SAMPLE_ASSETS: MediaAsset[] = [
  { id: 'a1', name: 'intro-hook.mp4', type: 'video', mime: 'video/mp4', size: 14_800_000, duration: 4, width: 1920, height: 1080 },
  { id: 'a2', name: 'screen-record-01.mp4', type: 'video', mime: 'video/mp4', size: 42_000_000, duration: 9, width: 1920, height: 1080 },
  { id: 'a3', name: 'bg-music.mp3', type: 'audio', mime: 'audio/mpeg', size: 3_200_000, duration: 30 },
  { id: 'a4', name: 'logo-outro.png', type: 'image', mime: 'image/png', size: 88_000, duration: 3, missing: true },
]

export const SAMPLE_TRACKS: Track[] = [
  { id: 1, label: 'Text', kind: 'text', accepts: ['text'] },
  { id: 2, label: 'Overlay', kind: 'overlay', accepts: ['shape', 'overlay'] },
  { id: 3, label: 'Video', kind: 'video', accepts: ['video', 'image'] },
  { id: 4, label: 'Audio', kind: 'audio', accepts: ['audio'] },
]

function mkClip(o: Partial<TimelineClip> & Pick<TimelineClip, 'id' | 'kind' | 'trackId' | 'start' | 'in' | 'out' | 'name'>): TimelineClip {
  return {
    x: 0, y: 0, scale: 100, rotate: 0, opacity: 100,
    volume: 100, muted: false, fit: 'contain', blend: 'source-over',
    brightness: 100, contrast: 100, saturate: 100, blur: 0, hue: 0,
    grayscale: 0, sepia: 0,
    cropL: 0, cropR: 0, cropT: 0, cropB: 0,
    fadeIn: 0, fadeOut: 0,
    chroma: false, keyColor: '#00ff00', keyThreshold: 0,
    speed: 1,
    ...o,
  }
}

export const SAMPLE_CLIPS: TimelineClip[] = [
  mkClip({ id: 'c1', kind: 'video', trackId: 3, assetId: 'a1', name: 'intro-hook.mp4', start: 0, in: 0, out: 4 }),
  mkClip({ id: 'c2', kind: 'video', trackId: 3, assetId: 'a2', name: 'screen-record-01.mp4', start: 4, in: 0, out: 9 }),
  mkClip({ id: 'c6', kind: 'image', trackId: 3, assetId: 'a4', name: 'logo-outro.png', start: 13, in: 0, out: 3 }),
  mkClip({ id: 'c3', kind: 'text', trackId: 1, name: 'Welcome to HurrCut', start: 1, in: 0, out: 3, text: 'Welcome to HurrCut', fontSize: 72 }),
  mkClip({ id: 'c4', kind: 'shape', trackId: 2, name: 'Lower third', start: 4, in: 0, out: 4, opacity: 90 }),
  mkClip({ id: 'c5', kind: 'audio', trackId: 4, assetId: 'a3', name: 'bg-music.mp3', start: 0, in: 0, out: 13, volume: 55 }),
]
