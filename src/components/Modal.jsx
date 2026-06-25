import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import './Modal.css'

/**
 * Accessible modal dialog rendered in a portal.
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {React.ReactNode} icon
 * @param {string} title
 * @param {string} subtitle
 * @param {React.ReactNode} footer
 * @param {'sm'|'md'|'lg'} size
 */
export default function Modal({
  open,
  onClose,
  icon,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal__overlay" onMouseDown={onClose} role="presentation">
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <div className="modal__heading">
            {icon && <span className="modal__icon">{icon}</span>}
            <div>
              {title && <h3 className="modal__title">{title}</h3>}
              {subtitle && <p className="modal__subtitle">{subtitle}</p>}
            </div>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Fermer">
            <FiX />
          </button>
        </header>

        <div className="modal__body">{children}</div>

        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>,
    document.body
  )
}
