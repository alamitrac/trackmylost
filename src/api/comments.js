import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrapList, unwrap, normalizeComment } from './normalize'

/**
 * GET /comments?post_id=:id — public list of a report's comments (newest first
 * from the backend; we return them oldest-first for a natural reading order).
 */
export async function listComments(postId) {
  const { data } = await api.get(ENDPOINTS.comments, { params: { post_id: postId } })
  return unwrapList(data).map(normalizeComment).reverse()
}

/**
 * POST /comments — add a comment to a report. Requires an authenticated
 * Sanctum token (enforced by the backend).
 */
export async function createComment(postId, content) {
  const { data } = await api.post(ENDPOINTS.comments, { post_id: postId, content })
  return normalizeComment(unwrap(data))
}
