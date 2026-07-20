import { useProjectStore } from '@/store/project'

const WORKER_LABELS = ['effects', 'timeline', 'export'] as const

export function StatusRail() {
  const workers = useProjectStore((s) => s.workers)
  const exportState = useProjectStore((s) => s.exportState)
  const tier = useProjectStore((s) => s.tier)

  return (
    <div className="shrink-0 border-t border-border p-2 flex flex-col gap-2" aria-label="System status">
      {/* Worker pills */}
      <div className="flex items-center gap-1" role="list" aria-label="Worker status">
        {WORKER_LABELS.map((kind) => {
          const w = workers.find((x) => x.kind === kind)
          const busy = w?.status === 'running'
          return (
            <div
              key={kind}
              role="listitem"
              className="flex-1 h-6 rounded border border-border bg-surface-2 flex items-center justify-center gap-1.5 text-xs text-fg-dim"
              aria-label={`${kind} worker: ${w?.status ?? 'idle'}`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: busy ? '#f5b13d' : 'rgb(var(--border-strong))' }}
                aria-hidden="true"
              />
              {kind}
            </div>
          )
        })}
      </div>

      {/* Export row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-fg-faint">Export</span>
        <span className="text-fg-dim font-mono tabular-nums">
          {exportState === 'exporting'
            ? 'exporting…'
            : exportState === 'done'
            ? 'ready'
            : exportState === 'error'
            ? 'error'
            : 'idle'}
        </span>
      </div>

      {/* Tier row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-fg-faint">Tier</span>
        <span className="text-fg-dim capitalize">{tier}</span>
      </div>
    </div>
  )
}
