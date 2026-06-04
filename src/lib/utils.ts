export function fmtTime(s: number): string {
  s = Math.max(0, s)
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  const cs = Math.floor((s * 100) % 100)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

/** Clip's visual duration on the timeline (out - in). */
export function clipDur(clip: { in: number; out: number }): number {
  return clip.out - clip.in
}

/** Kind → signal color hex (data-viz exception; one hue = one meaning). */
export const KIND_COLOR: Record<string, string> = {
  video: '#58d3ff',
  image: '#58d3ff',
  audio: '#86e89f',
  text: '#f2cf67',
  shape: '#c7a5ff',
  overlay: '#c7a5ff',
}
export const PLAYHEAD_COLOR = '#ff856f'
