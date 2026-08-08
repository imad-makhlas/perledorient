export type CatalogLocale = 'fr' | 'ar'
export type CatalogCategory = 'All' | 'Necklaces' | 'Earrings' | 'Bracelets' | 'Rings' | 'Gift Sets'

const copy = {
  ar: {
    search: 'البحث في المجموعة', availability: 'متوفر الآن', results: 'قطع',
    emptyTitle: 'لا توجد قطعة مطابقة لاختيارك.', emptyBody: 'جرّبي فئة أخرى أو أزيلي أحد خيارات التصفية.', sortLabel: 'الترتيب حسب',
    sort: { featured: 'المفضلة', newest: 'الأحدث', 'price-asc': 'السعر تصاعدياً', 'price-desc': 'السعر تنازلياً', 'name-asc': 'الاسم أ-ي', 'name-desc': 'الاسم ي-أ' },
  },
  fr: {
    search: 'Rechercher dans la collection', availability: 'Disponibles', results: 'pièces',
    emptyTitle: 'Aucun bijou ne correspond à votre sélection.', emptyBody: 'Essayez une autre catégorie ou retirez un filtre.', sortLabel: 'Classer par',
    sort: { featured: 'Nos favoris', newest: 'Nouveautés', 'price-asc': 'Prix doux', 'price-desc': 'Prix élevé', 'name-asc': 'Nom A-Z', 'name-desc': 'Nom Z-A' },
  },
} as const

const categories: Record<CatalogLocale, Record<CatalogCategory, string>> = {
  ar: { All: 'كل المجوهرات', Necklaces: 'القلائد', Earrings: 'الأقراط', Bracelets: 'الأساور', Rings: 'الخواتم', 'Gift Sets': 'علب الهدايا' },
  fr: { All: 'Tous les bijoux', Necklaces: 'Colliers', Earrings: "Boucles d'oreilles", Bracelets: 'Bracelets', Rings: 'Bagues', 'Gift Sets': 'Coffrets cadeaux' },
}

export function catalogUi(locale: CatalogLocale) { return copy[locale] }
export function categoryLabel(category: CatalogCategory, locale: CatalogLocale) { return categories[locale][category] }
