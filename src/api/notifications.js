import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrapList, normalizeNotification } from './normalize'

/** GET /notifications — alert/notification feed. */
export async function listNotifications() {
  const { data } = await api.get(ENDPOINTS.notifications)
  return unwrapList(data).map(normalizeNotification)
}

/** POST /notifications/:id/read — mark one as read (best-effort). */
export async function markRead(id) {
  try {
    await api.post(ENDPOINTS.notificationRead(id))
  } catch {
    // non-blocking
  }
}

/** POST /notifications/read-all — mark all as read (best-effort). */
export async function markAllRead() {
  try {
    await api.post(ENDPOINTS.notificationsReadAll)
  } catch {
    // non-blocking
  }
}
