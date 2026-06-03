import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type {
  ProjectState,
  TimelineClip,
  MediaAsset,
  Track,
  AiJobKind,
} from './types'
import { saveToOPFS } from './storage'

const DEFAULT_TRACKS: Track[] = [
  { id: 1, label: 'Video 1', kind: 'video', accepts: ['video', 'image', 'overlay', 'shape'] },
  { id: 2, label: 'Audio 1', kind: 'audio', accepts: ['audio'] },
  { id: 3, label: 'Text 1', kind: 'text', accepts: ['text'] },
]

const INITIAL_STATE: ProjectState = {
  settings: { name: 'Untitled Project', width: 1920, height: 1080, fps: 30, bg: '#000000' },
  theme: { platform: 'mac', scheme: 'dark' },
  assets: [],
  clips: [],
  tracks: DEFAULT_TRACKS,
  markers: [],
  selectedClipId: null,
  playhead: 0,
  zoom: 80,
  snap: true,
  safeGuides: false,
  isPlaying: false,
  isExporting: false,
  tier: 'free',
  workers: [
    { kind: 'effects', status: 'idle' },
    { kind: 'timeline', status: 'idle' },
    { kind: 'export', status: 'idle' },
  ],
  exportState: 'idle',
  aiJob: null,
  aiRunning: false,
  aiResult: null,
  aiCredits: 0,
}

// 80-entry undo/redo history
const MAX_HISTORY = 80

interface HistoryEntry {
  clips: TimelineClip[]
  selectedClipId: string | null
}

interface ProjectStore extends ProjectState {
  // Clip actions
  selectClip: (id: string | null) => void
  updateClip: (id: string, patch: Partial<TimelineClip>) => void
  addClip: (clip: TimelineClip) => void
  removeClip: (id: string) => void
  moveClip: (id: string, start: number, trackId?: number) => void
  trimClip: (id: string, patch: Pick<TimelineClip, 'start' | 'in' | 'out'>) => void

  // Asset actions
  addAsset: (asset: MediaAsset) => void
  removeAsset: (id: string) => void
  markAssetMissing: (id: string, missing: boolean) => void

  // Playback
  setPlayhead: (time: number) => void
  setPlaying: (playing: boolean) => void

  // Project settings
  updateSettings: (patch: Partial<ProjectState['settings']>) => void
  setZoom: (zoom: number) => void
  setSnap: (snap: boolean) => void
  setSafeGuides: (guides: boolean) => void

  // Export
  setExporting: (exporting: boolean) => void
  setExportState: (state: ProjectState['exportState']) => void

  // AI
  setAiJob: (job: AiJobKind | null) => void
  setAiRunning: (running: boolean) => void
  setAiResult: (result: string | null) => void

  // Undo/redo
  undo: () => void
  redo: () => void
  _history: HistoryEntry[]
  _historyIdx: number
  _pushHistory: () => void
}

let _debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedSave(state: ProjectState) {
  if (_debounceTimer) clearTimeout(_debounceTimer)
  _debounceTimer = setTimeout(() => saveToOPFS(state), 1500)
}

export const useProjectStore = create<ProjectStore>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,
    _history: [],
    _historyIdx: -1,

    _pushHistory: () => {
      const { clips, selectedClipId, _history, _historyIdx } = get()
      const entry: HistoryEntry = { clips: structuredClone(clips), selectedClipId }
      const trimmed = _history.slice(0, _historyIdx + 1)
      const next = [...trimmed, entry].slice(-MAX_HISTORY)
      set({ _history: next, _historyIdx: next.length - 1 })
    },

    undo: () => {
      const { _history, _historyIdx } = get()
      if (_historyIdx <= 0) return
      const prev = _history[_historyIdx - 1]
      set({ clips: prev.clips, selectedClipId: prev.selectedClipId, _historyIdx: _historyIdx - 1 })
    },

    redo: () => {
      const { _history, _historyIdx } = get()
      if (_historyIdx >= _history.length - 1) return
      const next = _history[_historyIdx + 1]
      set({ clips: next.clips, selectedClipId: next.selectedClipId, _historyIdx: _historyIdx + 1 })
    },

    selectClip: (id) => set({ selectedClipId: id }),

    updateClip: (id, patch) => {
      get()._pushHistory()
      set((s) => ({
        clips: s.clips.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }))
      debouncedSave(get())
    },

    addClip: (clip) => {
      get()._pushHistory()
      set((s) => ({ clips: [...s.clips, clip] }))
      debouncedSave(get())
    },

    removeClip: (id) => {
      get()._pushHistory()
      set((s) => ({
        clips: s.clips.filter((c) => c.id !== id),
        selectedClipId: s.selectedClipId === id ? null : s.selectedClipId,
      }))
      debouncedSave(get())
    },

    moveClip: (id, start, trackId) => {
      get()._pushHistory()
      set((s) => ({
        clips: s.clips.map((c) =>
          c.id === id ? { ...c, start, ...(trackId !== undefined ? { trackId } : {}) } : c,
        ),
      }))
      debouncedSave(get())
    },

    trimClip: (id, patch) => {
      get()._pushHistory()
      set((s) => ({ clips: s.clips.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
      debouncedSave(get())
    },

    addAsset: (asset) => {
      set((s) => ({ assets: [...s.assets, asset] }))
      debouncedSave(get())
    },

    removeAsset: (id) => {
      set((s) => ({
        assets: s.assets.filter((a) => a.id !== id),
        clips: s.clips.filter((c) => c.assetId !== id),
      }))
      debouncedSave(get())
    },

    markAssetMissing: (id, missing) => {
      set((s) => ({
        assets: s.assets.map((a) => (a.id === id ? { ...a, missing } : a)),
      }))
    },

    setPlayhead: (time) => set({ playhead: time }),
    setPlaying: (playing) => set({ isPlaying: playing }),
    updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
    setZoom: (zoom) => set({ zoom: Math.min(180, Math.max(28, zoom)) }),
    setSnap: (snap) => set({ snap }),
    setSafeGuides: (safeGuides) => set({ safeGuides }),
    setExporting: (isExporting) => set({ isExporting }),
    setExportState: (exportState) => set({ exportState }),
    setAiJob: (aiJob) => set({ aiJob }),
    setAiRunning: (aiRunning) => set({ aiRunning }),
    setAiResult: (aiResult) => set({ aiResult }),
  })),
)
