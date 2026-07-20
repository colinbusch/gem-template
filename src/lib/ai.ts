// AI job service — separation boundary between UI and backend calls.
// Phase 6: all jobs return stub results. Phase 6+ wires real backends.
// Never call these synchronously from render; always await in an effect/handler.

import { AI_JOB_COSTS } from '@/store/types'
import type { AiJobKind, MediaAsset } from '@/store/types'

export interface AiJobContext {
  notes?: string
  assets?: MediaAsset[]
}

export interface AiJobResult {
  output: string
}

export class InsufficientCreditsError extends Error {
  constructor(public readonly needed: number, public readonly have: number) {
    super(`Need ${needed} credits, have ${have}`)
    this.name = 'InsufficientCreditsError'
  }
}

// Scripted attribution summary — reads asset names, no model call
function scriptedAttributionSummary(assets: MediaAsset[]): string {
  if (assets.length === 0) return 'No media assets found in this project.'
  const lines = assets.map((a) => {
    const src = a.sourceName ? `Source: ${a.sourceName}` : 'Source: imported file'
    return `${a.name} — ${a.type} · ${src}`
  })
  return [
    '# Attribution summary',
    '',
    ...lines,
    '',
    'Written to attributions.md on export.',
  ].join('\n')
}

// Stub results for non-scripted jobs (Phase 6 connects real backends)
const STUB_RESULTS: Record<AiJobKind, string> = {
  'caption-cleanup':
    '✓ 14 captions normalized\n• Removed 6 filler words\n• Fixed 3 timing overlaps\n• Sentence-cased 14 lines',
  'rough-cut-plan':
    'Suggested structure:\n1. Hook (0–5 s) — intro clip\n2. Problem (5–30 s) — context\n3. Solution (30–90 s) — main content\n4. CTA (90–100 s) — subscribe prompt',
  'publish-package':
    'Title: "How to [topic] in 2 minutes"\nDescription: [2-sentence summary]\nTags: tutorial, howto, shorts\nChapters: 00:00 Intro · 00:30 Main · 01:30 Wrap',
  'broll-search-prompts':
    '1. close-up hands typing, soft window light\n2. screen UI macro, shallow depth of field\n3. coffee shop ambient, slow lateral pan',
  'attribution-summary': '',  // handled by scriptedAttributionSummary
  'project-assistant':
    'Based on your project structure, I suggest:\n• Move audio to start 0.5 s before the main clip\n• Add a title text clip at t=0 (2 s)\n• Fade out the last clip over 1 s',
}

// Simulated latencies (ms) per job — mimic real backend variance
const LATENCIES: Record<AiJobKind, number> = {
  'caption-cleanup': 900,
  'rough-cut-plan': 1400,
  'publish-package': 1100,
  'broll-search-prompts': 700,
  'attribution-summary': 300,
  'project-assistant': 1600,
}

export async function runAiJob(
  job: AiJobKind,
  ctx: AiJobContext = {},
  credits: number,
): Promise<AiJobResult> {
  const cost = AI_JOB_COSTS[job]
  if (credits < cost) throw new InsufficientCreditsError(cost, credits)

  await new Promise((r) => setTimeout(r, LATENCIES[job]))

  const output =
    job === 'attribution-summary'
      ? scriptedAttributionSummary(ctx.assets ?? [])
      : STUB_RESULTS[job]

  return { output }
}
