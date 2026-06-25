import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrapList } from './normalize'

/* Demo categories used ONLY when VITE_USE_DEMO_FALLBACK=true, so a real
   API error never masquerades as successful data. */
const DEMO_CATEGORIES = [
  { id: 'electronics', name: 'Électronique',          description: 'Téléphones, ordinateurs, écouteurs…',  icon: 'smartphone', count: 142 },
  { id: 'documents',   name: 'Papiers & identité',     description: 'CIN, permis, passeports, cartes…',     icon: 'file',       count: 98 },
  { id: 'keys',        name: 'Clés',                   description: 'Maison, voiture, casiers, badges…',    icon: 'key',        count: 67 },
  { id: 'bags',        name: 'Sacs & bagages',         description: 'Sacs à main, sacs à dos, valises…',    icon: 'briefcase',  count: 54 },
  { id: 'pets',        name: 'Animaux',                description: 'Chiens, chats et autres compagnons.',  icon: 'heart',      count: 31 },
  { id: 'vehicles',    name: 'Véhicules',              description: 'Vélos, scooters, motos, voitures…',    icon: 'truck',      count: 22 },
  { id: 'jewelry',     name: 'Bijoux & accessoires',   description: 'Bagues, montres, lunettes…',           icon: 'star',       count: 41 },
  { id: 'other',       name: 'Autres',                 description: "Tout ce qui n'entre pas ci-dessus.",   icon: 'box',        count: 18 },
]

const USE_DEMO_FALLBACK = String(import.meta.env.VITE_USE_DEMO_FALLBACK || '').toLowerCase() === 'true'

function normalizeCategory(raw = {}) {
  const id = raw.id ?? raw.slug ?? raw.uuid
  return {
    id,
    slug: raw.slug || String(id ?? ''),
    name: raw.name || raw.title || raw.label || '',
    description: raw.description || raw.subtitle || '',
    icon: raw.icon || raw.icon_name || '',
    count: raw.count ?? raw.posts_count ?? raw.items_count ?? 0,
  }
}

/**
 * GET /categories. Errors propagate so the UI can show them. Handles both
 * plain arrays and Laravel paginators / resource collections via
 * `unwrapList`.
 */
export async function listCategories() {
  try {
    const { data } = await api.get(ENDPOINTS.categories)
    return unwrapList(data).map(normalizeCategory)
  } catch (err) {
    console.error('[listCategories] API call failed:', err?.response?.status, err?.message, err?.response?.data)
    if (USE_DEMO_FALLBACK) return DEMO_CATEGORIES
    throw err
  }
}
