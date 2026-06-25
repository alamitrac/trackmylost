import api from './client'
import { ENDPOINTS } from './endpoints'

/**
 * POST /reports — flag a post as inappropriate/suspicious (Priority 3).
 * Stores reason + reporting user + target post + timestamp (server-side).
 * Requires an authenticated Sanctum token.
 */
export async function reportPost(postId, reason) {
  const { data } = await api.post(ENDPOINTS.reports, { post_id: postId, reason })
  return data
}

/** POST /comments/:id/report — flag a comment (Task 4). */
export async function reportComment(commentId, reason) {
  const { data } = await api.post(ENDPOINTS.commentReport(commentId), { reason })
  return data
}

/** POST /messages/:id/report — flag a message (Task 6). */
export async function reportMessage(messageId, reason) {
  const { data } = await api.post(ENDPOINTS.messageReport(messageId), { reason })
  return data
}
