import { useEffect, useRef, useState } from 'react'
import { FiSearch, FiMapPin, FiLoader } from 'react-icons/fi'
import LeafletMap from './LeafletMap'
import { searchLocalPlaces } from '../data/morocco'
import { searchPlaces, reverseGeocode } from '../api/geocode'
import './LocationPicker.css'

/**
 * Location picker (Task 3): address autocomplete (local Moroccan dataset +
 * Nominatim) and an interactive Leaflet map. Clicking the map drops a marker
 * and reverse-geocodes the place name. Selecting a suggestion centers the map.
 *
 * @param {{lat:number, lng:number, label:string}} value
 * @param {(v:{lat:number,lng:number,label:string})=>void} onChange
 */
export default function LocationPicker({ value, onChange }) {
  const [q, setQ] = useState(value?.label || '')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const boxRef = useRef(null)
  const debounceRef = useRef(null)

  // Keep input text in sync if the label is set externally (e.g. map click).
  useEffect(() => {
    if (value?.label && value.label !== q) setQ(value.label)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.label])

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const onType = (text) => {
    setQ(text)
    setOpen(true)
    // Instant local matches.
    const local = searchLocalPlaces(text)
    setSuggestions(local)
    // Debounced Nominatim search, merged with local (deduped by label).
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (text.trim().length < 2) {
      setSearching(false)
      return
    }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const remote = await searchPlaces(text)
      const seen = new Set(local.map((p) => p.label.toLowerCase()))
      const merged = [...local]
      for (const r of remote) {
        if (!seen.has(r.label.toLowerCase())) {
          merged.push(r)
          seen.add(r.label.toLowerCase())
        }
      }
      setSuggestions(merged.slice(0, 8))
      setSearching(false)
    }, 450)
  }

  const select = (s) => {
    onChange({ lat: s.lat, lng: s.lng, label: s.label })
    setQ(s.label)
    setOpen(false)
  }

  // Map click → drop marker + reverse geocode the label.
  const onMapClick = async ({ lat, lng }) => {
    onChange({ lat, lng, label: value?.label || '' })
    const label = await reverseGeocode(lat, lng)
    onChange({ lat, lng, label: label || `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
  }

  return (
    <div className="locpick">
      <p className="locpick__hint">
        <FiMapPin /> Cliquez sur la carte ou recherchez une adresse pour marquer l'endroit
      </p>

      <div className="locpick__search" ref={boxRef}>
        <span className="locpick__search-icon">{searching ? <FiLoader className="spin" /> : <FiSearch />}</span>
        <input
          type="text"
          placeholder="Rechercher une adresse (ville, quartier…)"
          value={q}
          onChange={(e) => onType(e.target.value)}
          onFocus={() => q && setOpen(true)}
        />
        {open && suggestions.length > 0 && (
          <ul className="locpick__suggestions">
            {suggestions.map((s, i) => (
              <li key={`${s.label}-${i}`}>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); select(s) }}>
                  <FiMapPin /> {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <LeafletMap
        lat={value?.lat}
        lng={value?.lng}
        interactive
        onChange={onMapClick}
        height={300}
      />

      {value?.label && (
        <p className="locpick__selected">
          <FiMapPin /> Lieu sélectionné : <strong>{value.label}</strong>
        </p>
      )}
    </div>
  )
}
