import { useState } from 'react'
import Lightbox from './Lightbox'
import './PostGallery.css'

/**
 * Social-media style image gallery for a report.
 * - 1 image  → single
 * - 2/3/4    → mosaic grid
 * - 5+       → 4-tile grid, last tile shows a "+N" overlay
 * Clicking any tile opens the fullscreen Lightbox at that image, with
 * navigation across ALL images.
 *
 * @param {string[]} images  absolute image URLs
 * @param {string}   alt
 */
export default function PostGallery({ images = [], alt = '' }) {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(0)

  if (!images.length) return null

  const count = images.length
  const tiles = images.slice(0, 4)
  const extra = count - tiles.length

  const openAt = (idx) => {
    setStart(idx)
    setOpen(true)
  }

  const layout = count === 1 ? 'one' : count === 2 ? 'two' : count === 3 ? 'three' : 'four'

  return (
    <>
      <div className={`gallery gallery--${layout}`}>
        {tiles.map((src, i) => {
          const isLast = i === tiles.length - 1 && extra > 0
          return (
            <button
              key={i}
              type="button"
              className="gallery__tile"
              onClick={() => openAt(i)}
              aria-label={`Ouvrir l'image ${i + 1}${count > 1 ? ` sur ${count}` : ''}`}
            >
              <img src={src} alt={alt ? `${alt} — ${i + 1}` : ''} loading="lazy" />
              {isLast && <span className="gallery__more">+{extra}</span>}
            </button>
          )
        })}
      </div>

      <Lightbox images={images} startIndex={start} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
