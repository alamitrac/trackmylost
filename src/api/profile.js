import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrap, normalizeUser } from './normalize'

/**
 * POST /profile — update the current user's profile (Feature 1).
 * Accepts a plain object (JSON) or FormData (avatar upload). Returns the
 * normalized, updated user.
 */
export async function updateProfile(payload) {
  const isForm = typeof FormData !== 'undefined' && payload instanceof FormData
  const { data } = await api.post(
    ENDPOINTS.profile,
    payload,
    isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
  )
  return normalizeUser(data?.user || unwrap(data))
}
