import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { PageNav } from '@/components/site/PageNav'

const PRINCIPLES = [
  {
    title: 'Local-first',
    body: 'Your files never leave your browser. All processing — rendering, encoding, effects — runs on-device. There is no server that receives your media.',
  },
  {
    title: 'Fast feedback',
    body: 'Every action has ≤ 400 ms perceived latency. Sliders update the preview live. The timeline responds to each pointer event.',
  },
  {
    title: 'One job, done well',
    body: 'HurrCut is a trim-and-arrange tool for solo creators who need to turn raw footage into a publishable clip quickly. It is not a compositing suite.',
  },
  {
    title: 'Transparent about limits',
    body: 'Authentication is mock. Paid tiers are placeholders. The AI backends are stubs. This build is a working product foundation, not a finished service.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface text-fg flex flex-col">
      <PageNav />

      <main className="flex-1 px-6 py-8 max-w-xl mx-auto w-full">
        <h1 className="text-lg font-semibold text-fg mb-2">About HurrCut</h1>
        <p className="text-sm text-fg-dim mb-8 leading-relaxed">
          HurrCut is a browser-based, local-first video editor for solo creators. Primary job:
          import local media → arrange on a multi-track timeline → export WebM, no cloud upload.
        </p>

        {/* Auth disclosure — explicit and prominent */}
        <div
          role="note"
          aria-label="Authentication disclosure"
          className="mb-8 rounded-md border p-4 flex gap-3"
          style={{ background: 'rgb(245 177 61 / 0.08)', borderColor: 'rgb(245 177 61 / 0.35)' }}
        >
          <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: '#f5b13d' }} aria-hidden="true" />
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#f5b13d' }}>
              Authentication disclosure
            </p>
            <p className="text-xs text-fg-dim leading-relaxed">
              The sign-in flow on this build is <strong className="text-fg">entirely mock</strong> — no real
              OAuth connection is made, no account is created, no data is sent to any provider, and no session
              is issued. Clicking a provider button in the login page proceeds directly to the editor.
              Paid tiers (Creator, Studio) are future placeholders with no backend.
            </p>
          </div>
        </div>

        {/* Principles */}
        <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint mb-4">Principles</h2>
        <div className="flex flex-col gap-6 mb-10">
          {PRINCIPLES.map((p) => (
            <div key={p.title}>
              <p className="text-sm font-medium text-fg mb-1">{p.title}</p>
              <p className="text-sm text-fg-dim leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Tech stack brief */}
        <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint mb-4">Tech</h2>
        <div className="rounded-md border border-border bg-surface-1 p-4 mb-8">
          <p className="text-xs text-fg-dim leading-relaxed">
            React 19 · TypeScript · Tailwind v4 · Vite · Zustand · React Router · lucide-react.
            Storage: OPFS for persistence, File System Access API (Phase 9).
            Export: MediaRecorder WebM + <code className="font-mono bg-surface-2 px-1 rounded">attributions.md</code>.
            AI: DeepSeek for project-assistant (stubbed); attribution-summary is scripted client-side.
          </p>
        </div>

        {/* CTA */}
        <Link
          to="/web"
          className="inline-flex items-center h-9 px-5 rounded-md bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Open editor →
        </Link>
      </main>
    </div>
  )
}
