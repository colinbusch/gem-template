import { useState } from 'react'
import { PageNav } from '@/components/site/PageNav'
import { Toggle, Slider } from '@/components/ui'
import { useProjectStore } from '@/store/project'

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint mb-3">{title}</h2>
  )
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-fg">{label}</p>
        {description && <p className="text-xs text-fg-dim mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0 flex items-center">{children}</div>
    </div>
  )
}

const PROVIDERS = [
  { id: 'google',    label: 'Google' },
  { id: 'microsoft', label: 'Microsoft' },
  { id: 'github',    label: 'GitHub' },
]

export default function SettingsPage() {
  const snap        = useProjectStore((s) => s.snap)
  const safeGuides  = useProjectStore((s) => s.safeGuides)
  const zoom        = useProjectStore((s) => s.zoom)
  const settings    = useProjectStore((s) => s.settings)
  const tier        = useProjectStore((s) => s.tier)

  const setSnap         = useProjectStore((s) => s.setSnap)
  const setSafeGuides   = useProjectStore((s) => s.setSafeGuides)
  const setZoom         = useProjectStore((s) => s.setZoom)
  const updateSettings  = useProjectStore((s) => s.updateSettings)

  const [projectName, setProjectName] = useState(settings.name)

  return (
    <div className="min-h-screen bg-surface text-fg flex flex-col">
      <PageNav />

      <main className="flex-1 px-6 py-8 max-w-xl mx-auto w-full">
        <h1 className="text-lg font-semibold text-fg mb-8">Settings</h1>

        {/* Account */}
        <section className="mb-8" aria-labelledby="settings-account">
          <SectionHeader title="Account" />
          <div className="rounded-lg border border-border bg-surface-1">
            <Row label="Plan" description="Authentication is demonstration-only — no real account exists">
              <span className="text-xs bg-surface-2 text-fg-dim rounded px-2 py-1 capitalize">{tier}</span>
            </Row>
            <Row label="Sign in" description="Connect an account for future features (Creator/Studio tiers)">
              <a
                href="/login"
                className="h-7 px-3 rounded text-xs border border-border text-fg-dim hover:bg-surface-2 hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center"
              >
                Sign in (demo)
              </a>
            </Row>
          </div>
        </section>

        {/* OAuth connections */}
        <section className="mb-8" aria-labelledby="settings-oauth">
          <SectionHeader title="OAuth connections" />
          <p className="text-xs text-fg-faint mb-3">
            All connections are demonstration-only — no real OAuth is configured.
          </p>
          <div className="rounded-lg border border-border bg-surface-1">
            {PROVIDERS.map((p) => (
              <Row key={p.id} label={p.label} description="Not connected">
                <button
                  disabled
                  className="h-7 px-3 rounded text-xs border border-border text-fg-faint opacity-50 cursor-not-allowed"
                >
                  Connect
                </button>
              </Row>
            ))}
          </div>
        </section>

        {/* Project */}
        <section className="mb-8" aria-labelledby="settings-project">
          <SectionHeader title="Project" />
          <div className="rounded-lg border border-border bg-surface-1 p-4 flex flex-col gap-3">
            <label className="block">
              <span className="text-xs text-fg-faint block mb-1">Project name</span>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => updateSettings({ name: projectName })}
                className="w-full h-8 rounded border border-border bg-surface px-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </label>
            <label className="block">
              <span className="text-xs text-fg-faint block mb-1">Background color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.bg}
                  onChange={(e) => updateSettings({ bg: e.target.value })}
                  className="h-8 w-14 rounded border border-border bg-surface cursor-pointer p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <span className="text-xs font-mono text-fg-dim tabular-nums">{settings.bg}</span>
              </div>
            </label>
          </div>
        </section>

        {/* Editor preferences */}
        <section aria-labelledby="settings-editor">
          <SectionHeader title="Editor preferences" />
          <div className="rounded-lg border border-border bg-surface-1">
            <Row label="Snap to grid" description="Snap clip edges to quarter-second intervals">
              <Toggle
                checked={snap}
                onChange={() => setSnap(!snap)}
                aria-label="Snap to grid"
              />
            </Row>
            <Row label="Safe guides" description="Show title-safe and action-safe overlay on the canvas">
              <Toggle
                checked={safeGuides}
                onChange={() => setSafeGuides(!safeGuides)}
                aria-label="Safe guides"
              />
            </Row>
            <div className="px-4 py-3">
              <Slider
                label="Default timeline zoom"
                unit=" px/s"
                value={zoom}
                min={28}
                max={180}
                step={4}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
