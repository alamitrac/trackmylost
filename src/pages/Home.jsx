import { Link } from 'react-router-dom'
import {
  FiSearch,
  FiArrowRight,
  FiMapPin,
  FiUser,
  FiSmartphone,
  FiFileText,
  FiKey,
  FiBriefcase,
  FiHeart,
  FiTruck,
  FiStar,
  FiPackage,
} from 'react-icons/fi'
import Button from '../components/Button'
import { listReports } from '../api/reports'
import { listCategories } from '../api/categories'
import { useFetch, errorMessage } from '../hooks/useFetch'
import { useAuth } from '../context/AuthContext'
import { TOKEN_KEY } from '../api/client'
import './Home.css'

/* Map a backend `icon` slug to a react-icons component. Falls back to a
   generic package icon when the slug is unknown so the card is never empty. */
const CATEGORY_ICONS = {
  smartphone: FiSmartphone,
  file: FiFileText,
  key: FiKey,
  briefcase: FiBriefcase,
  heart: FiHeart,
  truck: FiTruck,
  star: FiStar,
  box: FiPackage,
}

/* Generic, deterministic placeholder used if a post image fails to load. */
function fallbackPostImage(id) {
  return `https://picsum.photos/seed/tml-post-${id ?? Math.random().toString(36).slice(2)}/900/600`
}

export default function Home() {
  const { isAuthenticated } = useAuth()
  const loggedIn = isAuthenticated || !!localStorage.getItem(TOKEN_KEY)

  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    reload: reloadPosts,
  } = useFetch(() => listReports(), [])

  const {
    data: categories,
    loading: catsLoading,
    error: catsError,
  } = useFetch(() => listCategories(), [])

  return (
    <div className="home">
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero__topbar">
          <Button
            to={loggedIn ? '/mon-compte' : '/login'}
            variant="outline"
            size="sm"
            icon={<FiUser />}
            className="hero__account"
            aria-label={loggedIn ? 'Accéder à mon compte' : 'Se connecter'}
          >
            {loggedIn ? 'Mon compte' : 'Connexion'}
          </Button>
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__eyebrow">Plateforme citoyenne · Maroc</span>
            <h1>
              Vous avez perdu ou trouvé quelque chose ?<br />
              <span className="hero__accent">Ensemble, on retrouve.</span>
            </h1>
            <p>
              Signalez en quelques secondes, recevez des alertes près de chez vous et
              reconnectez les objets et les personnes à ceux qui les cherchent.
            </p>

            <form className="hero__search" onSubmit={(e) => e.preventDefault()}>
              <div className="hero__search-field">
                <FiSearch />
                <input placeholder="Que recherchez-vous ? (ex : sac, clés, iPhone…)" />
              </div>
              <div className="hero__search-field hero__search-field--city">
                <FiMapPin />
                <input placeholder="Ville" />
              </div>
              <Button variant="accent" size="lg" type="submit">Rechercher</Button>
            </form>

            <div className="hero__chips">
              <span>Populaire :</span>
              <Link to="/">iPhone</Link>
              <Link to="/">CIN</Link>
              <Link to="/">Clés</Link>
              <Link to="/">Portefeuille</Link>
            </div>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <strong>12 480</strong>
              <span>Signalements</span>
            </div>
            <div className="hero__stat">
              <strong>8 320</strong>
              <span>Objets rendus</span>
            </div>
            <div className="hero__stat">
              <strong>52</strong>
              <span>Villes couvertes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Catégories (API /api/categories) ---------- */}
      <section className="container section section--categories">
        <div className="section-title">
          <h2>Parcourir par catégorie</h2>
          <Link to="/" className="link-arrow">Tout voir <FiArrowRight /></Link>
        </div>

        {catsLoading ? (
          <div className="categories__grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="category category--skeleton">
                <span className="skel skel--circle" />
                <span className="skel skel--line" style={{ width: '60%' }} />
                <span className="skel skel--line" style={{ width: '40%' }} />
              </div>
            ))}
          </div>
        ) : catsError ? (
          <p className="section-empty muted">{errorMessage(catsError, 'Impossible de charger les catégories.')}</p>
        ) : categories && categories.length ? (
          <div className="categories__grid">
            {categories.map((c) => {
              const Icon = CATEGORY_ICONS[c.icon] || FiPackage
              return (
                <Link key={c.id} to={`/?category=${c.slug}`} className="category">
                  <span className="category__icon"><Icon /></span>
                  <span className="category__label">{c.name}</span>
                  {c.count != null && (
                    <span className="category__count">{c.count} signalements</span>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="section-empty muted">Aucune catégorie disponible.</p>
        )}
      </section>

      {/* ---------- Signalements récents (API /api/posts) ---------- */}
      <section className="container section section--posts">
        <div className="section-title">
          <h2>Signalements récents</h2>
          <Link to="/" className="link-arrow">Voir le fil complet <FiArrowRight /></Link>
        </div>

        {postsLoading ? (
          <div className="posts__grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <article key={i} className="post-card post-card--skeleton">
                <div className="post-card__media skel" />
                <div className="post-card__body">
                  <div className="skel skel--line" style={{ width: '35%' }} />
                  <div className="skel skel--line" style={{ width: '90%' }} />
                  <div className="skel skel--line" style={{ width: '70%' }} />
                </div>
              </article>
            ))}
          </div>
        ) : postsError ? (
          <div className="section-empty">
            <p className="muted">{errorMessage(postsError, 'Impossible de charger les articles.')}</p>
            <Button variant="outline" size="sm" onClick={reloadPosts}>Réessayer</Button>
          </div>
        ) : posts && posts.length ? (
          <div className="posts__grid">
            {posts.slice(0, 6).map((p) => (
              <article key={p.id} className="post-card">
                <Link to={`/item/${p.id}`} className="post-card__media">
                  {p.image ? (
                    <img src={p.image} alt={p.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  ) : (
                    <span className="post-card__noimg"><FiPackage /></span>
                  )}
                  <span className={`badge ${p.type === 'lost' ? 'badge--lost' : 'badge--found'} post-card__category`}>
                    {p.type === 'lost' ? 'Perdu' : 'Trouvé'}
                  </span>
                </Link>
                <div className="post-card__body">
                  <div className="post-card__meta">
                    {p.author?.name && <span>{p.author.name}</span>}
                    {p.timeAgo && <span>· {p.timeAgo}</span>}
                  </div>
                  <h3 className="post-card__title">
                    <Link to={`/item/${p.id}`}>{p.title}</Link>
                  </h3>
                  {p.description && <p className="post-card__excerpt">{p.description}</p>}
                  <Link to={`/item/${p.id}`} className="post-card__cta">
                    Voir le signalement <FiArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="section-empty muted">Aucun article pour le moment.</p>
        )}
      </section>
    </div>
  )
}
