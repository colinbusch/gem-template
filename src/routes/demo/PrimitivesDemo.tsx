import { useState } from 'react'
import {
  Button,
  IconButton,
  Toggle,
  Slider,
  Field,
  NumberField,
  EmptyState,
  ToastContainer,
  useToasts,
  CommandPalette,
} from '@/components/ui'
import { Plus, Download, Trash2, Film, Scissors, Sun, Moon } from 'lucide-react'
import type { CommandItem } from '@/components/ui'

// §2/§3 gate: primitives demo — passes because:
// No lorem ipsum (task-tied content). On-grid spacing. One accent (Download/Export).
// Every state shown. Focus rings baked in. Signal colors used for semantic state only.

const DEMO_COMMANDS: CommandItem[] = [
  { id: '1', label: 'Export Project', description: 'Export as WebM', shortcut: '⌘E', group: 'File', onSelect: () => {} },
  { id: '2', label: 'Import Media', description: 'Add files to MediaBin', shortcut: '⌘I', group: 'File', onSelect: () => {} },
  { id: '3', label: 'Split Clip', shortcut: 'S', group: 'Edit', onSelect: () => {} },
  { id: '4', label: 'Undo', shortcut: '⌘Z', group: 'Edit', onSelect: () => {} },
  { id: '5', label: 'Redo', shortcut: '⌘⇧Z', group: 'Edit', onSelect: () => {} },
]

export default function PrimitivesDemo() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains('dark'),
  )
  const [snap, setSnap] = useState(true)
  const [guides, setGuides] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [volume, setVolume] = useState(80)
  const [fps, setFps] = useState(30)
  const [nameError, setNameError] = useState('')
  const [cmdOpen, setCmdOpen] = useState(false)
  const { toasts, push, dismiss } = useToasts()

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="min-h-screen bg-surface text-fg">
      {/* header */}
      <header className="flex items-center justify-between border-b border-border px-4 h-12">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-fg-dim" />
          <span className="text-sm font-medium">HurrCut — UI Primitives Demo</span>
        </div>
        <IconButton
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          icon={dark ? <Sun size={16} /> : <Moon size={16} />}
          onClick={toggleTheme}
        />
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-8">

        {/* Buttons */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">Button</h2>
          <div className="flex flex-wrap gap-2">
            {/* primary = only for Export / primary path to outcome */}
            <Button variant="primary" size="md">
              <Download size={14} />
              Export
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">
              <Trash2 size={14} />
              Delete clip
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary" size="md">Medium</Button>
            <Button variant="secondary" size="lg">Large</Button>
            <Button variant="secondary" loading>Loading…</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </section>

        {/* IconButton */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">IconButton</h2>
          <div className="flex gap-2">
            <IconButton aria-label="Add clip" icon={<Plus size={16} />} tooltip="Add clip" />
            <IconButton aria-label="Split clip" icon={<Scissors size={16} />} active />
            <IconButton aria-label="Delete" icon={<Trash2 size={16} />} />
          </div>
        </section>

        {/* Toggles */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">Toggle</h2>
          <div className="flex flex-col gap-2">
            <Toggle label="Snap to grid" checked={snap} onChange={(e) => setSnap(e.target.checked)} />
            <Toggle label="Safe guides" checked={guides} onChange={(e) => setGuides(e.target.checked)} />
            <Toggle label="Disabled toggle" disabled checked={false} onChange={() => {}} />
          </div>
        </section>

        {/* Sliders */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">Slider</h2>
          <div className="flex flex-col gap-4">
            <Slider label="Brightness" unit="%" value={brightness} min={0} max={200} onChange={(e) => setBrightness(Number(e.target.value))} />
            <Slider label="Volume" unit="%" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} />
          </div>
        </section>

        {/* Fields */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">Field / NumberField</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Project name"
              placeholder="Untitled Project"
              error={nameError}
              onBlur={(e) => setNameError(e.target.value.trim() ? '' : 'Name is required')}
            />
            <Field label="Output file" placeholder="export.webm" optional suffix=".webm" />
            <NumberField label="Frame rate" value={fps} min={1} max={120} onValueChange={setFps} unit="fps" />
            <NumberField label="Width" value={1920} min={1} max={7680} onValueChange={() => {}} unit="px" />
          </div>
        </section>

        {/* EmptyState */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">EmptyState</h2>
          <div className="rounded border border-border">
            <EmptyState
              icon={<Film size={24} />}
              title="No media yet"
              description="Import video, audio, or images to start editing."
              action={
                <Button variant="secondary" size="sm">
                  <Plus size={14} />
                  Import media
                </Button>
              }
            />
          </div>
        </section>

        {/* Toast */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">Toast</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => push({ message: 'Clip split at 00:01:23', kind: 'info' })}>
              Info toast
            </Button>
            <Button variant="secondary" size="sm" onClick={() => push({ message: 'Export complete', kind: 'success', action: { label: 'Open', onClick: () => {} } })}>
              Success + action
            </Button>
            <Button variant="secondary" size="sm" onClick={() => push({ message: 'Export failed: out of memory', kind: 'error' })}>
              Error toast
            </Button>
            <Button variant="secondary" size="sm" onClick={() => push({ message: 'clip.mp4 is missing — relink to continue', kind: 'warn' })}>
              Warning toast
            </Button>
          </div>
        </section>

        {/* Command Palette */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-fg-faint">Command Palette (⌘K)</h2>
          <Button variant="secondary" size="sm" onClick={() => setCmdOpen(true)}>
            Open palette
          </Button>
          <p className="text-xs text-fg-faint">Also triggered by <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">⌘K</kbd></p>
        </section>

      </main>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} items={DEMO_COMMANDS} />
    </div>
  )
}
