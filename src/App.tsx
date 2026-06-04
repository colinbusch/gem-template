import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const PrimitivesDemo = lazy(() => import('./routes/demo/PrimitivesDemo'))
const WebEditor      = lazy(() => import('./routes/web/WebEditor'))
const HomePage       = lazy(() => import('./routes/home/HomePage'))
const LoginPage      = lazy(() => import('./routes/login/LoginPage'))
const SettingsPage   = lazy(() => import('./routes/settings/SettingsPage'))
const AboutPage      = lazy(() => import('./routes/about/AboutPage'))

function LoadingShell() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-surface">
      <div className="h-5 w-5 animate-spin motion-reduce:animate-none rounded-full border-2 border-border border-t-fg" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingShell />}>
        <Routes>
          {/* Phase 7 — secondary routes */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about"    element={<AboutPage />} />
          {/* Main editor */}
          <Route path="/web"      element={<WebEditor />} />
          {/* Phase 1 primitives demo */}
          <Route path="/demo"     element={<PrimitivesDemo />} />
          {/* Legacy redirect */}
          <Route path="/app"      element={<WebEditor />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
