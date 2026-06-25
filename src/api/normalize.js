/**
 * Response unwrapping + snake_case → UI-shape mappers.
 *
 * The Track My Lost UI was built against camelCase demo objects. Laravel
 * returns snake_case (and often wraps payloads in `{ data: ... }`). Every
 * mapper here is defensive: it accepts multiple field-name variants so a
 * small backend difference doesn't break a component. Adjust field names
 * here if your API uses different keys.
 */

/** Unwrap a single resource: `{ data: {...} }` | `{...}`. */
export function unwrap(payload) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload) {
    return payload.data
  }
  return payload
}

/**
 * Unwrap a collection. Handles all common Laravel shapes:
 *   - Plain array:                       `[...]`
 *   - Resource collection / paginator:   `{ data: [...], current_page, total, ... }`
 *   - Resource wrapping a paginator:     `{ data: { data: [...], current_page, ... } }`
 *
 * Returns `[]` (never null/undefined) so callers can always `.map` safely.
 */
export function unwrapList(payload) {
  if (Array.isArray(payload)) return payload
  // Laravel paginator: { current_page, data: [...], total, ... }
  if (Array.isArray(payload?.data)) return payload.data
  // ApiResource around a paginator: { data: { data: [...], current_page, ... } }
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

/** French relative time from an ISO date (falls back to the raw string). */
export function relativeTime(input) {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return typeof input === 'string' ? input : ''
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return "à l'instant"
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  if (diff < 604800) {
    const j = Math.floor(diff / 86400)
    return `il y a ${j} jour${j > 1 ? 's' : ''}`
  }
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Absolute date label, e.g. "12 Jan 2026". */
export function formatDate(input) {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return typeof input === 'string' ? input : ''
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Avatar URL with a generated fallback so the UI never shows a broken image. */
export function avatarFor(name, raw = {}) {
  const a = raw.avatar_url || raw.avatar || raw.photo || raw.photo_url || raw.image
  if (a) return a
  const label = encodeURIComponent(name || 'Utilisateur')
  return `https://ui-avatars.com/api/?name=${label}&background=16264f&color=fff&bold=true`
}

const join = (...parts) => parts.filter(Boolean).join(' ').trim()

/**
 * Collect ALL image URLs for a report, in order. Handles every shape the API
 * may use: `image_urls: []`, `images: [{url}|string]`, or a single
 * `image_url`/`image`. Returns a de-duplicated array (may be empty).
 */
export function resolveImages(raw = {}) {
  const out = []
  const push = (v) => {
    if (typeof v === 'string' && v.trim()) out.push(v.trim())
  }
  if (Array.isArray(raw.image_urls)) raw.image_urls.forEach(push)
  if (Array.isArray(raw.images)) {
    raw.images.forEach((im) => push(typeof im === 'string' ? im : im?.url || im?.image_url || im?.path))
  }
  if (!out.length) {
    push(raw.image_url)
    push(raw.photo_url)
    push(raw.image)
    push(raw.photo)
  }
  return [...new Set(out)]
}

/** API user → UI user (currentUser shape). */
export function normalizeUser(raw = {}) {
  const first = raw.first_name || raw.firstName || raw.prenom || ''
  const last = raw.last_name || raw.lastName || raw.nom || ''
  const full =
    raw.full_name || raw.name || join(first, last) || (raw.email ? raw.email.split('@')[0] : 'Utilisateur')
  return {
    id: raw.id ?? raw.uuid,
    firstName: first || full.split(' ')[0] || '',
    lastName: last || full.split(' ').slice(1).join(' ') || '',
    fullName: full,
    email: raw.email || '',
    phone: raw.phone || raw.telephone || raw.tel || '',
    birthDate: raw.birth_date || raw.birthdate || raw.date_of_birth || raw.birthDate || '',
    gender: raw.gender || raw.sexe || '',
    city: raw.city || raw.ville || '',
    bio: raw.bio || '',
    avatar: avatarFor(full, raw),
    verified: raw.verified ?? raw.is_verified ?? raw.email_verified_at != null,
    role: raw.role || (raw.is_admin ? 'admin' : 'user'),
    status: raw.status || 'active',
    createdAt: raw.created_at || raw.createdAt || '',
    stats: {
      signalements: raw.stats?.signalements ?? raw.items_count ?? raw.posts_count ?? raw.signalements_count ?? 0,
      contributions: raw.stats?.contributions ?? raw.contributions_count ?? 0,
      resolus: raw.stats?.resolus ?? raw.resolved_count ?? 0,
      joursActif: raw.stats?.joursActif ?? raw.active_days ?? 0,
    },
  }
}

/** API user → admin table row. */
export function normalizeAdminUser(raw = {}) {
  const u = normalizeUser(raw)
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    city: u.city || '—',
    avatar: u.avatar,
    role: u.role,
    status: raw.status || (raw.is_active === false || raw.suspended ? 'suspendu' : 'actif'),
    joined: raw.joined || formatDate(raw.created_at),
    posts: raw.posts ?? raw.items_count ?? u.stats.signalements ?? 0,
  }
}

/** API report → UI item (CardItem / ItemDetails shape). */
export function normalizeItem(raw = {}) {
  const authorRaw = raw.author || raw.user || raw.owner || {}
  const authorName =
    authorRaw.full_name || authorRaw.name || join(authorRaw.first_name, authorRaw.last_name) || 'Utilisateur'
  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((t) => (typeof t === 'string' ? t : t.name || t.label)).filter(Boolean)
    : typeof raw.tags === 'string'
      ? raw.tags.split(',').map((s) => s.trim()).filter(Boolean)
      : []
  return {
    id: raw.id ?? raw.uuid,
    type: raw.type || 'lost',
    kind: raw.kind || raw.category_type || 'objet',
    urgency: raw.urgency || raw.priority || 'normal',
    category: raw.category?.name || raw.category || raw.category_name || raw.category_id || '',
    categoryId: raw.category_id ?? raw.category?.id ?? '',
    title: raw.title || raw.name || 'Sans titre',
    description: raw.description || raw.details || '',
    location: raw.location || raw.quartier || raw.area || raw.address || '',
    city: raw.city || raw.ville || '',
    date: raw.date || raw.lost_date || raw.found_date || raw.created_at || '',
    timeAgo: raw.time_ago || relativeTime(raw.created_at || raw.date),
    // ALL images of the report as absolute URLs (gallery support). Prefer the
    // backend's `image_urls`; fall back to a single image / image objects.
    // No synthetic/placeholder fallback — an empty list means "no image".
    images: resolveImages(raw),
    // First image, kept for any consumer that still reads a single `image`.
    image:
      (Array.isArray(raw.image_urls) && raw.image_urls[0]) ||
      raw.image_url ||
      raw.photo_url ||
      raw.image ||
      '',
    tags,
    author: {
      id: authorRaw.id ?? raw.user_id,
      name: authorName,
      avatar: avatarFor(authorName, authorRaw),
    },
    comments: raw.comments_count ?? raw.comments ?? 0,
    views: raw.views ?? raw.views_count ?? 0,
    favorited: raw.is_favorited ?? raw.favorited ?? false,
    hidden: raw.hidden ?? false,
    lat: raw.lat != null ? Number(raw.lat) : null,
    lng: raw.lng != null ? Number(raw.lng) : null,
    status: raw.status || 'actif',
    contactPhone: raw.contact_phone || raw.phone || authorRaw.phone || '',
  }
}

/** API comment → UI comment. */
export function normalizeComment(raw = {}) {
  const userRaw = raw.user || raw.author || {}
  const name =
    userRaw.full_name || userRaw.name || join(userRaw.first_name, userRaw.last_name) || 'Utilisateur'
  return {
    id: raw.id ?? `c-${Math.random().toString(36).slice(2)}`,
    content: raw.content || raw.body || raw.text || '',
    author: { id: userRaw.id ?? raw.user_id, name, avatar: avatarFor(name, userRaw) },
    timeAgo: relativeTime(raw.created_at || raw.date),
  }
}

/** API message → UI chat bubble. `from` is 'me' | 'them'. */
export function normalizeMessage(raw = {}, currentUserId) {
  const senderId = raw.sender_id ?? raw.user_id ?? raw.from_id
  const from =
    raw.from ||
    (senderId != null && currentUserId != null
      ? String(senderId) === String(currentUserId)
        ? 'me'
        : 'them'
      : 'them')
  return {
    id: raw.id ?? `m-${Math.random().toString(36).slice(2)}`,
    from,
    text: raw.text || raw.body || raw.message || raw.content || '',
    time: raw.time || relativeTime(raw.created_at),
    type: raw.type,
    fromAdmin: raw.is_admin ?? raw.fromAdmin ?? false,
  }
}

/** API conversation → UI thread. */
export function normalizeConversation(raw = {}, currentUserId) {
  const other = raw.other_user || raw.user || raw.participant || raw.with || raw.contact || {}
  const name =
    other.full_name || other.name || join(other.first_name, other.last_name) || raw.name || 'Conversation'
  const messages = (raw.messages || []).map((m) => normalizeMessage(m, currentUserId))
  const lastRaw = raw.last_message ?? (messages.length ? messages[messages.length - 1].text : '')
  const lastMessage = typeof lastRaw === 'string' ? lastRaw : lastRaw?.text || lastRaw?.body || ''
  return {
    id: raw.id,
    name,
    avatar: avatarFor(name, other),
    online: other.online ?? raw.online ?? false,
    lastMessage,
    time: raw.time || relativeTime(raw.updated_at || raw.last_message?.created_at),
    unread: raw.unread ?? raw.unread_count ?? 0,
    subject: raw.subject || raw.item?.title || '',
    messages,
  }
}

/** API notification → UI feed item. */
export function normalizeNotification(raw = {}) {
  return {
    id: raw.id,
    type: raw.type || 'system',
    title: '',
    body: raw.content || raw.body || raw.message || '',
    timeAgo: relativeTime(raw.created_at),
    unread: raw.is_read != null ? !raw.is_read : (raw.read_at == null),
    link: raw.link || '',
    relatedId: raw.related_id ?? null,
  }
}
