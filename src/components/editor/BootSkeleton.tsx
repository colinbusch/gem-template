export function BootSkeleton() {
  return (
    <div className="w-full h-screen bg-surface flex flex-col">
      {/* MenuBar skeleton */}
      <div className="h-12 shrink-0 bg-surface-1 border-b border-border flex items-center px-3 gap-3">
        <div className="h-7 w-7 rounded-md bg-surface-2 animate-pulse" />
        <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
        <div className="flex gap-2 ml-2">
          {[40, 32, 44].map((w, i) => (
            <div key={i} className="h-7 rounded bg-surface-2 animate-pulse" style={{ width: w }} />
          ))}
        </div>
      </div>
      {/* WorkspaceBar skeleton */}
      <div className="h-9 shrink-0 bg-surface-1 border-b border-border flex items-center px-3 gap-2">
        <div className="h-3 w-32 rounded bg-surface-2 animate-pulse" />
        <div className="flex-1" />
        <div className="h-3 w-48 rounded bg-surface-2 animate-pulse" />
      </div>
      {/* 3-col workspace skeleton */}
      <div className="flex-1 min-h-0 flex">
        <div className="w-64 border-r border-border p-3 flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-md bg-surface-2 animate-pulse" />
          ))}
        </div>
        <div className="flex-1 grid place-items-center p-6">
          <div className="w-full rounded-lg bg-surface-2 animate-pulse" style={{ aspectRatio: '16/9' }} />
        </div>
        <div className="w-72 border-l border-border p-3 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 rounded-md bg-surface-2 animate-pulse" />
          ))}
        </div>
      </div>
      {/* CommandBar skeleton */}
      <div className="h-14 shrink-0 border-t border-border flex items-center px-3 gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-16 rounded-md bg-surface-2 animate-pulse" />
        ))}
      </div>
      {/* Timeline skeleton */}
      <div className="h-56 shrink-0 border-t border-border p-3 flex flex-col gap-2">
        <div className="h-7 rounded bg-surface-2 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded bg-surface-2 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
