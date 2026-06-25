import axios from 'axios'

/**
 * Pre-configured Axios instance for the Laravel API.
 * Base URL comes from Vite env (VITE_API_URL); defaults to the local
 * Laravel dev server. Auth uses Sanctum personal-access (bearer) tokens.
 */
export const TOKEN_KEY = 'tml_token'

// Default to `/api` (relative) so requests go through the Vite dev proxy
// defined in vite.config.js — that bypasses CORS in dev. In production,
// set VITE_API_URL to the absolute backend URL (with CORS configured on
// Laravel's side).
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    // Forces Laravel to return JSON (incl. 422 validation errors) instead of HTML.
    Accept: 'application/json',
  },
})

// Attach the stored Sanctum bearer token to every request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 (expired / missing token) clear the session and bounce to login,
// unless the failing request *was* a login/register attempt.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const cfg = error?.config || {}
    const url = cfg.url || ''
    const isAuthCall = /\/(login|register)$/.test(url)
    // `silentAuth` requests (e.g. the session-restore probe) handle their own
    // failure and must not trigger a global redirect.
    if (status === 401 && !isAuthCall && !cfg.silentAuth) {
      localStorage.removeItem(TOKEN_KEY)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
