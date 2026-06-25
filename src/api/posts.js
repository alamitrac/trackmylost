import api from './client'
import { ENDPOINTS } from './endpoints'
import { unwrap, unwrapList, relativeTime } from './normalize'

/* Demo content kept ONLY as an explicit dev-mode fallback when there is no
   backend at all. It is never used to mask a real API error — those must
   surface to the UI so misconfigurations get noticed. Enable by setting
   VITE_USE_DEMO_FALLBACK=true in .env. */
const DEMO_POSTS = [
  {
    id: 'demo-1',
    title: 'Comment retrouver un objet perdu en 24h',
    excerpt: "Les bons réflexes à adopter dès la première heure pour maximiser vos chances.",
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80&auto=format&fit=crop',
    category: 'Guide',
    author: 'Yasmine A.',
    publishedAt: '2026-05-21',
  },
  {
    id: 'demo-2',
    title: 'Casablanca : 320 objets restitués ce mois-ci',
    excerpt: "Retour sur une opération coordonnée avec les commerces du centre-ville.",
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80&auto=format&fit=crop',
    category: 'Communauté',
    author: 'Karim B.',
    publishedAt: '2026-05-18',
  },
  {
    id: 'demo-3',
    title: "Protéger ses papiers d'identité en voyage",
    excerpt: "Checklist simple et concrète à garder dans votre téléphone.",
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&q=80&auto=format&fit=crop',
    category: 'Conseils',
    author: 'Sofia M.',
    publishedAt: '2026-05-12',
  },
  {
    id: 'demo-4',
    title: 'Nouvelle fonctionnalité : alertes par quartier',
    excerpt: "Recevez en temps réel les signalements autour de chez vous.",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
    category: 'Produit',
    author: 'Équipe TML',
    publishedAt: '2026-05-04',
  },
  {
    id: 'demo-5',
    title: "Témoignage : « J'ai retrouvé mon chien en 3 heures »",
    excerpt: "L'histoire d'Inès, à Rabat, et de la chaîne d'entraide qui l'a aidée.",
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&q=80&auto=format&fit=crop',
    category: 'Témoignages',
    author: 'Inès K.',
    publishedAt: '2026-04-29',
  },
  {
    id: 'demo-6',
    title: 'Sécurité : ne partagez jamais ces informations',
    excerpt: "Quelques règles simples pour éviter les arnaques au signalement.",
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80&auto=format&fit=crop',
    category: 'Sécurité',
    author: 'Équipe TML',
    publishedAt: '2026-04-22',
  },
]

const USE_DEMO_FALLBACK = String(import.meta.env.VITE_USE_DEMO_FALLBACK || '').toLowerCase() === 'true'

const placeholderImage = (id) =>
  `https://picsum.photos/seed/tml-post-${id ?? Math.random().toString(36).slice(2)}/900/600`

function normalizePost(raw = {}) {
  const id = raw.id ?? raw.uuid ?? raw.slug
  return {
    id,
    slug: raw.slug || String(id ?? ''),
    title: raw.title || raw.name || 'Sans titre',
    excerpt: raw.excerpt || raw.summary || raw.description || '',
    image:
      raw.image ||
      raw.image_url ||
      raw.cover ||
      raw.cover_url ||
      raw.thumbnail ||
      raw.featured_image ||
      (Array.isArray(raw.images) && (raw.images[0]?.url || raw.images[0])) ||
      placeholderImage(id),
    category: raw.category?.name || raw.category || raw.category_name || '',
    author: raw.author?.name || raw.author || raw.user?.name || '',
    publishedAt: raw.published_at || raw.created_at || raw.date || '',
    timeAgo: relativeTime(raw.published_at || raw.created_at || raw.date),
  }
}

/** Format a post date as "21 mai 2026". */
export function formatPostDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * GET /posts — recent articles for the homepage.
 *
 * Laravel paginators return `{ current_page, data: [...], total, ... }`.
 * `unwrapList` already pulls `data` out for us. Errors are NOT swallowed —
 * they propagate so `useFetch` can show an error state (and so a broken
 * backend doesn't masquerade as "data displayed".)
 *
 * Pass `{ limit }` to cap results client-side. Sent to Laravel as both
 * `per_page` (paginator) and `limit` (custom controllers).
 */
export async function listPosts({ limit } = {}) {
  const params = limit ? { per_page: limit, limit } : {}
  try {
    const { data } = await api.get(ENDPOINTS.posts, { params })
    const list = unwrapList(data).map(normalizePost)
    return limit ? list.slice(0, limit) : list
  } catch (err) {
    console.error('[listPosts] API call failed:', err?.response?.status, err?.message, err?.response?.data)
    if (USE_DEMO_FALLBACK) {
      return limit ? DEMO_POSTS.slice(0, limit) : DEMO_POSTS
    }
    throw err
  }
}

/**
 * POST /posts — create a new report (signalement).
 *
 * This is the route that actually persists to the `posts` table the home
 * feed reads from (the `/items` route is only a stub). Requires an
 * authenticated Sanctum token.
 *
 * The backend (PostController@store) validates:
 *   - title        (required, string)
 *   - description  (required, string)
 *   - type         (required, lost|found)
 *   - location     (required, string)
 *   - category_id  (required, exists:categories,id)
 *   - image        (optional, single image file: jpg/jpeg/png, ≤2 MB)
 *
 * Pass a plain object for a JSON body, or a FormData (when including an
 * image file) — the correct content-type is set automatically.
 */
export async function createPost(payload) {
  const isForm = typeof FormData !== 'undefined' && payload instanceof FormData
  const { data } = await api.post(
    ENDPOINTS.posts,
    payload,
    isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
  )
  return unwrap(data)
}

/**
 * PUT /posts/:id — update a report (owner only). Accepts an object or
 * FormData (with images); for FormData we use POST + _method=PUT so PHP parses
 * the multipart body. (Feature 2)
 */
export async function updatePost(id, payload) {
  const isForm = typeof FormData !== 'undefined' && payload instanceof FormData
  if (isForm) {
    payload.append('_method', 'PUT')
    const { data } = await api.post(ENDPOINTS.post(id), payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return unwrap(data)
  }
  const { data } = await api.put(ENDPOINTS.post(id), payload)
  return unwrap(data)
}

/** DELETE /posts/:id — delete a report (owner or admin). (Feature 2) */
export async function deletePost(id) {
  const { data } = await api.delete(ENDPOINTS.post(id))
  return data
}

/** Mark a lost report as found/resolved (owner or admin). (Task 5) */
export async function markAsFound(id) {
  const { data } = await api.put(ENDPOINTS.post(id), { status: 'resolved' })
  return unwrap(data)
}
