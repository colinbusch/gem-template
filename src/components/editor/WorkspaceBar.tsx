import { useRef, useState } from 'react'
import { HardDrive, Folder, RefreshCw } from 'lucide-react'
import { useProjectStore } from '@/store/project'
import { syncToFSA } from '@/store/storage'

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export function WorkspaceBar() {
  const dirHandleRef = useRef<FileSystemDirectoryHandle | null>(null)
  const [folderName, setFolderName] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')

  const fsaSupported = 'showDirectoryPicker' in window

  const handlePickFolder = async () => {
    try {
      const handle = await (
        window as unknown as { showDirectoryPicker(): Promise<FileSystemDirectoryHandle> }
      ).showDirectoryPicker()
      dirHandleRef.current = handle
      setFolderName(handle.name)
      setSyncStatus('idle')
    } catch {
      // User cancelled — no-op
    }
  }

  const handleSync = async () => {
    const handle = dirHandleRef.current
    if (!handle) return
    setSyncStatus('syncing')
    try {
      await syncToFSA(handle, useProjectStore.getState())
      setSyncStatus('synced')
    } catch {
      setSyncStatus('error')
    }
  }

  return (
    <div className="h-9 shrink-0 bg-surface-1 border-b border-border flex items-center justify-between px-3 text-xs text-fg-faint">
      <div className="flex items-center gap-2">
        <HardDrive size={13} aria-hidden="true" />
        <span>Workspace</span>
        <span className="text-fg-dim">Local · OPFS</span>
      </div>

      <div className="flex items-center gap-2">
        <Folder size={13} aria-hidden="true" />
        {folderName ? (
          <>
            <span className="font-mono text-fg-dim max-w-32 truncate" title={folderName}>
              {folderName}
            </span>
            <button
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
              className="h-6 px-2 rounded border border-border text-fg-dim hover:bg-surface-2 hover:text-fg disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center gap-1"
              aria-label="Sync project to folder"
            >
              <RefreshCw
                size={11}
                aria-hidden="true"
                className={syncStatus === 'syncing' ? 'animate-spin motion-reduce:animate-none' : ''}
              />
              {syncStatus === 'syncing' ? 'Syncing…' : 'Sync'}
            </button>
            {syncStatus === 'synced' && (
              <span className="text-signal-ok" role="status">Synced</span>
            )}
            {syncStatus === 'error' && (
              <span className="text-signal-error" role="alert">Sync failed</span>
            )}
          </>
        ) : (
          <>
            <span>Folder sync</span>
            {fsaSupported ? (
              <button
                onClick={handlePickFolder}
                className="h-6 px-2 rounded border border-border text-fg-dim hover:bg-surface-2 hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Pick a folder to sync project files into"
              >
                Pick folder…
              </button>
            ) : (
              <span className="text-fg-faint italic">Not supported in this browser</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
