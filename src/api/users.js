import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrapList, normalizeAdminUser, normalizeUser } from './normalize'

/** GET /users — admin user list. */
export async function listUsers(params = {}) {
  const { data } = await api.get(ENDPOINTS.users, { params })
  return unwrapList(data).map(normalizeAdminUser)
}

/**
 * GET /users — people the current user can message (directory). Returns a
 * compact { id, name, avatar } shape for the message composer.
 */
export async function listContacts(search = '') {
  const { data } = await api.get(ENDPOINTS.users, { params: search ? { search } : {} })
  return unwrapList(data).map((u) => {
    const n = normalizeUser(u)
    return { id: n.id, name: n.fullName, avatar: n.avatar, role: n.role }
  })
}
