// HurrCut data model — preserve all fields; do not rename or drop.
// Source: docs/extraction.md §6

export type ClipKind = 'video' | 'audio' | 'text' | 'shape' | 'overlay' | 'image'
export type TrackKind = 'video' | 'audio' | 'text' | 'overlay'
export type MediaType = 'video' | 'audio' | 'image'
export type AuthProvider = 'google' | 'microsoft' | 'github'
export type Tier = 'free' | 'creator' | 'studio'
export type WorkerKind = 'effects' | 'timeline' | 'export'
export type WorkerStatus = 'idle' | 'running' | 'error'
export type ExportStatus = 'idle' | 'exporting' | 'done' | 'error'

export type AiJobKind =
  | 'caption-cleanup'
  | 'rough-cut-plan'
  | 'publish-package'
  | 'broll-search-prompts'
  | 'attribution-summary'
  | 'project-assistant'

export const AI_JOB_COSTS: Record<AiJobKind, number> = {
  'caption-cleanup': 5,
  'rough-cut-plan': 12,
  'publish-package': 10,
  'broll-search-prompts': 5,
  'attribution-summary': 4,
  'project-assistant': 6,
}

// TODO: confirm values with live app or repo (extraction.md gap)
export const RESOLUTION_PRESETS = [
  { label: '1080p', width: 1920, height: 1080 },
  { label: '720p', width: 1280, height: 720 },
  { label: '4K', width: 3840, height: 2160 },
  { label: 'Square', width: 1080, height: 1080 },
  { label: '9:16', width: 1080, height: 1920 },
] as const

export interface MediaAsset {
  id: string
  name: string
  type: MediaType
  mime: string
  size: number
  duration: number
  width?: number
  height?: number
  url?: string
  sourceName?: string
  missing?: boolean
}

export interface TimelineClip {
  // Identity / timing
  id: string
  kind: ClipKind
  trackId: number
  start: number
  in: number
  out: number
  speed: number
  assetId?: string
  name: string

  // Spatial
  x: number
  y: number
  scale: number
  rotate: number
  opacity: number

  // Visual / color grade
  volume: number
  muted: boolean
  fit: 'contain' | 'cover' | 'fill'
  blend: GlobalCompositeOperation
  brightness: number
  contrast: number
  saturate: number
  blur: number
  hue: number
  grayscale: number
  sepia: number
  cropL: number
  cropR: number
  cropT: number
  cropB: number
  fadeIn: number
  fadeOut: number
  chroma: boolean
  keyColor: string
  keyThreshold: number

  // Text fields
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  textColor?: string
  textAlign?: 'left' | 'center' | 'right'
  textBackground?: string
  textPadding?: number
  textBorderRadius?: number
  textLineHeight?: number
  textLetterSpacing?: number

  // Shape fields
  shapeKind?: 'rect' | 'ellipse' | 'line' | 'arrow'
  shapeColor?: string
  shapeBorderColor?: string
  shapeBorderWidth?: number
  shapeCornerRadius?: number

  // Motion
  motionPreset?: string
  motionStrength?: number
  motionEasing?: string
}

export interface Track {
  id: number
  label: string
  kind: TrackKind
  accepts: ClipKind[]
}

export interface Auth {
  provider: AuthProvider
  displayName: string
  email: string
  tier: Tier
}

export interface WorkerState {
  kind: WorkerKind
  status: WorkerStatus
  message?: string
}

export interface ProjectSettings {
  name: string
  width: number
  height: number
  fps: number
  bg: string
}

export interface ThemeSettings {
  platform: 'mac' | 'win'
  scheme: 'dark' | 'light'
}

export interface ProjectState {
  settings: ProjectSettings
  theme: ThemeSettings
  assets: MediaAsset[]
  clips: TimelineClip[]
  tracks: Track[]
  markers: Array<{ id: string; time: number; label: string }>
  selectedClipId: string | null
  playhead: number
  zoom: number // 28–180 px/s
  snap: boolean
  safeGuides: boolean
  isPlaying: boolean
  isExporting: boolean
  exportProgress: number  // 0-100; updated during export for determinate progress bar
  tier: Tier
  workers: WorkerState[]
  exportState: ExportStatus
  // AI state
  aiJob: AiJobKind | null
  aiRunning: boolean
  aiResult: string | null
  aiCredits: number
}
