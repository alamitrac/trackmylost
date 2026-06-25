import { Link } from 'react-router-dom'
import './Button.css'

/**
 * Reusable button.
 * @param {'primary'|'accent'|'outline'|'ghost'|'danger'|'success'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} block   full-width
 * @param {string}  to      render as a router Link
 * @param {string}  href    render as an anchor
 * @param {React.ReactNode} icon  leading icon
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  to,
  href,
  icon,
  className = '',
  type = 'button',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon && <span className="btn__icon">{icon}</span>}
      {children && <span>{children}</span>}
    </>
  )

  if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>
  if (href) return <a href={href} className={classes} {...rest}>{content}</a>
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}
