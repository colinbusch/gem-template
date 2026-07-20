import { Link } from 'react-router-dom'
import { Film, Layers, Download, Scissors } from 'lucide-react'
import { PageNav } from '@/components/site/PageNav'

const FEATURES = [
  {
    icon: Film,
    title: 'Local-first',
    body: 'Files never leave your browser. No account, no upload, no storage fees — processing runs on-device.',
  },
  {
    icon: Layers,
    title: 'Multi-track timeline',
    body: 'Layer video, audio, text, and shapes on independent tracks. Trim, merge, split, and reorder with pointer drag.',
  },
  {
    icon: Download,
    title: 'WebM export',
    body: 'Browser-native MediaRecorder export with an attributions.md file alongside the output. No third-party encoder needed.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-fg flex flex-col">
      <PageNav />

      <main className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="h-8 w-8 rounded grid place-items-center bg-accent text-accent-fg"
              aria-hidden="true"
            >
              <Scissors size={18} />
            </span>
            <span className="text-sm font-mono text-fg-faint tracking-wide uppercase">HurrCut</span>
          </div>
          <h1 className="text-2xl font-semibold text-fg leading-snug mb-3">
            Edit video in your browser.<br />No upload, no install.
          </h1>
          <p className="text-base text-fg-dim leading-relaxed mb-6 max-w-lg">
            A local-first video editor for solo creators. Import local media, arrange on a
            multi-track timeline, export WebM — everything runs on your machine.
          </p>
          <Link
            to="/web"
            className="inline-flex items-center h-9 px-5 rounded-md bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Open editor
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center h-9 px-4 rounded-md ml-3 text-sm text-fg-dim border border-border hover:bg-surface-2 hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Sign in
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <f.icon size={16} className="text-fg-dim shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-fg">{f.title}</span>
              </div>
              <p className="text-xs text-fg-dim leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Status notice */}
        <div className="mt-12 rounded-md border border-border bg-surface-1 p-4">
          <p className="text-xs text-fg-dim leading-relaxed">
            <span className="font-medium text-fg">Early build.</span>{' '}
            Authentication is demonstration-only — no real account is created.
            Paid tiers (Creator, Studio) are future placeholders.
            See{' '}
            <Link to="/about" className="text-fg underline underline-offset-2 hover:text-fg-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
              /about
            </Link>{' '}
            for full disclosure.
          </p>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 flex items-center gap-4 text-xs text-fg-faint">
        <span>HurrCut — browser video editor</span>
        <span aria-hidden="true">·</span>
        <Link to="/about" className="hover:text-fg-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">About</Link>
        <span aria-hidden="true">·</span>
        <Link to="/settings" className="hover:text-fg-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">Settings</Link>
        <div className="flex-1" />
        <span>Free · local-first · no upload</span>
      </footer>
    </div>
  )
}
