/**
 * Geocoding via Nominatim (OpenStreetMap) — free, no API key, restricted to
 * Morocco (countrycodes=ma). Respect usage limits: callers debounce search.
 */
const BASE = 'https://nominatim.openstreetmap.org'

/** Forward search: returns [{ label, lat, lng }] for a query, within Morocco. */
export async function searchPlaces(query) {
  const q = query.trim()
  if (q.length < 2) return []
  const url = `${BASE}/search?format=jsonv2&countrycodes=ma&addressdetails=1&limit=6&accept-language=fr&q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return []
    const data = await res.json()
    return data.map((d) => ({
      label: shortLabel(d.address, d.display_name),
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
    }))
  } catch {
    return []
  }
}

/** Reverse geocode coords → a short place label (neighbourhood/city). */
export async function reverseGeocode(lat, lng) {
  const url = `${BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&accept-language=fr`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return ''
    const d = await res.json()
    return shortLabel(d.address, d.display_name)
  } catch {
    return ''
  }
}

/** Build a concise "quartier, ville" label from a Nominatim address object. */
function shortLabel(a = {}, fallback = '') {
  const local =
    a.neighbourhood || a.suburb || a.quarter || a.city_district || a.village || a.hamlet
  const city = a.city || a.town || a.municipality || a.county || a.state
  const parts = [local, city].filter(Boolean)
  if (parts.length) return [...new Set(parts)].join(', ')
  return (fallback || '').split(',').slice(0, 2).join(', ').trim()
}
