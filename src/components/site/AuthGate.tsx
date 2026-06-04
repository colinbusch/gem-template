import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/lib/auth'

// Guards a route: unauthenticated visitors are redirected to /login
// with a ?redirect= param so they land back here after signing in.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (!isAuthenticated()) {
    const redirect = encodeURIComponent(location.pathname)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }
  return <>{children}</>
}
