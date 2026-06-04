import { useCallback, useRef, useState } from 'react'
import { Upload, Film, Music, Image as ImageIcon, AlertTriangle, Search } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { KIND_COLOR, fmtTime } from '@/lib/utils'
import type { MediaAsset } from '@/store/types'

const TYPE_ICON: Record<string, typeof Film> = {
  video: Film,
  audio: Music,
  image: ImageIcon,
}

function AssetRow({ asset }: { asset: MediaAsset }) {
  const Icon = TYPE_ICON[asset.type] ?? Film
  const color = KIND_COLOR[asset.type] ?? '#58d3ff'

  return (
    <div
      className="group flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-2 cursor-grab active:cursor-grabbing"
      draggable
      role="listitem"
      aria-label={asset.name}
    >
      {/* Thumbnail placeholder */}
      <div
        className="h-10 w-16 rounded shrink-0 grid place-items-center"
        style={
          asset.missing
            ? { border: '1px dashed #f0606b', color: '#f0606b' }
            : { background: 'rgb(var(--surface-2))', color }
        }
        aria-hidden="true"
      >
        {asset.missing ? <AlertTriangle size={15} /> : <Icon size={16} />}
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm"
          style={asset.missing ? { color: '#f0606b' } : undefined}
        >
          {asset.name}
        </p>
        <p className="text-xs text-fg-faint">
          {asset.missing
            ? 'missing — relink'
            : `${asset.type} · ${fmtTime(asset.duration)}`}
        </p>
      </div>
    </div>
  )
}

export function MediaBin() {
  const assets = useProjectStore((s) => s.assets)
  const addAsset = useProjectStore((s) => s.addAsset)
  const [query, setQuery] = useState('')
  const [draggingOver, setDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = query
    ? assets.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : assets

  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      Array.from(files).forEach((file) => {
        const type = file.type.startsWith('video/')
          ? 'video'
          : file.type.startsWith('audio/')
          ? 'audio'
          : 'image'
        addAsset({
          id: Math.random().toString(36).slice(2),
          name: file.name,
          type,
          mime: file.type,
          size: file.size,
          duration: 0, // TODO: Phase 6 — decode actual duration
          url: URL.createObjectURL(file),
        })
      })
    },
    [addAsset],
  )

  return (
    <aside
      className="w-64 shrink-0 bg-surface-1 border-r border-border flex flex-col min-h-0"
      aria-label="Media bin"
    >
      {/* Header */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-border shrink-0">
        <span className="text-sm font-medium text-fg">Media</span>
        <button
          onClick={handleImport}
          className="h-7 px-2 rounded flex items-center gap-1 text-xs text-fg-dim border border-border hover:bg-surface-2 hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Upload size={13} aria-hidden="true" />
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,audio/*,image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Import media files"
        />
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border shrink-0">
        <label className="sr-only" htmlFor="media-search">Search media</label>
        <div className="h-8 px-2 rounded-md border border-border bg-surface flex items-center gap-2 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-1 focus-within:ring-offset-surface">
          <Search size={13} className="text-fg-faint shrink-0" aria-hidden="true" />
          <input
            id="media-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media"
            className="bg-transparent outline-none w-full text-sm text-fg placeholder:text-fg-faint"
          />
        </div>
      </div>

      {/* Asset list */}
      <div className="flex-1 overflow-auto p-2" role="list" aria-label="Media assets">
        {assets.length === 0 ? (
          <EmptyState
            icon={<Film size={20} />}
            title="No media yet"
            description="Import video, audio, or images to begin."
            action={
              <button
                onClick={handleImport}
                className="h-7 px-3 rounded text-xs text-fg-dim border border-border hover:bg-surface-2 hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Import files
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Search size={20} />} title="No results" description={`No media matching "${query}"`} />
        ) : (
          <div className="flex flex-col gap-0.5">
            {filtered.map((a) => (
              <AssetRow key={a.id} asset={a} />
            ))}
          </div>
        )}
      </div>

      {/* Drop zone */}
      <div
        className={[
          'mx-2 mb-2 rounded-md border border-dashed text-xs text-fg-faint grid place-items-center py-3 transition-colors',
          draggingOver ? 'border-accent text-accent bg-accent/5' : 'border-border-strong',
        ].join(' ')}
        onDragOver={(e) => { e.preventDefault(); setDraggingOver(true) }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDraggingOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        aria-label="Drop files here to import"
      >
        Drag files here to import
      </div>
    </aside>
  )
}
