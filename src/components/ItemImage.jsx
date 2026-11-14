import {
  Sofa,
  Table,
  Coffee,
  WashingMachine,
  Armchair,
  Microwave,
  LampFloor,
  Library,
  PackageOpen,
} from 'lucide-react'

// Placeholder icons by name. Add a new one here when you add a new kind of item.
const ICONS = { Sofa, Table, Coffee, WashingMachine, Armchair, Microwave, LampFloor, Library }

// Shows the item's photo if it has one, otherwise a tinted placeholder with an icon.
export default function ItemImage({ item, iconSize = 56, className = '' }) {
  if (item.image) {
    return <img className={className} src={item.image} alt={item.title} loading="lazy" />
  }

  const Icon = ICONS[item.icon] ?? PackageOpen

  return (
    <div
      className={className}
      style={{ background: item.tint, display: 'grid', placeItems: 'center' }}
      role="img"
      aria-label={item.title}
    >
      <Icon size={iconSize} strokeWidth={1.25} color="rgba(29, 38, 33, 0.55)" />
    </div>
  )
}
