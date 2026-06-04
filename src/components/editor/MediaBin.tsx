import { useCallback, useRef, useState } from 'react'
import { Upload, Film, Music, Image as ImageIcon, AlertTriangle, Search, Loader2 } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/project'
import { KIND_COLOR, fmtTime, uid } from '@/lib/utils'
import { extractVideoMeta, extractAudioMeta, extractImageMeta } from '@/lib/media'
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
      {/* Thumbnail */}
      <div
        className="h-10 w-16 rounded shrink-0 overflow-hidden"
        aria-hidden="true"
      >
        {asset.missing ? (
          <div className="h-full w-full grid place-items-center" style={{ border: '1px dashed #f0606b', color: '#f0606b' }}>
            <AlertTriangle size={15} />
          </div>
        ) : asset.thumbnail ? (
          <img src={asset.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : asset.type === 'image' && asset.url ? (
          <img src={asset.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center" style={{ background: 'rgb(var(--surface-2))', color }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm" style={asset.missing ? { color: '#f0606b' } : undefined}>
          {asset.name}
        </p>
        <p className="text-xs text-fg-faint">
          {asset.missing
            ? 'missing — relink'
            : `${asset.type}${asset.duration ? ` · ${fmtTime(asset.duration)}` : ''}${asset.width ? ` · ${asset.width}×${asset.height}` : ''}`}
        </p>
      </div>
    </div>
  )
}

export function MediaBin() {
  const assets       = useProjectStore((s) => s.assets)
  const addAsset     = useProjectStore((s) => s.addAsset)
  const updateAsset  = useProjectStore((s) => s.updateAsset)
  const [query, setQuery]           = useState('')
  const [draggingOver, setDraggingOver] = useState(false)
  const [importing, setImporting]   = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = query
    ? assets.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : assets

  const handleImport = useCallback(() => { fileInputRef.current?.click() }, [])

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      setImporting(true)
      try {
        for (const file of Array.from(files)) {
          const type: MediaAsset['type'] = file.type.startsWith('video/')
            ? 'video'
            : file.type.startsWith('audio/')
            ? 'audio'
            : 'image'

          // Add placeholder immediately so the asset appears in the list
          const assetId = uid()
          addAsset({ id: assetId, name: file.name, type, mime: file.type, size: file.size, duration: 0 })

          // Extract metadata and thumbnail asynchronously
          if (type === 'video') {
            const meta = await extractVideoMeta(file)
            updateAsset(assetId, {
              url: meta.url,
              duration: meta.duration,
              thumbnail: meta.thumbnail || undefined,
              width: meta.width || undefined,
              height: meta.height || undefined,
            })
          } else if (type === 'audio') {
            const meta = await extractAudioMeta(file)
            updateAsset(assetId, { url: meta.url, duration: meta.duration })
          } else {
            const meta = await extractImageMeta(file)
            updateAsset(assetId, {
              url: meta.url,
              width: meta.width || undefined,
              height: meta.height || undefined,
            })
          }
        }
      } finally {
        setImporting(false)
      }
    },
    [addAsset, updateAsset],
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
          disabled={importing}
          className="h-7 px-2 rounded flex items-center gap-1 text-xs text-fg-dim border border-border hover:bg-surface-2 hover:text-fg disabled:opacity-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {importing
            ? <Loader2 size={13} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            : <Upload size={13} aria-hidden="true" />}
          {importing ? 'Importing…' : 'Import'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,audio/*,image/*"
          className="sr-only"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
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
            {filtered.map((a) => <AssetRow key={a.id} asset={a} />)}
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
        onDrop={(e) => { e.preventDefault(); setDraggingOver(false); handleFiles(e.dataTransfer.files) }}
        aria-label="Drop files here to import"
      >
        Drag files here to import
      </div>
    </aside>
  )
}
