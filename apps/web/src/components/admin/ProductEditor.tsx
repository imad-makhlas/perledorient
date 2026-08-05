import { Save, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { AdminProduct, EditableAdminProduct } from '../../features/admin/admin-products'

const categories = ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Gift Sets']
const emptyProduct: EditableAdminProduct = {
  slug: '', nameEn: '', nameFr: '', descriptionEn: '', descriptionFr: '', category: 'Necklaces',
  material: '', dimensions: '', variantName: '', sku: '', price: 0, comparisonPrice: null,
  stock: 0, active: true, featured: false, imageUrl: '',
}

export function ProductEditor({ product, onClose, onSave, busy }: { product: AdminProduct | null; onClose: () => void; onSave: (value: EditableAdminProduct) => void; busy: boolean }) {
  const [draft, setDraft] = useState<EditableAdminProduct>(product ? { ...product } : emptyProduct)
  const set = <K extends keyof EditableAdminProduct>(key: K, value: EditableAdminProduct[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent) => { event.preventDefault(); onSave(draft) }
  return <div className="fixed inset-0 z-50 bg-black/35 p-0 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true">
    <form onSubmit={submit} className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-[24px]">
      <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7"><div><p className="eyebrow">Catalogue</p><h2 className="display mt-1 text-3xl font-semibold">{product ? 'Modifier le bijou' : 'Ajouter un bijou'}</h2></div><button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full border border-line"><X size={18} /></button></header>
      <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-7">
        <section><p className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-accent">Contenu bilingue</p><div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Nom anglais<input className="field mt-2" value={draft.nameEn} onChange={(event) => set('nameEn', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Nom français<input className="field mt-2" value={draft.nameFr} onChange={(event) => set('nameFr', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Description anglaise<textarea className="field mt-2 min-h-28" value={draft.descriptionEn} onChange={(event) => set('descriptionEn', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Description française<textarea className="field mt-2 min-h-28" value={draft.descriptionFr} onChange={(event) => set('descriptionFr', event.target.value)} required /></label>
        </div></section>
        <section><p className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-accent">Informations produit</p><div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Lien produit<input className="field mt-2" value={draft.slug} onChange={(event) => set('slug', event.target.value)} placeholder="collier-layali" required /></label>
          <label className="text-xs font-semibold">Catégorie<select className="field mt-2" value={draft.category} onChange={(event) => set('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="text-xs font-semibold">Matière<input className="field mt-2" value={draft.material} onChange={(event) => set('material', event.target.value)} /></label>
          <label className="text-xs font-semibold">Taille / dimensions<input className="field mt-2" value={draft.dimensions} onChange={(event) => set('dimensions', event.target.value)} /></label>
          <label className="text-xs font-semibold">Finition<input className="field mt-2" value={draft.variantName} onChange={(event) => set('variantName', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Référence SKU<input className="field mt-2" value={draft.sku} onChange={(event) => set('sku', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Prix (MAD)<input className="field mt-2" type="number" min="0" value={draft.price} onChange={(event) => set('price', Number(event.target.value))} required /></label>
          <label className="text-xs font-semibold">Ancien prix (facultatif)<input className="field mt-2" type="number" min="0" value={draft.comparisonPrice ?? ''} onChange={(event) => set('comparisonPrice', event.target.value ? Number(event.target.value) : null)} /></label>
          <label className="text-xs font-semibold">Stock<input className="field mt-2" type="number" min="0" value={draft.stock} onChange={(event) => set('stock', Number(event.target.value))} required /></label>
          <label className="text-xs font-semibold">URL de la photo<input className="field mt-2" type="url" value={draft.imageUrl} onChange={(event) => set('imageUrl', event.target.value)} /></label>
        </div></section>
        {draft.imageUrl && <div className="overflow-hidden rounded-2xl border border-line bg-canvas"><img src={draft.imageUrl} alt="Aperçu" className="h-52 w-full object-cover" /></div>}
        <div className="flex flex-wrap gap-5"><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.active} onChange={(event) => set('active', event.target.checked)} />Publié dans la boutique</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.featured} onChange={(event) => set('featured', event.target.checked)} />Mettre en avant</label></div>
      </div>
      <footer className="flex justify-end gap-3 border-t border-line bg-[#FBF9F6] p-4 sm:px-7"><button type="button" onClick={onClose} className="button-secondary">Annuler</button><button disabled={busy} className="button-primary button-accent disabled:opacity-60"><Save size={16} />{busy ? 'Enregistrement…' : 'Enregistrer'}</button></footer>
    </form>
  </div>
}
