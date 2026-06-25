import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { TOKEN_KEY } from '../api/client'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

// Cache the user alongside the token so the session is restored INSTANTLY on
// reload (no flicker / no apparent logout) while we revalidate in the
// background.
const USER_KEY = 'tml_user'

function readCachedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function cacheUser(u) {
  try {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
  } catch {
    /* storage full / disabled — non-fatal */
  }
}

/**
 * Holds the authenticated user + Sanctum session.
 *
 * Persistence strategy (Priority 2):
 *  - The Sanctum token lives in localStorage and never expires client-side.
 *  - On mount we optimistically restore the cached user so the UI is logged in
 *    immediately, then revalidate via GET /user in the background.
 *  - We only DROP the session when the server explicitly says the token is
 *    invalid (HTTP 401). Transient failures (offline, 5xx, timeout) keep the
 *    user logged in, so a flaky network never forces a re-login.
 */
export function AuthProvider({ children }) {
  const hasToken = !!localStorage.getItem(TOKEN_KEY)
  const [user, setUser] = useState(() => (hasToken ? readCachedUser() : null))
  // If we already have a cached user we can render immediately; otherwise wait
  // for the probe before deciding.
  const [loading, setLoading] = useState(hasToken && !readCachedUser())

  // Keep the cached copy in sync with the live user.
  useEffect(() => {
    cacheUser(user)
  }, [user])

  // Restore / revalidate session from a stored token.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .fetchMe({ silentAuth: true })
      .then((u) => {
        setUser(u)
        cacheUser(u)
      })
      .catch((err) => {
        // Only a genuine 401 means the token is dead — clear everything.
        // Anything else (network/5xx) keeps the cached session intact.
        if (err?.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
          cacheUser(null)
          setUser(null)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials) => {
    // authApi.login stores the fresh Sanctum token (and clears any stale data).
    // The login *response* user is often partial — it can omit `role`, which
    // would make an admin look like a regular user. So always re-read the
    // authoritative user from GET /user; fall back to the login payload only if
    // that probe somehow returns nothing.
    const { user: u } = await authApi.login(credentials)
    let resolved
    try {
      resolved = await authApi.fetchMe()
    } catch {
      resolved = null
    }
    if (!resolved?.id) resolved = u
    setUser(resolved)
    return resolved
  }, [])

  const register = useCallback(async (payload) => {
    const { user: u, token } = await authApi.register(payload)
    // Prefer the authoritative user from GET /user so `role` and the rest of
    // the profile are always fresh, not whatever the register response echoed.
    let resolved = u
    if (token) {
      try {
        const me = await authApi.fetchMe()
        if (me?.id) resolved = me
      } catch {
        // Keep the register-response user if the probe fails.
      }
    }
    if (resolved?.id) setUser(resolved)
    return { user: resolved, token }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Even if the server call fails, always clear the local session.
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      cacheUser(null)
      setUser(null)
    }
  }, [])

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'administrator' || user?.role === 'moderateur',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
