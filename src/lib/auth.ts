// Mock auth state — localStorage-backed flag.
// Phase 8: gates /matrix. Real auth (OAuth + server session) is Phase 9+.
// All sign-in flows are demonstration-only; no real credentials are checked.

const AUTH_KEY = 'hurrcut-auth'

export function isAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

export function setAuthenticated(value: boolean): void {
  try {
    if (value) {
      localStorage.setItem(AUTH_KEY, 'true')
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  } catch {
    // localStorage unavailable (private browsing etc.) — treat as unauthenticated
  }
}
