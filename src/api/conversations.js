import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrap, unwrapList, normalizeConversation, normalizeMessage } from './normalize'

/** GET /conversations — message threads for the current user. */
export async function listConversations(currentUserId) {
  const { data } = await api.get(ENDPOINTS.conversations)
  return unwrapList(data).map((c) => normalizeConversation(c, currentUserId))
}

/** POST /conversations/:id/messages — send a message; returns the created message. */
export async function sendMessage(conversationId, text, currentUserId) {
  const { data } = await api.post(ENDPOINTS.messages(conversationId), {
    text,
    body: text,
    message: text,
  })
  return normalizeMessage(unwrap(data) || { text, from: 'me' }, currentUserId)
}

/** POST /conversations/:userId/read — mark a thread's incoming messages read. */
export async function markConversationRead(userId) {
  try {
    await api.post(ENDPOINTS.conversationRead(userId))
  } catch {
    // non-blocking
  }
}

/** GET /messages/unread-count — total unread for the navbar badge. */
export async function unreadCount() {
  try {
    const { data } = await api.get(ENDPOINTS.unreadCount)
    return data?.count ?? 0
  } catch {
    return 0
  }
}
