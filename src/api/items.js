import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrap, unwrapList, normalizeItem } from './normalize'

/** GET /items — list of reports. Pass params for filtering/pagination. */
export async function listItems(params = {}) {
  const { data } = await api.get(ENDPOINTS.items, { params })
  return unwrapList(data).map(normalizeItem)
}

/** GET /items/:id — a single report. */
export async function getItem(id) {
  const { data } = await api.get(ENDPOINTS.item(id))
  return normalizeItem(unwrap(data))
}

/** POST /items — create a report. Accepts FormData (with photos) or a plain object. */
export async function createItem(payload) {
  const isForm = typeof FormData !== 'undefined' && payload instanceof FormData
  const { data } = await api.post(
    ENDPOINTS.items,
    payload,
    isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
  )
  return normalizeItem(unwrap(data))
}
