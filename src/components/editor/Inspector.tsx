import { useState } from 'react'
import { ChevronDown, ChevronRight, Square } from 'lucide-react'
import { EmptyState, Slider } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { KIND_COLOR } from '@/lib/utils'
import type { TimelineClip } from '@/store/types'

// TODO: Phase 4 — add Shape, Motion, full crop, chroma-key, blend, fit sections

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-md border border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full h-8 px-2 flex items-center gap-1.5 text-xs font-medium text-fg-dim hover:bg-surface-2 hover:text-fg rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-expanded={open}
      >
        {open ? <ChevronDown size={13} aria-hidden="true" /> : <ChevronRight size={13} aria-hidden="true" />}
        {title}
      </button>
      {open && <div className="p-2 pt-1 flex flex-col gap-2">{children}</div>}
    </div>
  )
}

function InlineInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-xs text-fg-faint">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded border border-border bg-surface px-2 text-sm text-fg tabular-nums mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
      />
    </label>
  )
}

function ClipInspector({ clip }: { clip: TimelineClip }) {
  const updateClip = useProjectStore((s) => s.updateClip)
  const _pushHistory = useProjectStore((s) => s._pushHistory)

  const patch = (p: Partial<TimelineClip>) => updateClip(clip.id, p)
  const saveHistory = () => _pushHistory()

  const color = KIND_COLOR[clip.kind] ?? '#58d3ff'

  return (
    <div className="px-3 pb-3 flex flex-col gap-2">
      {/* Clip identity */}
      <div className="flex items-center gap-2 py-1">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
        <span className="font-medium text-sm text-fg truncate flex-1">{clip.name}</span>
        <span className="text-xs text-fg-faint shrink-0">{clip.kind}</span>
      </div>

      {/* Details */}
      <Section title="Details" defaultOpen>
        <InlineInput label="Name" value={clip.name} onChange={(v) => patch({ name: v })} />
        <div className="grid grid-cols-3 gap-2">
          <label className="block">
            <span className="text-xs text-fg-faint">Start</span>
            <input
              type="number"
              value={clip.start.toFixed(2)}
              step={0.01}
              min={0}
              onChange={(e) => { saveHistory(); patch({ start: parseFloat(e.target.value) || 0 }) }}
              className="w-full h-8 rounded border border-border bg-surface px-2 text-xs text-fg font-mono tabular-nums mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-faint">In</span>
            <input
              type="number"
              value={clip.in.toFixed(2)}
              step={0.01}
              min={0}
              onChange={(e) => { saveHistory(); patch({ in: parseFloat(e.target.value) || 0 }) }}
              className="w-full h-8 rounded border border-border bg-surface px-2 text-xs text-fg font-mono tabular-nums mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-faint">Out</span>
            <input
              type="number"
              value={clip.out.toFixed(2)}
              step={0.01}
              min={0}
              onChange={(e) => { saveHistory(); patch({ out: parseFloat(e.target.value) || 0 }) }}
              className="w-full h-8 rounded border border-border bg-surface px-2 text-xs text-fg font-mono tabular-nums mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
        </div>
      </Section>

      {/* Text */}
      {clip.kind === 'text' && (
        <Section title="Text" defaultOpen>
          <label className="block">
            <span className="text-xs text-fg-faint">Content</span>
            <textarea
              value={clip.text ?? ''}
              onChange={(e) => patch({ text: e.target.value })}
              onMouseDown={saveHistory}
              rows={3}
              className="w-full rounded border border-border bg-surface p-2 text-sm text-fg resize-none mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <Slider
            label="Font size"
            unit="px"
            value={clip.fontSize ?? 64}
            min={12}
            max={200}
            onMouseDown={saveHistory}
            onChange={(e) => patch({ fontSize: Number(e.target.value) })}
          />
        </Section>
      )}

      {/* Transform */}
      <Section title="Transform" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          <InlineInput label="X" type="number" value={clip.x} onChange={(v) => { saveHistory(); patch({ x: Number(v) }) }} />
          <InlineInput label="Y" type="number" value={clip.y} onChange={(v) => { saveHistory(); patch({ y: Number(v) }) }} />
        </div>
        <Slider label="Scale" unit="%" value={clip.scale} min={10} max={300} onMouseDown={saveHistory} onChange={(e) => patch({ scale: Number(e.target.value) })} />
        <Slider label="Rotation" unit="°" value={clip.rotate} min={-180} max={180} onMouseDown={saveHistory} onChange={(e) => patch({ rotate: Number(e.target.value) })} />
        <Slider label="Opacity" unit="%" value={clip.opacity} min={0} max={100} onMouseDown={saveHistory} onChange={(e) => patch({ opacity: Number(e.target.value) })} />
      </Section>

      {/* Effects */}
      {clip.kind !== 'audio' && (
        <Section title="Effects">
          <Slider label="Brightness" unit="%" value={clip.brightness} min={0} max={200} onMouseDown={saveHistory} onChange={(e) => patch({ brightness: Number(e.target.value) })} />
          <Slider label="Contrast" unit="%" value={clip.contrast} min={0} max={200} onMouseDown={saveHistory} onChange={(e) => patch({ contrast: Number(e.target.value) })} />
          <Slider label="Saturation" unit="%" value={clip.saturate} min={0} max={200} onMouseDown={saveHistory} onChange={(e) => patch({ saturate: Number(e.target.value) })} />
          <Slider label="Blur" unit="px" value={clip.blur} min={0} max={20} onMouseDown={saveHistory} onChange={(e) => patch({ blur: Number(e.target.value) })} />
          <Slider label="Hue rotate" unit="°" value={clip.hue} min={0} max={360} onMouseDown={saveHistory} onChange={(e) => patch({ hue: Number(e.target.value) })} />
          {/* TODO: Phase 4 — grayscale, sepia, chroma key, crop */}
        </Section>
      )}

      {/* Audio */}
      {(clip.kind === 'audio' || clip.kind === 'video') && (
        <Section title="Audio">
          <Slider label="Volume" unit="%" value={clip.volume} min={0} max={100} onMouseDown={saveHistory} onChange={(e) => patch({ volume: Number(e.target.value) })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={clip.muted}
              onChange={(e) => { saveHistory(); patch({ muted: e.target.checked }) }}
              className="focus-visible:ring-2 focus-visible:ring-accent"
            />
            <span className="text-xs text-fg-dim">Muted</span>
          </label>
        </Section>
      )}

      {/* Motion — TODO Phase 4 */}
      <Section title="Motion">
        <p className="text-xs text-fg-faint">TODO: Phase 4 — motion presets, strength, easing</p>
      </Section>
    </div>
  )
}

export function Inspector() {
  const selectedClipId = useProjectStore((s) => s.selectedClipId)
  const clips = useProjectStore((s) => s.clips)
  const selected = clips.find((c) => c.id === selectedClipId) ?? null

  return (
    <div className="flex flex-col">
      <div className="h-9 px-3 flex items-center text-xs uppercase tracking-wide text-fg-faint border-b border-border shrink-0">
        Inspector
      </div>
      {!selected ? (
        <div className="px-3 pb-3">
          <EmptyState
            icon={<Square size={18} />}
            title="Nothing selected"
            description="Select a clip on the timeline to edit its properties."
          />
        </div>
      ) : (
        <ClipInspector key={selected.id} clip={selected} />
      )}
    </div>
  )
}
