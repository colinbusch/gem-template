import { Link } from 'react-router-dom'
import { Scissors } from 'lucide-react'

export function PageNav() {
  return (
    <nav
      className="h-12 shrink-0 bg-surface-1 border-b border-border flex items-center px-6 gap-6"
      aria-label="Site navigation"
    >
      {/* Brand */}
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        <span
          className="h-6 w-6 rounded grid place-items-center shrink-0"
          style={{ background: '#58d3ff', color: '#070b10' }}
          aria-hidden="true"
        >
          <Scissors size={14} />
        </span>
        HurrCut
      </Link>

      <div className="flex-1" />

      {/* Nav links */}
      <Link
        to="/about"
        className="text-sm text-fg-dim hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        About
      </Link>
      <Link
        to="/settings"
        className="text-sm text-fg-dim hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        Settings
      </Link>
      <Link
        to="/web"
        className="h-8 px-3 rounded-md bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
      >
        Open editor
      </Link>
    </nav>
  )
}
