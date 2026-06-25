import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiUpload, FiCalendar, FiCheck, FiX } from 'react-icons/fi'
import Input from '../components/Input'
import Button from '../components/Button'
import LocationPicker from '../components/LocationPicker'
import { URGENCY, URGENCY_OPTIONS } from '../components/UrgencyBadge'
import { createPost, updatePost } from '../api/posts'
import { getReport } from '../api/reports'
import { listCategories } from '../api/categories'
import { useFetch, errorMessage } from '../hooks/useFetch'
import './Signalement.css'

export default function Signalement() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = !!id
  const { data: existing } = useFetch(() => (editing ? getReport(id) : Promise.resolve(null)), [id])
  const [type, setType] = useState('lost')
  const [urgency, setUrgency] = useState('') // none yet — user must choose
  const [urgencyError, setUrgencyError] = useState('')
  const [place, setPlace] = useState('') // location label (from map / search)
  const [coords, setCoords] = useState(null) // { lat, lng }
  const [locationError, setLocationError] = useState('')
  const [photos, setPhotos] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Real categories from the API — their numeric ids are what the backend needs.
  const { data: cats } = useFetch(() => listCategories(), [])

  // Local object-URL previews for the selected photos (revoked on change).
  const previews = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos])
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews])

  const MAX_PHOTOS = 10

  const onPhoto = (e) => {
    const files = Array.from(e.target.files || [])
    setPhotos((p) => [...p, ...files].slice(0, MAX_PHOTOS))
    e.target.value = ''
  }
  const removePhoto = (idx) => setPhotos((p) => p.filter((_, i) => i !== idx))

  // Prefill when editing an existing report.
  useEffect(() => {
    if (existing) {
      setType(existing.type || 'lost')
      setUrgency(existing.urgency || 'normal')
      if (existing.location) setPlace(existing.location)
      if (existing.lat != null && existing.lng != null) {
        setCoords({ lat: existing.lat, lng: existing.lng })
      }
    }
  }, [existing])

  const onLocationChange = (v) => {
    if (v.lat != null && v.lng != null) setCoords({ lat: v.lat, lng: v.lng })
    setPlace(v.label || '')
    if (v.label) setLocationError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Lost items must have an urgency level; found items are auto-classified (blue).
    if (type === 'lost' && !urgency) {
      setUrgencyError("Veuillez sélectionner un niveau d'urgence.")
      e.currentTarget.querySelector('[name="urgency"]')?.focus()
      return
    }
    setUrgencyError('')

    // A location must be marked on the map / chosen from search.
    if (!place.trim()) {
      setLocationError('Veuillez indiquer un lieu (cliquez sur la carte ou recherchez une adresse).')
      return
    }
    setLocationError('')

    const fd = new FormData(e.currentTarget)
    const title = (fd.get('title') || '').toString().trim()

    const payload = {
      title,
      type,
      urgency: type === 'found' ? 'normal' : urgency,
      category_id: (fd.get('category_id') || '').toString(),
      location: place.trim(),
      description: (fd.get('description') || '').toString(),
      ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
    }

    setSubmitting(true)
    try {
      let body = payload
      if (photos.length > 0) {
        const form = new FormData()
        Object.entries(payload).forEach(([k, v]) => form.append(k, String(v ?? '')))
        photos.forEach((file) => form.append('images[]', file))
        body = form
      }
      if (editing) await updatePost(id, body)
      else await createPost(body)
      setSubmitted(true)
      setTimeout(() => navigate(editing ? `/item/${id}` : '/'), 1400)
    } catch (err) {
      setError(errorMessage(err, 'La publication a échoué. Vérifiez les champs et réessayez.'))
      setSubmitting(false)
    }
  }

  if (editing && !existing) {
    return <div className="container page"><p className="muted">Chargement du signalement…</p></div>
  }

  return (
    <div className="container page signalement">
      <header className="signalement__head">
        <h1>{editing ? 'Modifier le signalement' : 'Créer un signalement'}</h1>
        <p className="muted">
          Décrivez l'objet ou la personne. Plus c'est précis, plus vite on retrouve.
        </p>
      </header>

      <form className="signalement__card surface" onSubmit={onSubmit}>
        {/* Type toggle */}
        <div className="signalement__type">
          <button
            type="button"
            className={`type-pill type-pill--lost ${type === 'lost' ? 'is-active' : ''}`}
            onClick={() => setType('lost')}
          >
            J'ai perdu
          </button>
          <button
            type="button"
            className={`type-pill type-pill--found ${type === 'found' ? 'is-active' : ''}`}
            onClick={() => setType('found')}
          >
            J'ai trouvé
          </button>
        </div>

        <Input name="title" label="Titre du signalement" placeholder="ex : Sac à dos noir perdu près du tramway" defaultValue={existing?.title} required />

        <Input as="select" name="category_id" label="Catégorie" defaultValue={editing ? String(existing?.categoryId || '') : ''} required>
          <option value="" disabled>Choisissez une catégorie</option>
          {(cats || []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Input>

        {type === 'lost' && (
          <div className="signalement__urgency">
            <Input
              as="select"
              name="urgency"
              label="Niveau d'urgence"
              value={urgency}
              onChange={(e) => { setUrgency(e.target.value); setUrgencyError('') }}
              required
            >
              <option value="" disabled>Choisissez un niveau d'urgence</option>
              {URGENCY_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {URGENCY[k].label} — {URGENCY[k].items.join(', ')}
                </option>
              ))}
            </Input>
            {urgency && URGENCY[urgency]?.items?.length > 0 && (
              <p className="signalement__urg-help">
                <span className={`signalement__urg-dot ${URGENCY[urgency].cls}`} />
                Exemples&nbsp;: {URGENCY[urgency].items.join(', ')}
              </p>
            )}
            {urgencyError && <p className="auth__error" role="alert" style={{ marginTop: 6 }}>{urgencyError}</p>}
          </div>
        )}

        {/* Location — interactive map + address search (Task 3) */}
        <div className="signalement__field">
          <span className="field-label">Indiquer l'emplacement *</span>
          <LocationPicker
            value={{ lat: coords?.lat, lng: coords?.lng, label: place }}
            onChange={onLocationChange}
          />
          {locationError && <p className="auth__error" role="alert" style={{ marginTop: 6 }}>{locationError}</p>}
        </div>

        <Input name="date" label="Date" type="date" icon={<FiCalendar />} required={!editing} />

        <Input
          as="textarea"
          name="description"
          label="Description"
          placeholder="Couleur, marque, signes distinctifs, circonstances…"
          rows={5}
          defaultValue={existing?.description}
          required
        />

        {/* Photo upload — multiple images supported */}
        <div className="signalement__field">
          <span className="field-label">Photos ({photos.length}/{MAX_PHOTOS})</span>
          {photos.length < MAX_PHOTOS && (
            <label className="upload">
              <input type="file" accept="image/*" multiple onChange={onPhoto} hidden />
              <FiUpload className="upload__icon" />
              <span><strong>Ajouter des photos</strong><br />PNG, JPG · {MAX_PHOTOS} max · plusieurs à la fois</span>
            </label>
          )}
          {previews.length > 0 && (
            <ul className="upload__grid">
              {previews.map((url, i) => (
                <li key={i} className="upload__thumb">
                  <img src={url} alt={`Photo ${i + 1}`} />
                  <button
                    type="button"
                    className="upload__remove"
                    onClick={() => removePhoto(i)}
                    aria-label={`Retirer la photo ${i + 1}`}
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="auth__error" role="alert" style={{ marginTop: 4 }}>{error}</p>}

        <div className="signalement__actions">
          <Button to="/" variant="ghost" size="lg">Annuler</Button>
          <Button type="submit" variant="accent" size="lg" icon={<FiCheck />} disabled={submitting}>
            {submitting ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Publier'}
          </Button>
        </div>
      </form>

      {submitted && (
        <div className="signalement__toast">
          <FiCheck /> Signalement publié ! Redirection…
        </div>
      )}
    </div>
  )
}
