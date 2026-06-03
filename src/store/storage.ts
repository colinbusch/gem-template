// Storage module interface — stubs for OPFS persistence + FSA folder sync.
// Phase 9 will replace these stubs with real implementations.
// All calls are fire-and-forget; callers must not depend on return timing.

import type { ProjectState } from './types'

const OPFS_FILENAME = 'project.json'

export async function loadFromOPFS(): Promise<ProjectState | null> {
  try {
    const root = await navigator.storage.getDirectory()
    const handle = await root.getFileHandle(OPFS_FILENAME)
    const file = await handle.getFile()
    const text = await file.text()
    return JSON.parse(text) as ProjectState
  } catch {
    return null
  }
}

export async function saveToOPFS(state: ProjectState): Promise<void> {
  try {
    const root = await navigator.storage.getDirectory()
    const handle = await root.getFileHandle(OPFS_FILENAME, { create: true })
    const writable = await handle.createWritable()
    await writable.write(JSON.stringify(state))
    await writable.close()
  } catch (err) {
    console.error('[OPFS] save failed', err)
  }
}

// FSA: sync ProjectState JSON into a .hurrcut/ subfolder
// Phase 9: implement real File System Access API sync
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function syncToFSA(_dirHandle: FileSystemDirectoryHandle, _state: ProjectState): Promise<void> {
  // TODO: Phase 9 — write project.json into dirHandle/.hurrcut/
  console.warn('[FSA] syncToFSA is a stub — Phase 9 will implement this')
}
