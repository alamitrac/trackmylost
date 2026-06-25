import { useEffect, useRef } from 'react'

/* Load Leaflet (OpenStreetMap) from CDN once, no API key required. */
let leafletPromise = null
function loadLeaflet() {
  if (typeof window !== 'undefined' && window.L) return Promise.resolve(window.L)
  if (leafletPromise) return leafletPromise
  leafletPromise = new Promise((resolve, reject) => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    s.onload = () => resolve(window.L)
    s.onerror = reject
    document.head.appendChild(s)
  })
  return leafletPromise
}

/**
 * OpenStreetMap (Leaflet) map.
 * @param {number} lat
 * @param {number} lng
 * @param {(coords:{lat:number,lng:number})=>void} onChange  if set, the map is
 *        a picker: clicking moves the marker and reports the coordinates.
 * @param {boolean} interactive  enable click-to-place
 * @param {number} height
 * @param {number} zoom
 */
export default function LeafletMap({ lat, lng, onChange, interactive = false, height = 260, zoom }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    loadLeaflet().then((L) => {
      if (cancelled || !elRef.current || mapRef.current) return
      const hasPoint = lat != null && lng != null
      const center = hasPoint ? [lat, lng] : [31.7917, -7.0926] // Morocco
      const z = zoom ?? (hasPoint ? 14 : 5)

      const map = L.map(elRef.current).setView(center, z)
      mapRef.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      const place = (a, b) => {
        if (markerRef.current) markerRef.current.setLatLng([a, b])
        else markerRef.current = L.marker([a, b]).addTo(map)
      }
      if (hasPoint) place(lat, lng)

      if (interactive && onChange) {
        map.on('click', (e) => {
          place(e.latlng.lat, e.latlng.lng)
          onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
        })
      }

      // Containers/modals that mount hidden need a size recalculation.
      setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 120)
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the marker/view in sync when coordinates change (view mode).
  useEffect(() => {
    const L = typeof window !== 'undefined' ? window.L : null
    if (!L || !mapRef.current || lat == null || lng == null) return
    if (markerRef.current) markerRef.current.setLatLng([lat, lng])
    else markerRef.current = L.marker([lat, lng]).addTo(mapRef.current)
    mapRef.current.setView([lat, lng], mapRef.current.getZoom() || 14)
  }, [lat, lng])

  return (
    <div
      ref={elRef}
      style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', background: '#dde8f0', zIndex: 0 }}
    />
  )
}
