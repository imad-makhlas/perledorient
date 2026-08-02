import type { Product } from '../features/catalog/catalog'

const images = {
  layali: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=88',
  nour: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=88',
  zahra: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=88',
  qamar: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=88',
  yasmin: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=88',
  amira: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=88',
  sahar: 'https://images.unsplash.com/photo-1627293509201-cd0c780043e6?auto=format&fit=crop&w=1200&q=88',
  medina: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=1200&q=88',
  riad: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=88',
  heritage: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=88',
}

const seed = [
  ['layali-necklace', 'Layali Necklace', 'Necklaces', images.layali, 520, 650, 'Gold-plated brass', 'Antique gold', 'Adjustable 42-48 cm'],
  ['nour-pearl-earrings', 'Nour Pearl Earrings', 'Earrings', images.nour, 390, 0, 'Freshwater pearl', 'Warm gold', '3.2 cm drop'],
  ['zahra-bracelet', 'Zahra Bracelet', 'Bracelets', images.zahra, 440, 520, 'Gold-plated brass', 'Brushed gold', 'Adjustable 16-20 cm'],
  ['qamar-ring', 'Qamar Ring', 'Rings', images.qamar, 320, 0, 'Gold-plated brass', 'Mother-of-pearl', 'Adjustable size'],
  ['yasmin-necklace', 'Yasmin Necklace', 'Necklaces', images.yasmin, 590, 690, 'Gold-plated brass', 'Pearl and gold', '45 cm chain'],
  ['amira-hoops', 'Amira Hoops', 'Earrings', images.amira, 350, 0, 'Gold-plated brass', 'Hammered gold', '4 cm diameter'],
  ['sahar-cuff', 'Sahar Cuff', 'Bracelets', images.sahar, 480, 560, 'Gold-plated brass', 'Antique finish', 'Adjustable cuff'],
  ['medina-ring', 'Medina Ring', 'Rings', images.medina, 340, 0, 'Gold-plated brass', 'Burgundy stone', 'Adjustable size'],
  ['riad-gift-set', 'Riad Gift Set', 'Gift Sets', images.riad, 890, 1050, 'Gold-plated brass', 'Pearl and gold', 'Necklace and earrings'],
  ['heritage-gift-set', 'Heritage Gift Set', 'Gift Sets', images.heritage, 980, 1180, 'Gold-plated brass', 'Antique gold', 'Necklace, bracelet and ring'],
] as const

export const products: Product[] = seed.map((item, index) => {
  const [slug, name, category, image, price, comparisonPrice, material, finish, dimensions] = item
  const stock = index === 7 ? 0 : index === 5 ? 3 : 7 + index
  return {
    id: `jewel-${index + 1}`, slug, name, brand: "Perle d'Orient", category, material, dimensions, image, images: [image], price,
    comparisonPrice: comparisonPrice || undefined, stock, featured: index < 4, isNew: index === 1 || index === 4 || index === 8,
    shortDescription: 'A handcrafted piece shaped by oriental motifs and finished in small series.',
    description: `${name} is handcrafted in small series for Perle d'Orient. Its warm finish and delicate proportions bring an oriental accent to everyday dressing and special occasions.`,
    specifications: { Material: material, Finish: finish, Dimensions: dimensions, Craft: 'Hand-finished in small series', Care: 'Keep dry and store separately in its pouch' },
    variants: [{ id: `jewel-variant-${index + 1}-a`, name: finish, sku: `PDO-${String(index + 1).padStart(3, '0')}-A`, options: { Finish: finish }, price, stock, image }],
  }
})

export const categories = [
  { name: 'Necklaces', image: images.layali }, { name: 'Earrings', image: images.nour }, { name: 'Bracelets', image: images.zahra },
  { name: 'Rings', image: images.qamar }, { name: 'Gift Sets', image: images.riad },
]
