export type CatalogLocale = 'en' | 'fr'
export type CatalogCategory = 'All' | 'Necklaces' | 'Earrings' | 'Bracelets' | 'Rings' | 'Gift Sets'

const copy = {
  en: {
    search: 'Search the collection', availability: 'Available now', results: 'pieces',
    emptyTitle: 'No piece matches your selection.', emptyBody: 'Try another category or clear a filter.', sortLabel: 'Arrange by',
    sort: { featured: 'Featured', newest: 'Newest', 'price-asc': 'Low to high', 'price-desc': 'High to low', 'name-asc': 'Name A-Z', 'name-desc': 'Name Z-A' },
  },
  fr: {
    search: 'Rechercher dans la collection', availability: 'Disponibles', results: 'pièces',
    emptyTitle: 'Aucun bijou ne correspond à votre sélection.', emptyBody: 'Essayez une autre catégorie ou retirez un filtre.', sortLabel: 'Classer par',
    sort: { featured: 'Nos favoris', newest: 'Nouveautés', 'price-asc': 'Prix doux', 'price-desc': 'Prix élevé', 'name-asc': 'Nom A-Z', 'name-desc': 'Nom Z-A' },
  },
} as const

const categories: Record<CatalogLocale, Record<CatalogCategory, string>> = {
  en: { All: 'All pieces', Necklaces: 'Necklaces', Earrings: 'Earrings', Bracelets: 'Bracelets', Rings: 'Rings', 'Gift Sets': 'Gift Sets' },
  fr: { All: 'Tous les bijoux', Necklaces: 'Colliers', Earrings: "Boucles d'oreilles", Bracelets: 'Bracelets', Rings: 'Bagues', 'Gift Sets': 'Coffrets cadeaux' },
}

export function catalogUi(locale: CatalogLocale) { return copy[locale] }
export function categoryLabel(category: CatalogCategory, locale: CatalogLocale) { return categories[locale][category] }
