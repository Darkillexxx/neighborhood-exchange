// Mock data until we have a backend.
// `distanceKm` and `bearing` (degrees clockwise from north) place the item
// around the user on the Nearby map.
// `image` is a photo in public/ (the path starts with "/").
// Items without a photo show a placeholder instead: `icon` is a lucide-react
// icon name and `tint` is the background color behind it.

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
    area: 'Schöneberg',
    title: 'Linen two-seater sofa',
    price: 85,
    category: 'furniture',
    distanceKm: 0.4,
    bearing: 180,
    postedAgo: 'Just listed',
    condition: 'Good condition',
    size: '160 × 85 × 80 cm',
    description: 'Comfy sage-green sofa, looking for a new home. Lightly used, with removable cushion covers. Moving soon, happy to arrange pickup.',
    seller: { name: 'Maya K.', since: 2023 },
    image: '/items/linen-sofa.jpg',
    icon: 'Sofa',
    tint: '#dfe7dc',
  },
  {
    id: 'oak-sideboard',
    area: 'Friedenau',
    title: 'Vintage oak sideboard',
    price: 0,
    category: 'furniture',
    distanceKm: 0.7,
    bearing: 30,
    postedAgo: '1 hour ago',
    condition: 'Used',
    size: '140 × 45 × 75 cm',
    description: 'Solid oak, a few scratches on top. Free if you pick it up this week.',
    seller: { name: 'Jonas B.', since: 2024 },
    image: '/items/oak-sideboard.jpg',
    icon: 'Table',
    tint: '#ece3d6',
  },
  {
    id: 'espresso-machine',
    area: 'Schöneberg',
    title: 'Espresso machine',
    price: 45,
    category: 'appliances',
    distanceKm: 0.3,
    bearing: 0,
    postedAgo: '2 hours ago',
    condition: 'Like new',
    size: '30 × 25 × 35 cm',
    description: 'Works perfectly, descaled last month. Comes with the milk jug.',
    seller: { name: 'Lea S.', since: 2022 },
    image: '/items/espresso-machine.jpg',
    icon: 'Coffee',
    tint: '#e9e2dc',
  },
  {
    id: 'washer',
    area: 'Wilmersdorf',
    title: 'Front-load washer',
    price: 120,
    category: 'appliances',
    distanceKm: 1.2,
    bearing: 135,
    postedAgo: '3 hours ago',
    condition: 'Good condition',
    size: '60 × 60 × 85 cm',
    description: '7 kg, energy class A. Needs two people to carry, ground floor.',
    seller: { name: 'Ahmed R.', since: 2023 },
    image: '/items/washer.jpg',
    icon: 'WashingMachine',
    tint: '#e1e6e8',
  },
  {
    id: 'armchair',
    area: 'Schöneberg',
    title: 'Reading armchair',
    price: 30,
    category: 'furniture',
    distanceKm: 0.5,
    bearing: 90,
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
    area: 'Friedenau',
    title: 'Microwave',
    price: 0,
    category: 'appliances',
    distanceKm: 0.9,
    bearing: 225,
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
    area: 'Schöneberg',
    title: 'Floor lamp',
    price: 15,
    category: 'furniture',
    distanceKm: 0.6,
    bearing: 270,
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
    area: 'Wilmersdorf',
    title: 'Tall bookshelf',
    price: 0,
    category: 'furniture',
    distanceKm: 1.1,
    bearing: 315,
    postedAgo: '2 days ago',
    condition: 'Used',
    size: '80 × 30 × 190 cm',
    description: 'White, five shelves. Already taken apart for easy transport.',
    seller: { name: 'Nina P.', since: 2024 },
    icon: 'Library',
    tint: '#e2e8e4',
  },
]

function matchesCategory(item, category) {
  if (category === 'all') return true
  if (category === 'free') return item.price === 0
  return item.category === category
}

/**
 * The items shown on Home for the chosen chip and search text.
 * @param {typeof ITEMS} items
 * @param {{ query: string, category: string }} filter `category` is an id from CATEGORIES
 * @returns {typeof ITEMS} a new list; `items` is not changed
 */
export function filterItems(items, { query, category }) {
  const search = query.trim().toLowerCase()
  return items.filter(
    (item) => matchesCategory(item, category) && item.title.toLowerCase().includes(search),
  )
}

export function formatPrice(price) {
  return price === 0 ? 'Free' : `€${price}`
}

export function formatDistance(km) {
  return `${km.toFixed(1)} km`
}
