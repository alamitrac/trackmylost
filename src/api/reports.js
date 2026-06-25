import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrap, unwrapList, normalizeItem } from './normalize'

/**
 * Published lost-and-found reports for the home feed.
 *
 * These live in the backend `posts` table (PostController@index) — the
 * `/items` route is only a stub. We hit `/posts` and reuse the shared
 * `normalizeItem` mapper so each report comes back in the UI shape
 * (type, location, author, category, image, status, timeAgo…).
 *
 * Accepts the same query params the controller understands:
 *   - `type`        → 'lost' | 'found'
 *   - `category_id` → number
 *   - `search`      → string (matches title)
 *   - `per_page`    → paginator size
 *
 * Errors are NOT swallowed — they propagate so `useFetch` can surface an
 * error state instead of silently showing an empty feed.
 */
export async function listReports(params = {}) {
  const { data } = await api.get(ENDPOINTS.posts, { params })
  return unwrapList(data).map(normalizeItem)
}

/**
 * GET /posts/:id — a single published report (for the details page).
 * Public route; returns the UI-shaped report incl. the real `image` URL.
 */
export async function getReport(id) {
  const { data } = await api.get(ENDPOINTS.post(id))
  return normalizeItem(unwrap(data))
}

/** GET /posts/:id/matches — possible lost/found matches for a report (Feature 9). */
export async function getMatches(id) {
  const { data } = await api.get(ENDPOINTS.postMatches(id))
  return unwrapList(data)
}
