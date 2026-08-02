import type { Product } from '../features/catalog/catalog'

const images = {
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
  perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
  chair: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1000&q=85',
  bag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85',
}

const seed = [
  ['atlas-chronograph', 'Atlas Chronograph', 'Maison Nadir', 'Fashion', images.watch, 1290, 1590],
  ['nocturne-parfum', 'Nocturne Parfum', 'Sillage', 'Beauty', images.perfume, 790, 950],
  ['studio-headphones', 'Studio Headphones', 'Orbis', 'Electronics', images.headphones, 1490, 1790],
  ['linea-lounge-chair', 'Linea Lounge Chair', 'Nour Home', 'Home', images.chair, 2390, 2790],
  ['atlas-weekender', 'Atlas Weekender', 'Atelier 12', 'Fashion', images.bag, 1190, 1390],
  ['frame-camera', 'Frame Compact Camera', 'Orbis', 'Electronics', images.camera, 4290, 4690],
  ['velocity-runner', 'Velocity Runner', 'Meridian', 'Sports', images.shoes, 890, 1090],
  ['ritual-coffee-set', 'Ritual Coffee Set', 'Nour Home', 'Home', images.coffee, 640, 0],
] as const

export const products: Product[] = seed.map((item, index) => {
  const [slug, name, brand, category, image, price, comparisonPrice] = item
  const stock = index === 7 ? 0 : index === 5 ? 3 : 12 + index
  return {
    id: `product-${index + 1}`,
    slug,
    name,
    brand,
    category,
    image,
    images: [image],
    price,
    comparisonPrice: comparisonPrice || undefined,
    stock,
    featured: index < 4,
    isNew: index === 1 || index === 4 || index === 6,
    shortDescription: 'Considered design, premium materials, and dependable everyday performance.',
    description: `${name} is selected for CODAvenue's edit of elevated essentials. Every detail balances lasting quality with effortless daily use.`,
    specifications: (category === 'Electronics'
      ? { Warranty: '12 months', Connectivity: 'Wireless', Finish: 'Premium matte' }
      : { Material: 'Premium grade', Origin: 'Curated selection', Care: 'See care guide' }) as Record<string, string>,
    variants: [
      { id: `variant-${index + 1}-a`, name: 'Classic', sku: `COD-${String(index + 1).padStart(3, '0')}-A`, options: { Finish: 'Classic' }, price, stock, image },
      { id: `variant-${index + 1}-b`, name: 'Signature', sku: `COD-${String(index + 1).padStart(3, '0')}-B`, options: { Finish: 'Signature' }, price: price + 120, stock: Math.max(0, stock - 5), image },
    ],
  }
})

export const categories = [
  { name: 'Beauty', image: images.perfume },
  { name: 'Fashion', image: images.bag },
  { name: 'Electronics', image: images.headphones },
  { name: 'Home', image: images.chair },
  { name: 'Sports', image: images.shoes },
  { name: 'Automotive', image: images.camera },
]
