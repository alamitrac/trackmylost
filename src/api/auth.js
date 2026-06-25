import api, { TOKEN_KEY } from './client'
import { ENDPOINTS } from './endpoints'
import { unwrap, normalizeUser } from './normalize'

// A legacy build cached the logged-in user under this key. The current app
// never reads it, but we clear it on every auth transition so a stale value
// can't linger and confuse anyone inspecting storage.
const LEGACY_USER_KEY = 'user'

/** Remove every piece of locally stored auth state. */
export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(LEGACY_USER_KEY)
}

/** Pull the bearer token out of whatever shape the login/register returns. */
function extractToken(payload = {}) {
  return (
    payload.token ||
    payload.access_token ||
    payload.plainTextToken ||
    payload?.data?.token ||
    payload?.data?.access_token ||
    null
  )
}

/** Pull the user object out of the auth response (or fall back to the body). */
function extractUser(payload = {}) {
  const raw = payload.user || payload?.data?.user || (payload.data && !payload.token ? payload.data : payload)
  return normalizeUser(raw)
}

export async function login(credentials) {
  const { data } = await api.post(ENDPOINTS.login, credentials)
  const token = extractToken(data)
  // Start from a clean slate so no stale user data survives a re-login.
  clearAuthStorage()
  if (token) localStorage.setItem(TOKEN_KEY, token)
  return { token, user: extractUser(data) }
}

export async function register(payload) {
  const { data } = await api.post(ENDPOINTS.register, payload)
  const token = extractToken(data)
  clearAuthStorage()
  if (token) localStorage.setItem(TOKEN_KEY, token)
  return { token, user: extractUser(data) }
}

export async function logout() {
  try {
    await api.post(ENDPOINTS.logout)
  } catch {
    // Ignore — we clear local auth state regardless.
  }
  clearAuthStorage()
}

export async function fetchMe({ silentAuth = false } = {}) {
  const { data } = await api.get(ENDPOINTS.me, { silentAuth })
  return normalizeUser(unwrap(data))
}
