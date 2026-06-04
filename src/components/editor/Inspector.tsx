import { useState } from 'react'
import { ChevronDown, ChevronRight, Square } from 'lucide-react'
import { EmptyState, Slider } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { KIND_COLOR } from '@/lib/utils'
import { RESOLUTION_PRESETS } from '@/store/types'
import type { TimelineClip } from '@/store/types'

// ─── Constants ────────────────────────────────────────────────────────────────
const BLEND_MODES: { value: GlobalCompositeOperation; label: string }[] = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply',    label: 'Multiply' },
  { value: 'screen',      label: 'Screen' },
  { value: 'overlay',     label: 'Overlay' },
  { value: 'darken',      label: 'Darken' },
  { value: 'lighten',     label: 'Lighten' },
  { value: 'soft-light',  label: 'Soft light' },
  { value: 'difference',  label: 'Difference' },
  { value: 'exclusion',   label: 'Exclusion' },
]

const FONT_FAMILIES = [
  { value: 'system-ui, sans-serif',     label: 'System UI' },
  { value: 'Arial, sans-serif',          label: 'Arial' },
  { value: 'Georgia, serif',             label: 'Georgia' },
  { value: "'Courier New', monospace",   label: 'Courier New' },
  { value: 'Impact, sans-serif',         label: 'Impact' },
]

const MOTION_PRESETS = ['none', 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom-in', 'zoom-out']
const MOTION_EASINGS = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'spring']

// ─── Section wrapper ──────────────────────────────────────────────────────────
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

// ─── Shared primitives ────────────────────────────────────────────────────────
const inputCls = 'w-full h-8 rounded border border-border bg-surface px-2 text-xs text-fg mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
const numCls   = inputCls + ' font-mono tabular-nums'
const selectCls = inputCls + ' cursor-pointer'

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-fg-faint">{text}</span>
      {children}
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <Label text={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-fg-faint flex-1">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-10 rounded border border-border bg-surface cursor-pointer p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      <span className="text-xs font-mono tabular-nums text-fg-faint w-16">{value}</span>
    </div>
  )
}

// ─── Main clip editor ─────────────────────────────────────────────────────────
function ClipInspector({ clip }: { clip: TimelineClip }) {
  const updateClip    = useProjectStore((s) => s.updateClip)
  const _pushHistory  = useProjectStore((s) => s._pushHistory)
  const _setClipLive  = useProjectStore((s) => s._setClipLive)
  const triggerSave   = useProjectStore((s) => s.triggerSave)

  const color = KIND_COLOR[clip.kind] ?? '#58d3ff'

  // One-shot commit with history (for selects, checkboxes, color pickers)
  const commit = (patch: Partial<TimelineClip>) => updateClip(clip.id, patch)

  // Live-update helpers: push history once before gesture, live during, save after
  const onSliderDown  = () => _pushHistory()
  const onSliderMove  = (patch: Partial<TimelineClip>) => _setClipLive(clip.id, patch)
  const onSliderUp    = () => triggerSave()
  const onInputFocus  = () => _pushHistory()
  const onInputBlur   = () => triggerSave()

  function numInput(
    label: string,
    value: number,
    field: keyof TimelineClip,
    opts: { step?: number; min?: number; max?: number } = {}
  ) {
    return (
      <Label text={label}>
        <input
          type="number"
          value={value.toFixed(2)}
          step={opts.step ?? 0.01}
          min={opts.min}
          max={opts.max}
          onFocus={onInputFocus}
          onChange={(e) => _setClipLive(clip.id, { [field]: parseFloat(e.target.value) || 0 })}
          onBlur={onInputBlur}
          className={numCls}
        />
      </Label>
    )
  }

  function liveSlider(
    label: string,
    value: number,
    field: keyof TimelineClip,
    opts: { min?: number; max?: number; step?: number; unit?: string } = {}
  ) {
    return (
      <Slider
        label={label}
        unit={opts.unit ?? ''}
        value={value}
        min={opts.min ?? 0}
        max={opts.max ?? 100}
        step={opts.step ?? 1}
        onPointerDown={onSliderDown}
        onChange={(e) => onSliderMove({ [field]: Number(e.target.value) })}
        onPointerUp={onSliderUp}
      />
    )
  }

  return (
    <div className="px-3 pb-3 flex flex-col gap-2">
      {/* Clip identity */}
      <div className="flex items-center gap-2 py-1">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
        <span className="font-medium text-sm text-fg truncate flex-1">{clip.name}</span>
        <span className="text-xs text-fg-faint shrink-0 bg-surface-2 px-1.5 py-0.5 rounded">{clip.kind}</span>
      </div>

      {/* ── Details ── */}
      <Section title="Details" defaultOpen>
        <Label text="Name">
          <input
            type="text"
            value={clip.name}
            onFocus={onInputFocus}
            onChange={(e) => _setClipLive(clip.id, { name: e.target.value })}
            onBlur={onInputBlur}
            className={inputCls}
          />
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {numInput('Start', clip.start, 'start', { min: 0 })}
          {numInput('In', clip.in,      'in',    { min: 0 })}
          {numInput('Out', clip.out,    'out',   { min: 0 })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {numInput('Speed', clip.speed, 'speed', { step: 0.05, min: 0.1, max: 4 })}
          <div className="grid grid-cols-2 gap-2">
            {numInput('Fade in',  clip.fadeIn,  'fadeIn',  { min: 0, max: 10 })}
            {numInput('Fade out', clip.fadeOut, 'fadeOut', { min: 0, max: 10 })}
          </div>
        </div>
      </Section>

      {/* ── Text ── */}
      {clip.kind === 'text' && (
        <Section title="Text" defaultOpen>
          <Label text="Content">
            <textarea
              value={clip.text ?? ''}
              onFocus={onInputFocus}
              onChange={(e) => _setClipLive(clip.id, { text: e.target.value })}
              onBlur={onInputBlur}
              rows={3}
              className="w-full rounded border border-border bg-surface p-2 text-sm text-fg resize-none mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </Label>
          {liveSlider('Font size', clip.fontSize ?? 64, 'fontSize', { min: 12, max: 200, unit: 'px' })}
          <SelectField
            label="Font family"
            value={clip.fontFamily ?? 'system-ui, sans-serif'}
            options={FONT_FAMILIES}
            onChange={(v) => commit({ fontFamily: v })}
          />
          <SelectField
            label="Font weight"
            value={String(clip.fontWeight ?? 400)}
            options={[
              { value: '400', label: 'Regular (400)' },
              { value: '500', label: 'Medium (500)' },
              { value: '600', label: 'Semibold (600)' },
              { value: '700', label: 'Bold (700)' },
              { value: '800', label: 'Extrabold (800)' },
            ]}
            onChange={(v) => commit({ fontWeight: Number(v) })}
          />
          <ColorField
            label="Text color"
            value={clip.textColor ?? '#ffffff'}
            onChange={(v) => commit({ textColor: v })}
          />
          <div>
            <span className="text-xs text-fg-faint">Align</span>
            <div className="flex gap-1 mt-0.5">
              {(['left', 'center', 'right'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => commit({ textAlign: a })}
                  className={[
                    'flex-1 h-7 rounded text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    clip.textAlign === a
                      ? 'bg-surface-2 text-fg'
                      : 'text-fg-dim hover:bg-surface-2 hover:text-fg',
                  ].join(' ')}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          {liveSlider('Line height', clip.textLineHeight ?? 120, 'textLineHeight', { min: 80, max: 200, unit: '%' })}
          {liveSlider('Letter spacing', clip.textLetterSpacing ?? 0, 'textLetterSpacing', { min: -5, max: 20, unit: 'px' })}
          <div className="grid grid-cols-2 gap-2">
            {numInput('Padding', clip.textPadding ?? 0,       'textPadding',       { min: 0, max: 80 })}
            {numInput('Radius',  clip.textBorderRadius ?? 0,  'textBorderRadius',  { min: 0, max: 80 })}
          </div>
          <ColorField
            label="Background"
            value={clip.textBackground ?? '#00000000'}
            onChange={(v) => commit({ textBackground: v })}
          />
        </Section>
      )}

      {/* ── Shape ── */}
      {(clip.kind === 'shape' || clip.kind === 'overlay') && (
        <Section title="Shape" defaultOpen>
          <SelectField
            label="Shape"
            value={clip.shapeKind ?? 'rect'}
            options={[
              { value: 'rect',    label: 'Rectangle' },
              { value: 'ellipse', label: 'Ellipse' },
              { value: 'line',    label: 'Line' },
              { value: 'arrow',   label: 'Arrow' },
            ]}
            onChange={(v) => commit({ shapeKind: v as TimelineClip['shapeKind'] })}
          />
          <ColorField
            label="Fill"
            value={clip.shapeColor ?? '#ffffff'}
            onChange={(v) => commit({ shapeColor: v })}
          />
          <ColorField
            label="Border color"
            value={clip.shapeBorderColor ?? '#000000'}
            onChange={(v) => commit({ shapeBorderColor: v })}
          />
          <div className="grid grid-cols-2 gap-2">
            {numInput('Border width', clip.shapeBorderWidth ?? 0,   'shapeBorderWidth',   { min: 0, max: 40 })}
            {numInput('Corner radius', clip.shapeCornerRadius ?? 0, 'shapeCornerRadius',  { min: 0, max: 200 })}
          </div>
        </Section>
      )}

      {/* ── Transform ── */}
      {clip.kind !== 'audio' && (
        <Section title="Transform" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            {numInput('X', clip.x, 'x')}
            {numInput('Y', clip.y, 'y')}
          </div>
          {liveSlider('Scale',    clip.scale,  'scale',  { min: 10, max: 300, unit: '%' })}
          {liveSlider('Rotation', clip.rotate, 'rotate', { min: -180, max: 180, unit: '°' })}
          {liveSlider('Opacity',  clip.opacity,'opacity',{ min: 0, max: 100, unit: '%' })}
          {(clip.kind === 'video' || clip.kind === 'image') && (
            <SelectField
              label="Fit"
              value={clip.fit}
              options={[
                { value: 'contain', label: 'Contain' },
                { value: 'cover',   label: 'Cover' },
                { value: 'fill',    label: 'Fill' },
              ]}
              onChange={(v) => commit({ fit: v as TimelineClip['fit'] })}
            />
          )}
          <SelectField
            label="Blend mode"
            value={clip.blend}
            options={BLEND_MODES.map((b) => ({ value: b.value, label: b.label }))}
            onChange={(v) => commit({ blend: v as GlobalCompositeOperation })}
          />
        </Section>
      )}

      {/* ── Effects ── */}
      {clip.kind !== 'audio' && (
        <Section title="Effects">
          {liveSlider('Brightness', clip.brightness, 'brightness', { min: 0,   max: 200, unit: '%' })}
          {liveSlider('Contrast',   clip.contrast,   'contrast',   { min: 0,   max: 200, unit: '%' })}
          {liveSlider('Saturation', clip.saturate,   'saturate',   { min: 0,   max: 200, unit: '%' })}
          {liveSlider('Blur',       clip.blur,        'blur',       { min: 0,   max: 20,  unit: 'px' })}
          {liveSlider('Hue rotate', clip.hue,         'hue',        { min: 0,   max: 360, unit: '°' })}
          {liveSlider('Grayscale',  clip.grayscale,  'grayscale',  { min: 0,   max: 100, unit: '%' })}
          {liveSlider('Sepia',      clip.sepia,      'sepia',      { min: 0,   max: 100, unit: '%' })}

          {/* Crop */}
          <span className="text-xs text-fg-faint mt-1">Crop (%)</span>
          <div className="grid grid-cols-2 gap-2">
            {liveSlider('Left',   clip.cropL, 'cropL', { max: 50, unit: '%' })}
            {liveSlider('Right',  clip.cropR, 'cropR', { max: 50, unit: '%' })}
            {liveSlider('Top',    clip.cropT, 'cropT', { max: 50, unit: '%' })}
            {liveSlider('Bottom', clip.cropB, 'cropB', { max: 50, unit: '%' })}
          </div>

          {/* Chroma key */}
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={clip.chroma}
              onChange={(e) => commit({ chroma: e.target.checked })}
              className="focus-visible:ring-2 focus-visible:ring-accent rounded"
            />
            <span className="text-xs text-fg-dim">Chroma key</span>
          </label>
          {clip.chroma && (
            <>
              <ColorField
                label="Key color"
                value={clip.keyColor}
                onChange={(v) => commit({ keyColor: v })}
              />
              {liveSlider('Threshold', clip.keyThreshold, 'keyThreshold', { max: 100, unit: '%' })}
            </>
          )}
        </Section>
      )}

      {/* ── Motion ── */}
      <Section title="Motion">
        <SelectField
          label="Preset"
          value={clip.motionPreset ?? 'none'}
          options={MOTION_PRESETS.map((p) => ({ value: p, label: p === 'none' ? 'None' : p.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) }))}
          onChange={(v) => commit({ motionPreset: v })}
        />
        {(clip.motionPreset && clip.motionPreset !== 'none') && (
          <>
            {liveSlider('Strength', clip.motionStrength ?? 50, 'motionStrength', { min: 0, max: 100, unit: '%' })}
            <SelectField
              label="Easing"
              value={clip.motionEasing ?? 'ease-out'}
              options={MOTION_EASINGS.map((e) => ({ value: e, label: e }))}
              onChange={(v) => commit({ motionEasing: v })}
            />
          </>
        )}
      </Section>

      {/* ── Audio ── */}
      {(clip.kind === 'audio' || clip.kind === 'video') && (
        <Section title="Audio" defaultOpen>
          {liveSlider('Volume', clip.volume, 'volume', { min: 0, max: 100, unit: '%' })}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={clip.muted}
              onChange={(e) => commit({ muted: e.target.checked })}
              className="focus-visible:ring-2 focus-visible:ring-accent rounded"
            />
            <span className="text-xs text-fg-dim">Muted</span>
          </label>
        </Section>
      )}
    </div>
  )
}

// ─── Canvas presets (always visible) ─────────────────────────────────────────
function CanvasSection() {
  const settings      = useProjectStore((s) => s.settings)
  const updateSettings = useProjectStore((s) => s.updateSettings)

  return (
    <div className="px-3 pt-2 pb-1">
      <span className="text-xs text-fg-faint block mb-1.5">Canvas</span>
      <div className="flex flex-wrap gap-1">
        {RESOLUTION_PRESETS.map((p) => {
          const active = settings.width === p.width && settings.height === p.height
          return (
            <button
              key={p.label}
              onClick={() => updateSettings({ width: p.width, height: p.height })}
              className={[
                'h-6 px-2 rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                active
                  ? 'bg-surface-2 text-fg border border-border-strong'
                  : 'text-fg-dim border border-border hover:bg-surface-2 hover:text-fg',
              ].join(' ')}
            >
              {p.label}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-fg-faint flex-1 font-mono tabular-nums">
          {settings.width} × {settings.height} · {settings.fps} fps
        </span>
        <label className="flex items-center gap-1 text-xs text-fg-dim">
          <span>fps</span>
          <select
            value={settings.fps}
            onChange={(e) => updateSettings({ fps: Number(e.target.value) })}
            className="h-6 rounded border border-border bg-surface px-1 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {[24, 25, 30, 50, 60].map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
      </div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function Inspector() {
  const selectedClipId = useProjectStore((s) => s.selectedClipId)
  const clips = useProjectStore((s) => s.clips)
  const selected = clips.find((c) => c.id === selectedClipId) ?? null

  return (
    <div className="flex flex-col">
      <div className="h-9 px-3 flex items-center text-xs uppercase tracking-wide text-fg-faint border-b border-border shrink-0">
        Inspector
      </div>
      <CanvasSection />
      <div className="border-t border-border" />
      {!selected ? (
        <div className="px-3 pt-2">
          <EmptyState
            icon={<Square size={18} />}
            title="Nothing selected"
            description="Select a clip on the timeline to edit its properties."
          />
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          <ClipInspector key={selected.id} clip={selected} />
        </div>
      )}
    </div>
  )
}
