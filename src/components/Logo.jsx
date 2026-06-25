import { Link } from 'react-router-dom'
import './Logo.css'

/* Official Track My Lost branding assets (in /public). */
const SRC = {
  color: '/logo-tml.svg', // full colored lockup — for light backgrounds
  white: '/logo-tml-white.svg', // full white lockup — for dark/navy backgrounds
  icon: '/logo-icon.svg', // icon only — compact placements
}

/**
 * Shared brand logo. Updating this component re-brands the whole app.
 *
 * @param {number}  size      rendered height in px
 * @param {'dark'|'light'} variant  'dark' = colored logo (light bg),
 *                                   'light' = white logo (dark/navy bg)
 * @param {boolean} iconOnly  render the icon-only mark (compact usage)
 * @param {boolean} asLink    wrap in a Link to "/"
 * @param {string}  className
 *
 * Note: the official assets are fixed lockups (icon + wordmark + tagline), so
 * the legacy `showText` / `showTagline` props are accepted but no longer needed.
 */
export default function Logo({
  size = 40,
  variant = 'dark',
  iconOnly = false,
  asLink = true,
  className = '',
  // eslint-disable-next-line no-unused-vars
  showText,
  // eslint-disable-next-line no-unused-vars
  showTagline,
}) {
  const src = iconOnly ? SRC.icon : variant === 'light' ? SRC.white : SRC.color

  const img = (
    <img
      src={src}
      alt="Track My Lost"
      className={`logo-img ${className}`}
      style={{ height: size, width: 'auto' }}
      draggable="false"
    />
  )

  if (!asLink) return img

  return (
    <Link to="/" className="logo-link" aria-label="Track My Lost — accueil">
      {img}
    </Link>
  )
}
