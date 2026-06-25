import { FiAlertOctagon, FiAlertTriangle, FiChevronsDown, FiTag } from 'react-icons/fi'
import './UrgencyBadge.css'

/**
 * Shared urgency configuration — label, color class, icon, a short tooltip,
 * and example items. Three user-selectable levels for LOST items
 * (max/medium/low); `normal` (blue) is auto-assigned to FOUND items and is not
 * user-selectable.
 */
export const URGENCY = {
  max: {
    label: 'Urgence Maximale',
    cls: 'urg--max',
    icon: FiAlertOctagon,
    tip: 'Urgence Maximale — Personnes ou animaux (enfant, adulte, personne âgée/vulnérable, animal).',
    items: ['Enfant', 'Adulte', 'Personne âgée / vulnérable', 'Animal'],
  },
  medium: {
    label: 'Priorité Moyenne',
    cls: 'urg--medium',
    icon: FiAlertTriangle,
    tip: 'Priorité Moyenne — Papiers de véhicule, téléphone, clés, portefeuille, documents officiels, ordinateur.',
    items: [
      'Papiers de véhicule',
      'Téléphone',
      'Clés',
      'Portefeuille',
      'Documents officiels (CIN, passeport, permis)',
      'Ordinateur portable',
    ],
  },
  low: {
    label: 'Priorité Faible',
    cls: 'urg--low',
    icon: FiChevronsDown,
    tip: 'Priorité Faible — Petits objets du quotidien (jouet, lunettes, vêtements, livre, gourde…).',
    items: ['Jouet', 'Lunettes', 'Panier', 'Vêtements', 'Parapluie', 'Livre', 'Gourde'],
  },
  // Blue — reserved for FOUND items (not selectable when creating a lost report).
  normal: {
    label: 'Trouvé',
    cls: 'urg--normal',
    icon: FiTag,
    tip: 'Objet trouvé — signalé par un membre de la communauté.',
    items: [],
  },
  // Backward-compat alias for any legacy "high" value.
  high: {
    label: 'Priorité Moyenne',
    cls: 'urg--medium',
    icon: FiAlertTriangle,
    tip: 'Priorité Moyenne.',
    items: [],
  },
}

/** Levels a user can pick when creating a LOST report (red, orange, green). */
export const URGENCY_OPTIONS = ['max', 'medium', 'low']

/** All levels incl. blue (found) — for filters and badges. */
export const URGENCY_ALL = ['max', 'medium', 'low', 'normal']

/**
 * Small colored urgency badge.
 * @param {string} level
 * @param {boolean} tooltip  show a hover popover explaining the level
 */
export default function UrgencyBadge({ level = 'normal', tooltip = false, className = '' }) {
  const u = URGENCY[level] || URGENCY.normal
  const Icon = u.icon
  return (
    <span
      className={`urg-badge ${u.cls} ${tooltip ? 'urg-badge--tip' : ''} ${className}`}
      title={u.tip}
    >
      <Icon />
      {u.label}
      {tooltip && (
        <span className="urg-tip" role="tooltip">
          {u.tip}
        </span>
      )}
    </span>
  )
}
