import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrapList, normalizeItem } from './normalize'

/** GET /favorites — the current user's saved reports (UI-shaped). */
export async function listFavorites() {
  const { data } = await api.get(ENDPOINTS.favorites)
  return unwrapList(data).map(normalizeItem)
}

/** POST /favorites — save a report. Returns { favorited: true }. */
export async function addFavorite(postId) {
  const { data } = await api.post(ENDPOINTS.favorites, { post_id: postId })
  return data
}

/** DELETE /favorites/:postId — unsave a report. Returns { favorited: false }. */
export async function removeFavorite(postId) {
  const { data } = await api.delete(ENDPOINTS.favorite(postId))
  return data
}
