/**
 * Local dataset of Moroccan cities + Casablanca neighborhoods (with coords),
 * used for instant autocomplete suggestions in the location picker. Nominatim
 * is queried in addition for broader coverage / reverse geocoding.
 */
export const MOROCCO_PLACES = [
  // --- Major cities ---
  { name: 'Casablanca', label: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { name: 'Rabat', label: 'Rabat', lat: 34.0209, lng: -6.8416 },
  { name: 'Salé', label: 'Salé', lat: 34.0531, lng: -6.7985 },
  { name: 'Témara', label: 'Témara', lat: 33.9287, lng: -6.9067 },
  { name: 'Marrakech', label: 'Marrakech', lat: 31.6295, lng: -7.9811 },
  { name: 'Fès', label: 'Fès', lat: 34.0331, lng: -5.0003 },
  { name: 'Tanger', label: 'Tanger', lat: 35.7595, lng: -5.834 },
  { name: 'Agadir', label: 'Agadir', lat: 30.4278, lng: -9.5981 },
  { name: 'Meknès', label: 'Meknès', lat: 33.8935, lng: -5.5473 },
  { name: 'Oujda', label: 'Oujda', lat: 34.6814, lng: -1.9086 },
  { name: 'Kénitra', label: 'Kénitra', lat: 34.261, lng: -6.5802 },
  { name: 'Tétouan', label: 'Tétouan', lat: 35.5785, lng: -5.3684 },
  { name: 'Safi', label: 'Safi', lat: 32.2994, lng: -9.2372 },
  { name: 'Mohammedia', label: 'Mohammedia', lat: 33.6861, lng: -7.3829 },
  { name: 'Khouribga', label: 'Khouribga', lat: 32.8811, lng: -6.9063 },
  { name: 'El Jadida', label: 'El Jadida', lat: 33.2316, lng: -8.5007 },
  { name: 'Béni Mellal', label: 'Béni Mellal', lat: 32.3373, lng: -6.3498 },
  { name: 'Nador', label: 'Nador', lat: 35.1681, lng: -2.9335 },
  { name: 'Taza', label: 'Taza', lat: 34.21, lng: -4.01 },
  { name: 'Settat', label: 'Settat', lat: 33.001, lng: -7.616 },
  { name: 'Berrechid', label: 'Berrechid', lat: 33.2655, lng: -7.587 },
  { name: 'Khémisset', label: 'Khémisset', lat: 33.8242, lng: -6.066 },
  { name: 'Larache', label: 'Larache', lat: 35.1932, lng: -6.1557 },
  { name: 'Khénifra', label: 'Khénifra', lat: 32.9394, lng: -5.668 },
  { name: 'Guelmim', label: 'Guelmim', lat: 28.987, lng: -10.0574 },
  { name: 'Errachidia', label: 'Errachidia', lat: 31.9314, lng: -4.4244 },
  { name: 'Ouarzazate', label: 'Ouarzazate', lat: 30.9335, lng: -6.937 },
  { name: 'Essaouira', label: 'Essaouira', lat: 31.5085, lng: -9.7595 },
  { name: 'Taroudant', label: 'Taroudant', lat: 30.4703, lng: -8.877 },
  { name: 'Sidi Kacem', label: 'Sidi Kacem', lat: 34.221, lng: -5.707 },
  { name: 'Al Hoceima', label: 'Al Hoceïma', lat: 35.2517, lng: -3.9372 },
  { name: 'Tan-Tan', label: 'Tan-Tan', lat: 28.4378, lng: -11.1035 },
  { name: 'Laâyoune', label: 'Laâyoune', lat: 27.1536, lng: -13.2034 },
  { name: 'Dakhla', label: 'Dakhla', lat: 23.6848, lng: -15.9579 },

  // --- Casablanca neighborhoods ---
  { name: 'Maârif', label: 'Maârif, Casablanca', lat: 33.587, lng: -7.632 },
  { name: 'Aïn Diab', label: 'Aïn Diab, Casablanca', lat: 33.593, lng: -7.69 },
  { name: 'Sidi Maârouf', label: 'Sidi Maârouf, Casablanca', lat: 33.517, lng: -7.656 },
  { name: 'Hay Hassani', label: 'Hay Hassani, Casablanca', lat: 33.556, lng: -7.664 },
  { name: 'Bourgogne', label: 'Bourgogne, Casablanca', lat: 33.598, lng: -7.636 },
  { name: 'Anfa', label: 'Anfa, Casablanca', lat: 33.59, lng: -7.65 },
  { name: 'Sidi Bernoussi', label: 'Sidi Bernoussi, Casablanca', lat: 33.608, lng: -7.506 },
  { name: 'Aïn Sebaâ', label: 'Aïn Sebaâ, Casablanca', lat: 33.605, lng: -7.545 },
  { name: 'Derb Sultan', label: 'Derb Sultan, Casablanca', lat: 33.576, lng: -7.599 },
  { name: 'Oulfa', label: 'Oulfa, Casablanca', lat: 33.543, lng: -7.666 },
  { name: 'Hay Mohammadi', label: 'Hay Mohammadi, Casablanca', lat: 33.586, lng: -7.556 },
  { name: 'Bouskoura', label: 'Bouskoura, Casablanca', lat: 33.449, lng: -7.649 },
  { name: 'Californie', label: 'Californie, Casablanca', lat: 33.53, lng: -7.626 },
]

/** Accent-insensitive lowercase for prefix matching. */
const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/** Prefix/substring search over the local dataset (max `limit` results). */
export function searchLocalPlaces(query, limit = 6) {
  const q = norm(query.trim())
  if (!q) return []
  const starts = []
  const contains = []
  for (const p of MOROCCO_PLACES) {
    const n = norm(p.name)
    if (n.startsWith(q)) starts.push(p)
    else if (n.includes(q) || norm(p.label).includes(q)) contains.push(p)
  }
  return [...starts, ...contains].slice(0, limit)
}
