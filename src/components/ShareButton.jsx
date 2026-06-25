import { useEffect, useRef, useState } from 'react'
import { FiShare2, FiLink, FiCheck, FiSend } from 'react-icons/fi'
import './ShareButton.css'

/**
 * Share control for a Signal.
 * - Uses the browser's native share sheet when available.
 * - Always offers a "Copy link" fallback (copies the direct Signal URL).
 *
 * @param {string} url     direct link to the Signal
 * @param {string} title   share title
 * @param {string} className  extra classes for the trigger button
 */
export default function ShareButton({ url, title = 'Track My Lost', className = '' }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: title, url })
    } catch {
      /* user cancelled */
    }
    setOpen(false)
  }

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const ta = document.createElement('textarea')
        ta.value = url
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="share" ref={ref}>
      <button
        type="button"
        className={className || 'share__trigger'}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <FiShare2 /> Partager
      </button>

      {open && (
        <div className="share__menu" role="menu">
          {canNativeShare && (
            <button type="button" className="share__item" onClick={nativeShare} role="menuitem">
              <FiSend /> Partager via…
            </button>
          )}
          <button type="button" className="share__item" onClick={copyLink} role="menuitem">
            {copied ? <FiCheck className="share__ok" /> : <FiLink />}
            {copied ? 'Lien copié !' : 'Copier le lien'}
          </button>
          <div className="share__url" title={url}>{url}</div>
        </div>
      )}
    </div>
  )
}
