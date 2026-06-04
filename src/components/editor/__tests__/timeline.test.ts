import { describe, it, expect } from 'vitest'
import { clipDur, clamp } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'

function makeClip(overrides: Partial<TimelineClip> = {}): TimelineClip {
  return {
    id: 'test-1', kind: 'video', trackId: 1, name: 'Test',
    start: 0, in: 0, out: 5, speed: 1,
    x: 0, y: 0, scale: 100, rotate: 0, opacity: 100,
    volume: 100, muted: false, fit: 'contain', blend: 'source-over',
    brightness: 100, contrast: 100, saturate: 100, blur: 0, hue: 0,
    grayscale: 0, sepia: 0, cropL: 0, cropR: 0, cropT: 0, cropB: 0,
    fadeIn: 0, fadeOut: 0, chroma: false, keyColor: '#00ff00', keyThreshold: 0,
    fontSize: 64,
    ...overrides,
  }
}

describe('clipDur', () => {
  it('returns out - in', () => {
    expect(clipDur(makeClip({ in: 0, out: 5 }))).toBe(5)
    expect(clipDur(makeClip({ in: 2, out: 7 }))).toBe(5)
    expect(clipDur(makeClip({ in: 1.5, out: 3.25 }))).toBeCloseTo(1.75)
  })

  it('returns 0 for zero-length clip', () => {
    expect(clipDur(makeClip({ in: 3, out: 3 }))).toBe(0)
  })
})

describe('clamp', () => {
  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('passes through values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(0, 0, 10)).toBe(0)
    expect(clamp(10, 0, 10)).toBe(10)
  })
})

describe('snap-to-quarter-second', () => {
  const snapFn = (v: number) => Math.round(v * 4) / 4

  it('snaps to nearest 0.25s', () => {
    expect(snapFn(0.1)).toBe(0)
    expect(snapFn(0.2)).toBe(0.25)
    expect(snapFn(1.1)).toBe(1)
    expect(snapFn(1.4)).toBe(1.5)
    expect(snapFn(2.9)).toBe(3)
  })

  it('leaves exact quarter values unchanged', () => {
    expect(snapFn(0)).toBe(0)
    expect(snapFn(0.25)).toBe(0.25)
    expect(snapFn(0.5)).toBe(0.5)
    expect(snapFn(0.75)).toBe(0.75)
    expect(snapFn(1)).toBe(1)
  })
})

describe('trim-left geometry', () => {
  // Left trim: start moves right, right edge (start + dur) stays fixed.
  // delta = newStart - origStart
  // newOut = max(origIn + 0.25, origOut - delta)
  it('trimming left edge inward shortens duration', () => {
    const orig = makeClip({ start: 2, in: 0, out: 5 })
    const dx = 1 // dragged 1s right
    const ns = clamp(orig.start + dx, 0, Infinity)
    const delta = ns - orig.start
    const newOut = Math.max(orig.in + 0.25, orig.out - delta)
    expect(ns).toBe(3)
    expect(newOut).toBe(4)
    expect(newOut - orig.in).toBe(4) // new visual duration
  })

  it('trim left cannot push start below 0', () => {
    const orig = makeClip({ start: 1, in: 0, out: 5 })
    const dx = -5 // dragged far left, past zero
    const ns = clamp(orig.start + dx, 0, Infinity)
    expect(ns).toBe(0)
  })

  it('trim left respects minimum 0.25s duration', () => {
    const orig = makeClip({ start: 0, in: 0, out: 0.5 })
    const dx = 0.4 // would make duration < 0.25
    const ns = clamp(orig.start + dx, 0, Infinity)
    const delta = ns - orig.start
    const newOut = Math.max(orig.in + 0.25, orig.out - delta)
    expect(newOut).toBe(0.25)
  })
})

describe('trim-right geometry', () => {
  // Right trim: adjusts out only; start stays fixed.
  // newOut = max(origIn + 0.25, origOut + dx)
  it('trimming right edge outward extends duration', () => {
    const orig = makeClip({ start: 0, in: 0, out: 5 })
    const dx = 2
    const newOut = Math.max(orig.in + 0.25, orig.out + dx)
    expect(newOut).toBe(7)
  })

  it('trimming right edge inward shortens duration', () => {
    const orig = makeClip({ start: 0, in: 0, out: 5 })
    const dx = -2
    const newOut = Math.max(orig.in + 0.25, orig.out + dx)
    expect(newOut).toBe(3)
  })

  it('trim right respects minimum 0.25s duration', () => {
    const orig = makeClip({ start: 0, in: 0, out: 5 })
    const dx = -10 // way past the minimum
    const newOut = Math.max(orig.in + 0.25, orig.out + dx)
    expect(newOut).toBe(0.25)
  })
})
