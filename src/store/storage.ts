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

// Strip transient fields before serializing — object URLs and thumbnail data
// URLs are invalid after page reload and must not bloat the persisted JSON.
function prepareForSave(state: ProjectState): ProjectState {
  return {
    ...state,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    assets: state.assets.map(({ url: _url, thumbnail: _thumb, ...rest }) => rest),
  }
}

export async function saveToOPFS(state: ProjectState): Promise<void> {
  try {
    const root = await navigator.storage.getDirectory()
    const handle = await root.getFileHandle(OPFS_FILENAME, { create: true })
    const writable = await handle.createWritable()
    await writable.write(JSON.stringify(prepareForSave(state)))
    await writable.close()
  } catch (err) {
    console.error('[OPFS] save failed', err)
  }
}

// FSA: write project.json into <selectedFolder>/.hurrcut/project.json
export async function syncToFSA(dirHandle: FileSystemDirectoryHandle, state: ProjectState): Promise<void> {
  const hurrcut = await dirHandle.getDirectoryHandle('.hurrcut', { create: true })
  const fileHandle = await hurrcut.getFileHandle('project.json', { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(JSON.stringify(prepareForSave(state), null, 2))
  await writable.close()
}
