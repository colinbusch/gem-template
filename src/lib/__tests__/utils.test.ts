import { describe, it, expect } from 'vitest'
import { fmtTime, uid, clamp, clipDur, KIND_COLOR, PLAYHEAD_COLOR } from '@/lib/utils'

describe('fmtTime', () => {
  it('formats zero correctly', () => {
    expect(fmtTime(0)).toBe('00:00.00')
  })

  it('formats seconds under one minute', () => {
    expect(fmtTime(5.5)).toBe('00:05.50')
    expect(fmtTime(59.99)).toBe('00:59.99') // floor(59.99 * 100) % 100 = 99
  })

  it('formats minutes correctly', () => {
    expect(fmtTime(60)).toBe('01:00.00')
    expect(fmtTime(90)).toBe('01:30.00')
    expect(fmtTime(125.25)).toBe('02:05.25')
  })

  it('clamps negative input to zero', () => {
    expect(fmtTime(-1)).toBe('00:00.00')
  })
})

describe('uid', () => {
  it('produces a non-empty string', () => {
    expect(typeof uid()).toBe('string')
    expect(uid().length).toBeGreaterThan(0)
  })

  it('produces unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, uid))
    expect(ids.size).toBe(100)
  })
})

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it('returns min when below', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
  })
  it('returns max when above', () => {
    expect(clamp(11, 0, 10)).toBe(10)
  })
  it('handles equal min/max', () => {
    expect(clamp(5, 3, 3)).toBe(3)
  })
})

describe('clipDur', () => {
  it('returns out minus in', () => {
    expect(clipDur({ in: 0, out: 5 })).toBe(5)
    expect(clipDur({ in: 2, out: 7 })).toBe(5)
    expect(clipDur({ in: 0, out: 0 })).toBe(0)
  })
  it('handles fractional values', () => {
    expect(clipDur({ in: 1.5, out: 3.75 })).toBeCloseTo(2.25)
  })
})

describe('KIND_COLOR', () => {
  it('has entries for all clip kinds', () => {
    for (const kind of ['video', 'image', 'audio', 'text', 'shape', 'overlay']) {
      expect(KIND_COLOR[kind]).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})

describe('PLAYHEAD_COLOR', () => {
  it('is a valid hex color', () => {
    expect(PLAYHEAD_COLOR).toMatch(/^#[0-9a-f]{6}$/i)
  })
})
