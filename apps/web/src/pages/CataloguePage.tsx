import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { categories } from '../data/jewelry-products'
import { filterProducts, type CatalogFilters } from '../features/catalog/catalog'
import { useCatalogProducts } from '../features/catalog/catalog-api'
import { CatalogSortMenu } from '../features/catalog/CatalogSortMenu'
import { catalogUi, categoryLabel, type CatalogCategory } from '../features/catalog/catalog-ui'
import { useI18n } from '../i18n/i18n'

export function CataloguePage() {
  const [params] = useSearchParams()
  const { locale, t } = useI18n()
  const products = useCatalogProducts(locale)
  const [search, setSearch] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<CatalogFilters['sort']>((params.get('sort') as CatalogFilters['sort']) ?? 'featured')
  const results = useMemo(() => filterProducts(products, { search, category, inStockOnly, sort }), [products, search, category, inStockOnly, sort])
  const ui = catalogUi(locale)
  const categoryValues = ['', ...categories.map((item) => item.name)]
  const sortEntries = Object.entries(ui.sort) as Array<[CatalogFilters['sort'], string]>

  return <main className="min-h-screen bg-white">
    <div className="container-shell py-4 lg:py-6">
      <section className="catalog-toolbar" aria-label={locale === 'fr' ? 'Outils du catalogue' : 'أدوات الكتالوج'}>
        <div className="catalog-primary-row"><label className="catalog-search"><Search aria-hidden="true" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ui.search} /></label><p className="catalog-count" aria-label={`${results.length} ${ui.results}`}><strong>{results.length}</strong><span>{ui.results}</span></p></div>
        <div className="catalog-filter-row">
          <div className="catalog-chips" aria-label={t('categories')}>{categoryValues.map((value) => <button key={value || 'all'} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={`catalog-chip ${category === value ? 'catalog-chip-active' : ''}`}>{categoryLabel((value || 'All') as CatalogCategory, locale)}</button>)}</div>
          <div className="catalog-utilities">
            <label className="catalog-availability"><input className="sr-only" type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /><span aria-hidden="true" className={`catalog-switch ${inStockOnly ? 'catalog-switch-active' : ''}`}><span /></span><span>{ui.availability}</span></label>
            <CatalogSortMenu label={ui.sortLabel} value={sort} options={sortEntries} onChange={setSort} />
          </div>
        </div>
        {(search || category || inStockOnly) && <button type="button" onClick={() => { setSearch(''); setCategory(''); setInStockOnly(false) }} className="catalog-clear">{locale === 'fr' ? 'Effacer les filtres' : 'مسح التصفية'}</button>}
      </section>
      {results.length ? <div className="mt-6 grid grid-cols-1 gap-y-7 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:mt-8 lg:grid-cols-4 lg:gap-y-12">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="luxe-surface mt-8 px-6 py-20 text-center"><h2 className="display text-3xl font-semibold">{ui.emptyTitle}</h2><p className="mt-3 text-sm text-muted">{ui.emptyBody}</p></div>}
    </div>
  </main>
}
