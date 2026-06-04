import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'

type Provider = 'google' | 'microsoft' | 'github'

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: 'google',    label: 'Sign in with Google' },
  { id: 'microsoft', label: 'Sign in with Microsoft' },
  { id: 'github',    label: 'Sign in with GitHub' },
]

const TIERS = [
  {
    id: 'free',
    label: 'Free',
    price: '$0',
    status: 'active' as const,
    features: [
      'Unlimited local projects',
      'Multi-track timeline',
      'WebM export',
      'OPFS persistence',
    ],
  },
  {
    id: 'creator',
    label: 'Creator',
    price: 'Coming soon',
    status: 'future' as const,
    features: [
      'Everything in Free',
      'AI assistant credits',
      'Creator pack catalog',
      'Priority export queue',
    ],
  },
  {
    id: 'studio',
    label: 'Studio',
    price: 'Coming soon',
    status: 'future' as const,
    features: [
      'Everything in Creator',
      'Team workspace',
      'Advanced AI jobs',
      'Custom pack library',
    ],
  },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<Provider | null>(null)

  const handleSignIn = (provider: Provider) => {
    setLoading(provider)
    // Mock OAuth — simulate a brief redirect delay, then go to editor
    setTimeout(() => navigate('/web'), 900)
  }

  return (
    <div className="min-h-screen bg-surface text-fg flex flex-col">
      {/* Minimal top bar */}
      <div className="h-12 bg-surface-1 border-b border-border flex items-center px-6">
        <Link
          to="/"
          className="text-sm font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          HurrCut
        </Link>
        <div className="flex-1" />
        <Link
          to="/web"
          className="text-sm text-fg-dim hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Continue without account →
        </Link>
      </div>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-sm mx-auto">
          {/* Auth mock disclosure — prominent */}
          <div
            role="note"
            className="mb-6 rounded-md border p-3 flex gap-2 text-xs"
            style={{ background: 'rgb(245 177 61 / 0.08)', color: '#f5b13d', borderColor: 'rgb(245 177 61 / 0.35)' }}
          >
            <AlertTriangle size={13} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Demo only.</strong> Authentication is mock — no real OAuth connection is made, no account
              is created, and no data is sent to any server. Click any option to proceed directly to the editor.
            </span>
          </div>

          <h1 className="text-lg font-semibold text-fg mb-1">Sign in</h1>
          <p className="text-sm text-fg-dim mb-6">
            Choose a provider to continue. Auth is demonstration-only.
          </p>

          {/* Provider buttons */}
          <div className="flex flex-col gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSignIn(p.id)}
                disabled={loading !== null}
                className="h-10 rounded-md border border-border bg-surface-1 text-sm text-fg hover:bg-surface-2 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {loading === p.id
                  ? <Loader2 size={15} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  : null}
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/web"
              className="text-xs text-fg-faint hover:text-fg-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Skip — open editor without signing in
            </Link>
          </div>
        </div>

        {/* Tier comparison */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-sm font-medium text-fg-dim mb-4 text-center">Plans</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.id}
                className={[
                  'rounded-lg border p-4 flex flex-col gap-3',
                  t.status === 'active' ? 'border-border-strong bg-surface-1' : 'border-border bg-surface',
                ].join(' ')}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-fg">{t.label}</span>
                  <span className={`text-xs font-mono ${t.status === 'future' ? 'text-fg-faint' : 'text-fg-dim'}`}>
                    {t.price}
                  </span>
                </div>
                {t.status === 'active' && (
                  <span className="text-xs text-fg-faint bg-surface-2 rounded px-1.5 py-0.5 self-start">
                    Current plan
                  </span>
                )}
                {t.status === 'future' && (
                  <span className="text-xs text-fg-faint self-start">Future</span>
                )}
                <ul className="flex flex-col gap-1.5">
                  {t.features.map((f) => (
                    <li key={f} className="text-xs text-fg-dim flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0 text-fg-faint" aria-hidden="true">–</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
