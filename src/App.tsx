import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Routes — lazy-loaded per phase
const PrimitivesDemo = lazy(() => import('./routes/demo/PrimitivesDemo'))
const WebEditor = lazy(() => import('./routes/web/WebEditor'))

// TODO: Phase 2 — Editor shell /web
// TODO: Phase 7 — Secondary routes: /, /login, /settings, /about
// TODO: Phase 8 — /matrix with auth guard

function LoadingShell() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-surface">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-fg" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingShell />}>
        <Routes>
          {/* Phase 2 — main editor */}
          <Route path="/web" element={<WebEditor />} />
          {/* Phase 1 primitives demo */}
          <Route path="/demo" element={<PrimitivesDemo />} />
          {/* Redirect root to /web until marketing page is built (Phase 7) */}
          <Route path="/" element={<Navigate to="/web" replace />} />
          {/* Legacy redirect */}
          <Route path="/app" element={<Navigate to="/web" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
