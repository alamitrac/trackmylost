import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import {
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiPhone,
  FiPlusCircle,
  FiAlertTriangle,
  FiArrowRight,
  FiPackage,
  FiTrendingUp,
  FiBox,
  FiEye,
  FiSearch,
  FiSliders,
} from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import PostGallery from '../components/PostGallery'
import ShareButton from '../components/ShareButton'
import CommentsSection from '../components/CommentsSection'
import FavoriteButton from '../components/FavoriteButton'
import ReportButton from '../components/ReportButton'
import UrgencyBadge, { URGENCY, URGENCY_ALL } from '../components/UrgencyBadge'
import { listReports } from '../api/reports'
import { listCategories } from '../api/categories'
import { useFetch, errorMessage } from '../hooks/useFetch'
import './Feed.css'

/* lost/found → reuse the global .badge styles (red / green). */
const TYPE_BADGE = {
  lost: { cls: 'badge--lost', label: 'Perdu' },
  found: { cls: 'badge--found', label: 'Trouvé' },
}

const FILTERS = [
  { key: 'tout', label: 'Tout' },
  { key: 'lost', label: 'Perdus' },
  { key: 'found', label: 'Trouvés' },
  { key: 'resolu', label: 'Résolus' },
]

function isResolved(r) {
  const s = String(r?.status || '').toLowerCase()
  return s === 'resolved' || s === 'resolu' || s === 'résolu'
}

/* Hide a broken <img> instead of swapping in a placeholder, so a report
   always shows its own uploaded image or nothing — never a random one. */
function hideOnError(e) {
  e.currentTarget.style.display = 'none'
}

/* ------------------------------------------------------------------ */
/* A single report in the feed (the "AlertCard" from the design).      */
/* ------------------------------------------------------------------ */
function ReportCard({ report }) {
  const navigate = useNavigate()
  const badge = TYPE_BADGE[report.type] || TYPE_BADGE.lost
  const resolved = isResolved(report)
  const chips = [report.category, ...(report.tags || [])].filter(Boolean).slice(0, 3)
  const images = report.images && report.images.length ? report.images : report.image ? [report.image] : []

  const [showComments, setShowComments] = useState(false)
  const [count, setCount] = useState(report.comments || 0)
  const shareUrl = `${window.location.origin}/item/${report.id}`

  return (
    <article className={`rcard surface rcard--urg-${report.urgency || 'normal'}`}>
      <header className="rcard__head">
        <img
          className="avatar rcard__avatar"
          src={report.author.avatar}
          alt=""
          width="44"
          height="44"
        />
        <div className="rcard__head-main">
          <span className="rcard__author">{report.author.name}</span>
          <span className="rcard__badges">
            <UrgencyBadge level={report.urgency} tooltip />
            <span className={`badge ${badge.cls}`}>{badge.label}</span>
            {resolved && <span className="badge badge--trouve">✓ Trouvé</span>}
          </span>
        </div>
        <div className="rcard__head-meta">
          {report.timeAgo && (
            <span>
              <FiClock /> {report.timeAgo}
            </span>
          )}
          {report.location && (
            <span>
              <FiMapPin /> {report.location}
            </span>
          )}
          <span>
            <FiEye /> {report.views} vue{report.views > 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <div className="rcard__body">
        <h3 className="rcard__title">
          <Link to={`/item/${report.id}`}>{report.title}</Link>
        </h3>
        {report.description && <p className="rcard__desc">{report.description}</p>}

        {images.length > 0 && (
          <div className="rcard__gallery">
            <PostGallery images={images} alt={report.title} />
          </div>
        )}

        {chips.length > 0 && (
          <div className="rcard__tags">
            {chips.map((c, i) => (
              <span key={`${c}-${i}`} className="rcard__tag">
                #{c}
              </span>
            ))}
          </div>
        )}
      </div>

      <footer className="rcard__foot">
        <button
          type="button"
          className={`rcard__action ${showComments ? 'is-active' : ''}`}
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
        >
          <FiMessageSquare /> Commenter{count ? ` (${count})` : ''}
        </button>
        <ShareButton url={shareUrl} title={report.title} className="rcard__action" />
        <FavoriteButton postId={report.id} initial={report.favorited} showLabel />
        <ReportButton postId={report.id} className="rcard__action" />
        <Button
          variant="primary"
          size="sm"
          icon={<FiPhone />}
          className="rcard__contact"
          onClick={() =>
            navigate('/messages', {
              state: { to: { id: report.author.id, name: report.author.name, avatar: report.author.avatar } },
            })
          }
        >
          Contacter
        </Button>
      </footer>

      {showComments && <CommentsSection postId={report.id} onCountChange={setCount} />}
    </article>
  )
}

/* Skeleton placeholder shown while the feed loads. */
function ReportSkeleton() {
  return (
    <article className="rcard surface rcard--skeleton" aria-hidden="true">
      <div className="rcard__head">
        <span className="skel skel--circle" />
        <span className="skel skel--line" style={{ width: '32%' }} />
      </div>
      <div className="rcard__body">
        <span className="skel skel--line" style={{ width: '70%' }} />
        <span className="skel skel--line" style={{ width: '95%' }} />
        <span className="skel skel--block" />
      </div>
    </article>
  )
}

/* ================================================================== */
/* HOME — feed dashboard (left sidebar · report feed · right rail)      */
/* ================================================================== */
export default function Feed() {
  const [params, setParams] = useSearchParams()
  // Sidebar links use `?type=found`; the navbar search uses `?q=`.
  const typeParam = params.get('type') || 'tout'
  const q = (params.get('q') || '').trim().toLowerCase()

  // All search params drive a server-side query (Feature 8 — advanced search).
  const statusParam = params.get('status') || ''
  const cityParam = params.get('city') || ''
  const categoryParam = params.get('category_id') || ''
  const dateParam = params.get('date') || ''
  const urgencyParam = params.get('urgency') || ''

  const query = {}
  if (q) query.search = q
  if (['lost', 'found'].includes(typeParam)) query.type = typeParam
  if (statusParam) query.status = statusParam
  if (cityParam) query.city = cityParam
  if (categoryParam) query.category_id = categoryParam
  if (dateParam) query.date = dateParam
  if (urgencyParam) query.urgency = urgencyParam

  const { data: reports, loading, error, reload } = useFetch(
    () => listReports(query),
    [params.toString()]
  )
  const all = reports || []
  const filtered = all // already filtered server-side
  const { data: cats } = useFetch(() => listCategories(), [])

  const activeChip = statusParam === 'resolved'
    ? 'resolu'
    : typeParam === 'lost' ? 'lost' : typeParam === 'found' ? 'found' : 'tout'

  const stats = useMemo(
    () => ({
      total: all.length,
      lost: all.filter((r) => r.type === 'lost').length,
      found: all.filter((r) => r.type === 'found').length,
      resolved: all.filter(isResolved).length,
    }),
    [all]
  )

  const recent = all.slice(0, 4)

  // Quick chips map to type / status filters.
  const setFilter = (key) => {
    const next = new URLSearchParams(params)
    next.delete('type')
    next.delete('status')
    if (key === 'lost') next.set('type', 'lost')
    else if (key === 'found') next.set('type', 'found')
    else if (key === 'resolu') next.set('status', 'resolved')
    setParams(next, { replace: true })
  }

  // Advanced filter form draft (synced from the URL).
  const [showFilters, setShowFilters] = useState(false)
  const [draft, setDraft] = useState({ q: '', city: '', category_id: '', date: '', urgency: '' })
  useEffect(() => {
    setDraft({ q, city: cityParam, category_id: categoryParam, date: dateParam, urgency: urgencyParam })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()])

  const applyFilters = (e) => {
    e?.preventDefault()
    const next = new URLSearchParams(params)
    const set = (k, v) => (v ? next.set(k, v) : next.delete(k))
    set('q', draft.q.trim())
    set('city', draft.city.trim())
    set('category_id', draft.category_id)
    set('date', draft.date)
    set('urgency', draft.urgency)
    setParams(next, { replace: true })
  }

  const resetFilters = () => {
    setParams(new URLSearchParams(), { replace: true })
    setShowFilters(false)
  }

  const hasActiveFilters = !!(q || cityParam || categoryParam || dateParam || typeParam || statusParam || urgencyParam)

  return (
    <div className="feed-page">
      <div className="container feed-layout">
        {/* ---------- Left column: profile + navigation ---------- */}
        <div className="feed-col feed-col--left">
          <Sidebar />
        </div>

        {/* ---------- Center column: the reports feed ---------- */}
        <main className="feed-col feed-main">
          <section className="feed-section" aria-labelledby="feed-heading">
            <div className="feed-toolbar">
              <div className="feed-chips" role="tablist" aria-label="Filtrer les signalements">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={activeChip === f.key}
                    className={`feed-chip ${activeChip === f.key ? 'is-active' : ''}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={`feed-chip feed-filter-toggle ${showFilters || hasActiveFilters ? 'is-active' : ''}`}
                onClick={() => setShowFilters((v) => !v)}
              >
                <FiSliders /> Filtres
              </button>
              <Button
                to="/signalement"
                variant="accent"
                size="sm"
                icon={<FiPlusCircle />}
                className="feed-toolbar__cta"
              >
                Signaler
              </Button>
            </div>

            {showFilters && (
              <form className="feed-filters surface" onSubmit={applyFilters}>
                <div className="feed-filters__field feed-filters__field--search">
                  <FiSearch />
                  <input
                    type="search"
                    placeholder="Mots-clés (titre, description)…"
                    value={draft.q}
                    onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
                  />
                </div>
                <input
                  className="feed-filters__input"
                  placeholder="Ville / lieu"
                  value={draft.city}
                  onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                />
                <select
                  className="feed-filters__input"
                  value={draft.category_id}
                  onChange={(e) => setDraft((d) => ({ ...d, category_id: e.target.value }))}
                >
                  <option value="">Toutes catégories</option>
                  {(cats || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  className="feed-filters__input"
                  value={draft.urgency}
                  onChange={(e) => setDraft((d) => ({ ...d, urgency: e.target.value }))}
                >
                  <option value="">Toute urgence</option>
                  {URGENCY_ALL.map((k) => (
                    <option key={k} value={k}>{URGENCY[k].label}</option>
                  ))}
                </select>
                <input
                  className="feed-filters__input"
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                />
                <Button type="submit" variant="primary" size="sm">Rechercher</Button>
                {hasActiveFilters && (
                  <button type="button" className="feed-filters__reset" onClick={resetFilters}>
                    Réinitialiser
                  </button>
                )}
              </form>
            )}

            <div className="feed-heading">
              <h1 id="feed-heading">Signalements récents</h1>
              {!loading && !error && (
                <span className="feed-count">
                  {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <div className="feed-list">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ReportSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="feed-empty surface">
                <p className="muted">
                  {errorMessage(error, 'Impossible de charger les signalements.')}
                </p>
                <Button variant="outline" size="sm" onClick={reload}>
                  Réessayer
                </Button>
              </div>
            ) : filtered.length ? (
              <div className="feed-list">
                {filtered.map((r) => (
                  <ReportCard key={r.id} report={r} />
                ))}
              </div>
            ) : (
              <div className="feed-empty surface">
                <FiPackage className="feed-empty__icon" />
                <p className="muted">Aucun signalement pour ce filtre.</p>
                <Button to="/signalement" variant="accent" size="sm">
                  Créer le premier
                </Button>
              </div>
            )}
          </section>
        </main>

        {/* ---------- Right column: panels ---------- */}
        <aside className="feed-col feed-rail">
          <div className="rail-card surface">
            <div className="rail-card__title">
              <FiTrendingUp /> Statistiques
            </div>
            <ul className="rail-stats">
              <li>
                <span className="dot dot--navy" />
                <span className="rail-stats__label">Total</span>
                <strong>{stats.total}</strong>
              </li>
              <li>
                <span className="dot dot--danger" />
                <span className="rail-stats__label">Perdus</span>
                <strong>{stats.lost}</strong>
              </li>
              <li>
                <span className="dot dot--success" />
                <span className="rail-stats__label">Trouvés</span>
                <strong>{stats.found}</strong>
              </li>
              <li>
                <span className="dot dot--muted" />
                <span className="rail-stats__label">Résolus</span>
                <strong>{stats.resolved}</strong>
              </li>
            </ul>
          </div>

          <div className="rail-card rail-cta">
            <FiAlertTriangle className="rail-cta__icon" />
            <strong>Un objet perdu&nbsp;?</strong>
            <p>Publiez un signalement en quelques secondes et touchez la communauté.</p>
            <Button to="/signalement" variant="accent" size="sm" block>
              Créer un signalement
            </Button>
          </div>

          <div className="rail-card surface">
            <div className="rail-card__title">
              <FiBox /> Objets récents
              <Link to="/?type=found" className="rail-card__all">
                Voir tout <FiArrowRight />
              </Link>
            </div>
            <ul className="rail-recent">
              {recent.length ? (
                recent.map((r) => (
                  <li key={r.id}>
                    <Link to={`/item/${r.id}`} className="rail-recent__link">
                      {r.image ? (
                        <img src={r.image} alt="" width="40" height="40" onError={hideOnError} />
                      ) : (
                        <span className="rail-recent__noimg">
                          <FiBox />
                        </span>
                      )}
                      <div className="rail-recent__text">
                        <span className="rail-recent__name">{r.title}</span>
                        <span className="rail-recent__loc">{r.location || r.city || '—'}</span>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="muted rail-recent__empty">Aucun objet pour le moment.</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
