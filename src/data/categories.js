import {
  FiSmartphone,
  FiCreditCard,
  FiKey,
  FiUser,
  FiBriefcase,
  FiWatch,
  FiTruck,
  FiHeart,
  FiPackage,
} from 'react-icons/fi'

// Categories shown on the home page and used in filters / forms.
export const categories = [
  { id: 'electronique', label: 'Électronique', icon: FiSmartphone, count: 128 },
  { id: 'documents', label: 'Documents & CIN', icon: FiCreditCard, count: 94 },
  { id: 'cles', label: 'Clés', icon: FiKey, count: 61 },
  { id: 'personnes', label: 'Personnes', icon: FiUser, count: 23 },
  { id: 'sacs', label: 'Sacs & Bagages', icon: FiBriefcase, count: 87 },
  { id: 'accessoires', label: 'Accessoires', icon: FiWatch, count: 52 },
  { id: 'vehicules', label: 'Véhicules', icon: FiTruck, count: 38 },
  { id: 'animaux', label: 'Animaux', icon: FiHeart, count: 19 },
  { id: 'autres', label: 'Autres', icon: FiPackage, count: 44 },
]

// Quick filter chips used on the feed.
export const feedFilters = [
  { id: 'tout', label: 'Tout' },
  { id: 'urgence-max', label: '🔴 Urgence max' },
  { id: 'elevee', label: '🟠 Élevée' },
  { id: 'vehicules', label: '🚗 Véhicules' },
  { id: 'perdus-trouves', label: '🔵 Perdus / Trouvés' },
]
