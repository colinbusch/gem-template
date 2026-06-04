import { Sparkles, Loader2 } from 'lucide-react'
import { useProjectStore } from '@/store/project'
import { AI_JOB_COSTS } from '@/store/types'
import type { AiJobKind } from '@/store/types'

const JOB_OPTIONS: { id: AiJobKind; label: string }[] = [
  { id: 'caption-cleanup', label: 'Caption cleanup' },
  { id: 'rough-cut-plan', label: 'Rough-cut plan' },
  { id: 'publish-package', label: 'Publish package' },
  { id: 'broll-search-prompts', label: 'B-roll search prompts' },
  { id: 'attribution-summary', label: 'Attribution summary' },
  { id: 'project-assistant', label: 'Project assistant' },
]

// Scripted results for offline/stub jobs (Phase 6 connects real backends)
const STUB_RESULTS: Partial<Record<AiJobKind, string>> = {
  'caption-cleanup': '✓ 14 captions normalized\n• Removed 6 filler words\n• Fixed 3 timing overlaps\n• Sentence-cased 14 lines',
  'broll-search-prompts': '1. close-up hands typing, soft window light\n2. screen UI macro, shallow depth\n3. coffee shop ambient, slow pan',
  'attribution-summary': 'bg-music.mp3 — "Particles" by Kevin MacLeod, CC BY 4.0\nWritten to attributions.md on export.',
}

export function AiAssistant() {
  const aiJob = useProjectStore((s) => s.aiJob)
  const aiRunning = useProjectStore((s) => s.aiRunning)
  const aiResult = useProjectStore((s) => s.aiResult)
  const aiCredits = useProjectStore((s) => s.aiCredits)
  const setAiJob = useProjectStore((s) => s.setAiJob)
  const setAiRunning = useProjectStore((s) => s.setAiRunning)
  const setAiResult = useProjectStore((s) => s.setAiResult)

  const selectedJob = aiJob ?? 'caption-cleanup'
  const cost = AI_JOB_COSTS[selectedJob]
  const hasCredits = aiCredits >= cost

  const handleRun = () => {
    if (!hasCredits) return
    setAiRunning(true)
    setAiResult(null)
    // TODO: Phase 6 — call real backend for project-assistant (DeepSeek), scripted for attribution-summary
    setTimeout(() => {
      setAiRunning(false)
      setAiResult(STUB_RESULTS[selectedJob] ?? 'Plan ready. Review suggested cuts in the timeline.')
    }, 1100)
  }

  const insufficientCredits = !hasCredits && !aiRunning

  return (
    <div className="flex flex-col gap-2">
      {/* Job selector */}
      <div>
        <label htmlFor="ai-job-select" className="text-xs text-fg-faint block mb-1">Job</label>
        <select
          id="ai-job-select"
          value={selectedJob}
          onChange={(e) => { setAiJob(e.target.value as AiJobKind); setAiResult(null) }}
          className="w-full h-8 rounded border border-border bg-surface px-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {JOB_OPTIONS.map((j) => (
            <option key={j.id} value={j.id}>
              {j.label} · {AI_JOB_COSTS[j.id]} cr
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="ai-notes" className="text-xs text-fg-faint block mb-1">Notes <span className="text-fg-faint">(optional)</span></label>
        <textarea
          id="ai-notes"
          rows={3}
          placeholder="Context for the job…"
          className="w-full rounded border border-border bg-surface p-2 text-sm text-fg resize-none placeholder:text-fg-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>

      {/* Footer: credits + run */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-faint">{aiCredits} credits left</span>
        <button
          onClick={handleRun}
          disabled={aiRunning || insufficientCredits}
          className="h-8 px-3 rounded border border-border bg-surface text-sm text-fg-dim hover:bg-surface-2 hover:text-fg flex items-center gap-1.5 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {aiRunning
            ? <><Loader2 size={13} className="animate-spin" aria-hidden="true" /> Running…</>
            : <><Sparkles size={13} aria-hidden="true" /> Run</>}
        </button>
      </div>

      {/* Insufficient credits state */}
      {insufficientCredits && (
        <div
          role="alert"
          className="rounded border p-2 text-xs"
          style={{ background: 'rgb(245 177 61 / 0.08)', color: '#f5b13d', borderColor: 'rgb(245 177 61 / 0.35)' }}
        >
          Not enough credits for this job ({cost} cr needed, {aiCredits} left).
          Lower-cost jobs: caption cleanup (5 cr) or attribution summary (4 cr).
          {/* TODO: Phase 7 — link to /settings or upgrade CTA */}
        </div>
      )}

      {/* Result */}
      {aiResult && (
        <pre
          className="rounded border border-border bg-surface-2 p-2 text-xs text-fg-dim whitespace-pre-wrap"
          role="status"
          aria-label="AI job result"
        >
          {aiResult}
        </pre>
      )}
    </div>
  )
}
