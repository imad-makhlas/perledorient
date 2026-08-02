import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { categories, products } from '../data/jewelry-products'
import { filterProducts, type CatalogFilters } from '../features/catalog/catalog'
import { CatalogSortMenu } from '../features/catalog/CatalogSortMenu'
import { catalogUi, categoryLabel, type CatalogCategory } from '../features/catalog/catalog-ui'
import { useI18n } from '../i18n/i18n'

export function CataloguePage() {
  const [params] = useSearchParams()
  const { locale, t } = useI18n()
  const [search, setSearch] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<CatalogFilters['sort']>((params.get('sort') as CatalogFilters['sort']) ?? 'featured')
  const results = useMemo(() => filterProducts(products, { search, category, inStockOnly, sort }), [search, category, inStockOnly, sort])
  const ui = catalogUi(locale)
  const categoryValues = ['', ...categories.map((item) => item.name)]
  const sortEntries = Object.entries(ui.sort) as Array<[CatalogFilters['sort'], string]>

  return <main className="min-h-screen bg-white">
    <div className="container-shell py-7 lg:py-9">
      <section className="catalog-toolbar" aria-label={t('filters')}>
        <div className="catalog-toolbar-head"><div><p>{locale === 'fr' ? 'La collection' : 'The collection'}</p><span>{locale === 'fr' ? "Bijoux artisanaux inspirés d'un souffle oriental" : 'Artisan jewelry inspired by an oriental breath'}</span></div><p className="catalog-count"><strong>{results.length}</strong><span>{ui.results}</span></p></div>
        <label className="catalog-search"><Search aria-hidden="true" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ui.search} /></label>
        <div className="catalog-filter-row">
          <div className="catalog-chips" aria-label={t('categories')}>{categoryValues.map((value) => <button key={value || 'all'} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={`catalog-chip ${category === value ? 'catalog-chip-active' : ''}`}>{categoryLabel((value || 'All') as CatalogCategory, locale)}</button>)}</div>
          <div className="catalog-utilities">
            <label className="catalog-availability"><input className="sr-only" type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /><span aria-hidden="true" className={`catalog-switch ${inStockOnly ? 'catalog-switch-active' : ''}`}><span /></span><span>{ui.availability}</span></label>
            <CatalogSortMenu label={ui.sortLabel} value={sort} options={sortEntries} onChange={setSort} />
          </div>
        </div>
      </section>
      <div className="mb-7 mt-10 flex items-end justify-between border-b border-line pb-4"><div><p className="text-[9px] font-bold uppercase tracking-[.24em] text-accent">{t('catalogue')}</p><p className="mt-2 text-xs text-muted">{results.length} {ui.results}</p></div>{(search || category || inStockOnly) && <button type="button" onClick={() => { setSearch(''); setCategory(''); setInStockOnly(false) }} className="text-[9px] font-bold uppercase tracking-[.18em] text-burgundy underline decoration-accent underline-offset-4">{locale === 'fr' ? 'Effacer les filtres' : 'Clear filters'}</button>}</div>
      {results.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="luxe-surface px-6 py-20 text-center"><h2 className="display text-3xl font-semibold">{ui.emptyTitle}</h2><p className="mt-3 text-sm text-muted">{ui.emptyBody}</p></div>}
    </div>
  </main>
}
