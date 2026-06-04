import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Lock } from 'lucide-react'
import { setAuthenticated } from '@/lib/auth'

// ─── Data types ───────────────────────────────────────────────────────────────
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
type FeatureStatus = 'done' | 'partial' | 'planned' | 'blocked'

interface MatrixRow {
  phase: number
  feature: string
  status: FeatureStatus
  risk: RiskLevel
  notes: string
}

// ─── Risk + status palettes (data-viz signal colors — exempt from accent rule)
const RISK_COLOR: Record<RiskLevel, string> = {
  low:      '#86e89f',
  medium:   '#f5b13d',
  high:     '#f07d30',
  critical: '#f0606b',
}

const STATUS_COLOR: Record<FeatureStatus, string> = {
  done:    '#86e89f',
  partial: '#f5b13d',
  planned: 'rgb(var(--fg-faint))',
  blocked: '#f0606b',
}

// ─── Rebuild phase matrix ─────────────────────────────────────────────────────
const MATRIX: MatrixRow[] = [
  { phase: 0, feature: 'Scaffold + tokens',      status: 'done',    risk: 'low',      notes: 'Vite + React + Tailwind v4; dark/light CSS vars; lucide-react' },
  { phase: 1, feature: 'UI primitives',           status: 'done',    risk: 'low',      notes: 'Button, Toggle, Slider, Field, EmptyState, Toast, CommandPalette' },
  { phase: 2, feature: 'Editor shell /web',        status: 'done',    risk: 'low',      notes: '5-row grid; MenuBar, WorkspaceBar, Stage, CommandBar, RightRail' },
  { phase: 3, feature: 'Timeline',                status: 'done',    risk: 'low',      notes: 'Virtual windowing, per-gesture undo, adaptive ticks, Merge' },
  { phase: 4, feature: 'Inspector + clip model',  status: 'done',    risk: 'low',      notes: 'All 40+ TimelineClip fields; live update via _setClipLive' },
  { phase: 5, feature: 'States everywhere',       status: 'done',    risk: 'low',      notes: 'Export progress, CreatorPacks L/E/Er, reduced-motion, done state' },
  { phase: 6, feature: 'Media / packs / AI',      status: 'done',    risk: 'medium',   notes: 'Thumbnails, lib/ai.ts + lib/catalog.ts service boundaries; stubs' },
  { phase: 7, feature: 'Secondary routes',        status: 'done',    risk: 'low',      notes: '/, /login, /settings, /about — auth-mock disclosure present' },
  { phase: 8, feature: '/matrix auth guard',      status: 'done',    risk: 'low',      notes: 'This page; localStorage mock token; AuthGate component; redirect flow' },
  { phase: 9, feature: 'Engine integration',      status: 'planned', risk: 'critical', notes: 'Canvas 2D + 3 Web Workers + MediaRecorder WebM + OPFS/FSA persistence' },
  { phase: 10, feature: 'Responsive / mobile',    status: 'planned', risk: 'high',     notes: 'Sub-1080px behavior undefined; MenuBar hides controls <820px' },
  { phase: 11, feature: 'A11y + QA',              status: 'planned', risk: 'medium',   notes: 'Unified focus styles; Playwright primary flow; Vitest coverage' },
]

const ALL_STATUSES: FeatureStatus[] = ['done', 'partial', 'planned', 'blocked']
const ALL_RISKS: RiskLevel[]        = ['low', 'medium', 'high', 'critical']

// ─── Component ────────────────────────────────────────────────────────────────
export default function MatrixPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | null>(null)
  const [riskFilter, setRiskFilter]     = useState<RiskLevel | null>(null)

  const filtered = MATRIX.filter((row) => {
    if (statusFilter && row.status !== statusFilter) return false
    if (riskFilter && row.risk !== riskFilter)       return false
    return true
  })

  const handleSignOut = () => {
    setAuthenticated(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface text-fg flex flex-col">
      {/* Header */}
      <div className="h-12 shrink-0 bg-surface-1 border-b border-border flex items-center px-6 gap-4">
        <Link
          to="/"
          className="text-sm font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          HurrCut
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-fg-faint">
          <Lock size={11} aria-hidden="true" />
          <span>Internal planning matrix</span>
        </div>
        <div className="flex-1" />
        <Link
          to="/web"
          className="text-sm text-fg-dim hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Editor
        </Link>
        <button
          onClick={handleSignOut}
          className="h-8 px-3 rounded flex items-center gap-1.5 text-xs text-fg-dim border border-border hover:bg-surface-2 hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <LogOut size={13} aria-hidden="true" />
          Sign out
        </button>
      </div>

      <main className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-base font-semibold text-fg mb-1">Rebuild matrix</h1>
          <p className="text-xs text-fg-dim">
            Phase-by-phase status, risk, and notes for the HurrCut minimal-UI rebuild.
            This route requires authentication — do not expose publicly.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Status filter */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Filter by status">
            <span className="text-xs text-fg-faint">Status</span>
            {(['all', ...ALL_STATUSES] as const).map((s) => {
              const active = s === 'all' ? statusFilter === null : statusFilter === s
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s === 'all' ? null : s)}
                  className={[
                    'h-6 px-2 rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    active ? 'bg-surface-2 text-fg border border-border-strong' : 'text-fg-dim border border-border hover:bg-surface-2',
                  ].join(' ')}
                  style={active && s !== 'all' ? { color: STATUS_COLOR[s as FeatureStatus] } : undefined}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              )
            })}
          </div>

          {/* Risk filter */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Filter by risk">
            <span className="text-xs text-fg-faint">Risk</span>
            {(['all', ...ALL_RISKS] as const).map((r) => {
              const active = r === 'all' ? riskFilter === null : riskFilter === r
              return (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r === 'all' ? null : r)}
                  className={[
                    'h-6 px-2 rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    active ? 'bg-surface-2 text-fg border border-border-strong' : 'text-fg-dim border border-border hover:bg-surface-2',
                  ].join(' ')}
                  style={active && r !== 'all' ? { color: RISK_COLOR[r as RiskLevel] } : undefined}
                >
                  {r === 'all' ? 'All' : r}
                </button>
              )
            })}
          </div>

          <span className="text-xs text-fg-faint ml-auto">{filtered.length} / {MATRIX.length} phases</span>
        </div>

        {/* Matrix table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm" role="table" aria-label="Rebuild phase matrix">
            <thead>
              <tr className="bg-surface-1 border-b border-border text-xs text-fg-faint">
                <th className="text-left px-3 py-2 font-medium w-12">#</th>
                <th className="text-left px-3 py-2 font-medium">Feature</th>
                <th className="text-left px-3 py-2 font-medium w-24">Status</th>
                <th className="text-left px-3 py-2 font-medium w-24">Risk</th>
                <th className="text-left px-3 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-xs text-fg-faint">
                    No phases match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.phase} className="border-b border-border last:border-0 hover:bg-surface-1 transition-colors">
                    <td className="px-3 py-2.5 text-xs font-mono text-fg-faint tabular-nums">{row.phase}</td>
                    <td className="px-3 py-2.5 text-sm text-fg font-medium">{row.feature}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-xs font-medium capitalize"
                        style={{ color: STATUS_COLOR[row.status] }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-xs font-medium capitalize"
                        style={{ color: RISK_COLOR[row.risk] }}
                      >
                        {row.risk}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-fg-dim">{row.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Risk legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {ALL_RISKS.map((r) => (
            <div key={r} className="flex items-center gap-1.5 text-xs text-fg-faint">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: RISK_COLOR[r] }} aria-hidden="true" />
              <span className="capitalize">{r}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
