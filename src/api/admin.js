import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrapList } from './normalize'

/** Admin / moderation API (Priority 7). All require an admin token. */

export async function adminStats() {
  const { data } = await api.get(ENDPOINTS.adminStats)
  return data
}

export async function adminReports() {
  const { data } = await api.get(ENDPOINTS.adminReports)
  return unwrapList(data)
}

export async function adminPosts() {
  const { data } = await api.get(ENDPOINTS.adminPosts)
  return unwrapList(data)
}

export async function adminToggleHide(id) {
  const { data } = await api.patch(ENDPOINTS.adminPostHide(id))
  return data
}

export async function adminDeletePost(id) {
  const { data } = await api.delete(ENDPOINTS.adminPost(id))
  return data
}

export async function adminComments() {
  const { data } = await api.get(ENDPOINTS.adminComments)
  return unwrapList(data)
}

export async function adminDeleteComment(id) {
  const { data } = await api.delete(ENDPOINTS.adminComment(id))
  return data
}

export async function adminUsers() {
  const { data } = await api.get(ENDPOINTS.adminUsers)
  return unwrapList(data)
}

export async function adminSetUserStatus(id, status) {
  const { data } = await api.patch(ENDPOINTS.adminUserStatus(id), { status })
  return data
}

export async function adminLogs() {
  const { data } = await api.get(ENDPOINTS.adminLogs)
  return unwrapList(data)
}

/** POST /admin/messages — send a direct message to a user (Feature 4). */
export async function adminSendMessage(userId, content) {
  const { data } = await api.post(ENDPOINTS.adminMessages, { user_id: userId, content })
  return data
}

/** GET /admin/matches — potential lost/found matches for review (Feature 9). */
export async function adminMatches() {
  const { data } = await api.get(ENDPOINTS.adminMatches)
  return data
}

/* ---- Moderation: reported comments & messages (Tasks 4 & 6) ---- */

export async function adminCommentReports() {
  const { data } = await api.get(ENDPOINTS.adminCommentReports)
  return unwrapList(data)
}

export async function adminIgnoreCommentReport(id) {
  const { data } = await api.post(ENDPOINTS.adminCommentReportIgnore(id))
  return data
}

export async function adminMessageReports() {
  const { data } = await api.get(ENDPOINTS.adminMessageReports)
  return unwrapList(data)
}

export async function adminIgnoreMessageReport(id) {
  const { data } = await api.post(ENDPOINTS.adminMessageReportIgnore(id))
  return data
}

/** DELETE /admin/messages/:id — delete a reported message. */
export async function adminDeleteMessage(id) {
  const { data } = await api.delete(ENDPOINTS.adminMessage(id))
  return data
}
