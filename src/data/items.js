// Mock data until we have a backend.
// `icon` is a lucide-react icon name used as a placeholder picture;
// swap it for a real `image` URL later.

export const CURRENT_LOCATION = 'Bundesallee, Schöneberg'

export const CATEGORIES = [
  { id: 'all', label: 'All items' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'appliances', label: 'Appliances' },
  { id: 'free', label: 'Free' },
]

export const ITEMS = [
  {
    id: 'linen-sofa',
    title: 'Linen two-seater sofa',
    price: 85,
    category: 'furniture',
    distanceKm: 0.4,
    postedAgo: 'Just listed',
    condition: 'Good condition',
    size: '160 × 85 × 80 cm',
    description: 'Comfy sage-green sofa, looking for a new home. Lightly used, with removable cushion covers. Moving soon, happy to arrange pickup.',
    seller: { name: 'Maya K.', since: 2023 },
    icon: 'Sofa',
    tint: '#dfe7dc',
  },
  {
    id: 'oak-sideboard',
    title: 'Vintage oak sideboard',
    price: 0,
    category: 'furniture',
    distanceKm: 0.7,
    postedAgo: '1 hour ago',
    condition: 'Used',
    size: '140 × 45 × 75 cm',
    description: 'Solid oak, a few scratches on top. Free if you pick it up this week.',
    seller: { name: 'Jonas B.', since: 2024 },
    icon: 'Table',
    tint: '#ece3d6',
  },
  {
    id: 'espresso-machine',
    title: 'Espresso machine',
    price: 45,
    category: 'appliances',
    distanceKm: 0.3,
    postedAgo: '2 hours ago',
    condition: 'Like new',
    size: '30 × 25 × 35 cm',
    description: 'Works perfectly, descaled last month. Comes with the milk jug.',
    seller: { name: 'Lea S.', since: 2022 },
    icon: 'Coffee',
    tint: '#e9e2dc',
  },
  {
    id: 'washer',
    title: 'Front-load washer',
    price: 120,
    category: 'appliances',
    distanceKm: 1.2,
    postedAgo: '3 hours ago',
    condition: 'Good condition',
    size: '60 × 60 × 85 cm',
    description: '7 kg, energy class A. Needs two people to carry, ground floor.',
    seller: { name: 'Ahmed R.', since: 2023 },
    icon: 'WashingMachine',
    tint: '#e1e6e8',
  },
  {
    id: 'armchair',
    title: 'Reading armchair',
    price: 30,
    category: 'furniture',
    distanceKm: 0.5,
    postedAgo: '5 hours ago',
    condition: 'Good condition',
    size: '75 × 80 × 95 cm',
    description: 'Soft grey fabric, very comfortable. No pets, no smoking.',
    seller: { name: 'Clara M.', since: 2025 },
    icon: 'Armchair',
    tint: '#e4e4ea',
  },
  {
    id: 'microwave',
    title: 'Microwave',
    price: 0,
    category: 'appliances',
    distanceKm: 0.9,
    postedAgo: 'Yesterday',
    condition: 'Used',
    size: '45 × 35 × 26 cm',
    description: 'Basic 800 W microwave. Works fine, I just got a new one.',
    seller: { name: 'Tom W.', since: 2024 },
    icon: 'Microwave',
    tint: '#e6ebe1',
  },
  {
    id: 'floor-lamp',
    title: 'Floor lamp',
    price: 15,
    category: 'furniture',
    distanceKm: 0.6,
    postedAgo: 'Yesterday',
    condition: 'Like new',
    size: '160 cm tall',
    description: 'Warm light, linen shade. Bulb included.',
    seller: { name: 'Maya K.', since: 2023 },
    icon: 'LampFloor',
    tint: '#efe8d8',
  },
  {
    id: 'bookshelf',
    title: 'Tall bookshelf',
    price: 0,
    category: 'furniture',
    distanceKm: 1.1,
    postedAgo: '2 days ago',
    condition: 'Used',
    size: '80 × 30 × 190 cm',
    description: 'White, five shelves. Already taken apart for easy transport.',
    seller: { name: 'Nina P.', since: 2024 },
    icon: 'Library',
    tint: '#e2e8e4',
  },
]

export function formatPrice(price) {
  return price === 0 ? 'Free' : `€${price}`
}

export function formatDistance(km) {
  return `${km.toFixed(1)} km`
}
