import { useId } from 'react'
import './Input.css'

/**
 * Reusable labelled input / textarea / select with an orange accent bar.
 * @param {string} as  'input' | 'textarea' | 'select'
 * @param {React.ReactNode} icon  optional leading icon
 */
export default function Input({
  as = 'input',
  label,
  icon,
  hint,
  error,
  className = '',
  children,
  ...rest
}) {
  const id = useId()
  const Tag = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input'

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`field__control ${icon ? 'field__control--icon' : ''}`}>
        {icon && <span className="field__icon">{icon}</span>}
        <Tag id={id} className="field__input" {...rest}>
          {children}
        </Tag>
      </div>
      {error ? (
        <span className="field__msg field__msg--error">{error}</span>
      ) : (
        hint && <span className="field__msg">{hint}</span>
      )}
    </div>
  )
}
