import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Lightbox.css'

/**
 * Fullscreen image viewer (lightbox / gallery), like social platforms.
 *
 * @param {string[]} images       absolute image URLs
 * @param {number}   startIndex   index to open on
 * @param {boolean}  open
 * @param {() => void} onClose
 */
export default function Lightbox({ images = [], startIndex = 0, open, onClose }) {
  const [i, setI] = useState(startIndex)
  const count = images.length

  useEffect(() => {
    if (open) setI(Math.min(Math.max(startIndex, 0), Math.max(count - 1, 0)))
  }, [open, startIndex, count])

  const prev = useCallback(() => setI((n) => (n - 1 + count) % count), [count])
  const next = useCallback(() => setI((n) => (n + 1) % count), [count])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      else if (e.key === 'ArrowLeft' && count > 1) prev()
      else if (e.key === 'ArrowRight' && count > 1) next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, count, prev, next, onClose])

  if (!open || !count) return null

  return createPortal(
    <div className="lightbox" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Galerie d'images">
      <button className="lightbox__close" onClick={onClose} aria-label="Fermer">
        <FiX />
      </button>

      {count > 1 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onMouseDown={(e) => { e.stopPropagation(); prev() }}
          aria-label="Image précédente"
        >
          <FiChevronLeft />
        </button>
      )}

      <figure className="lightbox__stage" onMouseDown={(e) => e.stopPropagation()}>
        <img src={images[i]} alt={`Image ${i + 1} sur ${count}`} />
        {count > 1 && <figcaption className="lightbox__counter">{i + 1} / {count}</figcaption>}
      </figure>

      {count > 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onMouseDown={(e) => { e.stopPropagation(); next() }}
          aria-label="Image suivante"
        >
          <FiChevronRight />
        </button>
      )}

      {count > 1 && (
        <div className="lightbox__thumbs" onMouseDown={(e) => e.stopPropagation()}>
          {images.map((src, n) => (
            <button
              key={n}
              className={`lightbox__thumb ${n === i ? 'is-active' : ''}`}
              onClick={() => setI(n)}
              aria-label={`Aller à l'image ${n + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
