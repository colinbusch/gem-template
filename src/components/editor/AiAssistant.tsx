import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useProjectStore } from '@/store/project'
import { AI_JOB_COSTS } from '@/store/types'
import { runAiJob, InsufficientCreditsError } from '@/lib/ai'
import type { AiJobKind } from '@/store/types'

const JOB_OPTIONS: { id: AiJobKind; label: string }[] = [
  { id: 'caption-cleanup',       label: 'Caption cleanup' },
  { id: 'rough-cut-plan',        label: 'Rough-cut plan' },
  { id: 'publish-package',       label: 'Publish package' },
  { id: 'broll-search-prompts',  label: 'B-roll search prompts' },
  { id: 'attribution-summary',   label: 'Attribution summary' },
  { id: 'project-assistant',     label: 'Project assistant' },
]

export function AiAssistant() {
  const aiJob       = useProjectStore((s) => s.aiJob)
  const aiRunning   = useProjectStore((s) => s.aiRunning)
  const aiResult    = useProjectStore((s) => s.aiResult)
  const aiCredits   = useProjectStore((s) => s.aiCredits)
  const assets      = useProjectStore((s) => s.assets)
  const setAiJob    = useProjectStore((s) => s.setAiJob)
  const setAiRunning = useProjectStore((s) => s.setAiRunning)
  const setAiResult  = useProjectStore((s) => s.setAiResult)

  const [notes, setNotes]   = useState('')
  const [error, setError]   = useState<string | null>(null)

  const selectedJob = aiJob ?? 'caption-cleanup'
  const cost        = AI_JOB_COSTS[selectedJob]
  const hasCredits  = aiCredits >= cost

  const handleRun = async () => {
    if (!hasCredits || aiRunning) return
    setAiRunning(true)
    setAiResult(null)
    setError(null)
    try {
      const result = await runAiJob(selectedJob, { notes, assets }, aiCredits)
      setAiResult(result.output)
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        setError(`Need ${err.needed} credits, have ${err.have}.`)
      } else {
        setError('Job failed — try again.')
      }
    } finally {
      setAiRunning(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Job selector */}
      <div>
        <label htmlFor="ai-job-select" className="text-xs text-fg-faint block mb-1">Job</label>
        <select
          id="ai-job-select"
          value={selectedJob}
          onChange={(e) => { setAiJob(e.target.value as AiJobKind); setAiResult(null); setError(null) }}
          disabled={aiRunning}
          className="w-full h-8 rounded border border-border bg-surface px-2 text-sm text-fg disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
        <label htmlFor="ai-notes" className="text-xs text-fg-faint block mb-1">
          Notes <span className="text-fg-faint">(optional)</span>
        </label>
        <textarea
          id="ai-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={aiRunning}
          placeholder="Context for the job…"
          className="w-full rounded border border-border bg-surface p-2 text-sm text-fg resize-none placeholder:text-fg-faint disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>

      {/* Footer: credits + run */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-faint">{aiCredits} credits left</span>
        <button
          onClick={handleRun}
          disabled={aiRunning || !hasCredits}
          className="h-8 px-3 rounded border border-border bg-surface text-sm text-fg-dim hover:bg-surface-2 hover:text-fg flex items-center gap-1.5 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {aiRunning
            ? <><Loader2 size={13} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> Running…</>
            : <><Sparkles size={13} aria-hidden="true" /> Run</>}
        </button>
      </div>

      {/* Insufficient credits */}
      {!hasCredits && !aiRunning && (
        <div
          role="alert"
          className="rounded border p-2 text-xs"
          style={{ background: 'rgb(245 177 61 / 0.08)', color: '#f5b13d', borderColor: 'rgb(245 177 61 / 0.35)' }}
        >
          Not enough credits for this job ({cost} cr needed, {aiCredits} left).
          Try caption cleanup (5 cr) or attribution summary (4 cr).
          {/* TODO: Phase 7 — link to /settings for credit top-up */}
        </div>
      )}

      {/* Run error */}
      {error && (
        <div
          role="alert"
          className="rounded border p-2 text-xs"
          style={{ background: 'rgb(240 96 107 / 0.08)', color: '#f0606b', borderColor: 'rgb(240 96 107 / 0.3)' }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {aiResult && (
        <pre
          className="rounded border border-border bg-surface-2 p-2 text-xs text-fg-dim whitespace-pre-wrap overflow-auto max-h-48"
          role="status"
          aria-label="AI job result"
        >
          {aiResult}
        </pre>
      )}
    </div>
  )
}
