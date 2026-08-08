import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, Save, Star, Trash2, X } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { validateProductImage } from '../../features/admin/cloudinary-image'
import type { AdminProduct, EditableAdminProduct } from '../../features/admin/admin-products'
import { categoryLabel, type CatalogCategory } from '../../features/catalog/catalog-ui'

const categories: CatalogCategory[] = ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Gift Sets']
const emptyProduct: EditableAdminProduct = {
  slug: '', nameFr: '', nameAr: '', descriptionFr: '', descriptionAr: '', category: 'Necklaces',
  material: '', dimensions: '', variantName: '', sku: '', price: 0, comparisonPrice: null,
  stock: 0, active: true, featured: false, imageUrl: '', imageUrls: [],
}

type ProductEditorProps = {
  product: AdminProduct | null
  suggestedSku: string
  onClose: () => void
  onSave: (value: EditableAdminProduct, removedImageUrls?: string[]) => void
  onUploadImage: (file: File) => Promise<string>
  onDeleteImage: (imageUrl: string) => Promise<void>
  busy: boolean
}

export function ProductEditor({ product, suggestedSku, onClose, onSave, onUploadImage, onDeleteImage, busy }: ProductEditorProps) {
  const [draft, setDraft] = useState<EditableAdminProduct>(product ? { ...product } : emptyProduct)
  const [temporaryImageUrls, setTemporaryImageUrls] = useState<string[]>([])
  const [imageBusy, setImageBusy] = useState(false)
  const [imageError, setImageError] = useState('')
  const initialImageUrls = product?.imageUrls || (product?.imageUrl ? [product.imageUrl] : [])
  const set = <K extends keyof EditableAdminProduct>(key: K, value: EditableAdminProduct[K]) => setDraft((current) => ({ ...current, [key]: value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave(draft, initialImageUrls.filter((imageUrl) => !draft.imageUrls.includes(imageUrl)))
  }
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files || [])]
    event.target.value = ''
    if (!files.length) return
    if (draft.imageUrls.length + files.length > 6) { setImageError('Vous pouvez ajouter au maximum 6 photos.'); return }
    setImageBusy(true); setImageError('')
    try {
      files.forEach(validateProductImage)
      const nextImageUrls = await Promise.all(files.map(onUploadImage))
      const allImages = [...draft.imageUrls, ...nextImageUrls]
      setDraft((current) => ({ ...current, imageUrl: allImages[0] || '', imageUrls: allImages }))
      setTemporaryImageUrls((current) => [...current, ...nextImageUrls])
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Impossible d’envoyer cette photo')
    } finally {
      setImageBusy(false)
    }
  }
  const removeImage = async (index: number) => {
    const imageToClean = draft.imageUrls[index]
    const nextImages = draft.imageUrls.filter((_, imageIndex) => imageIndex !== index)
    setDraft((current) => ({ ...current, imageUrl: nextImages[0] || '', imageUrls: nextImages })); setImageError('')
    if (!temporaryImageUrls.includes(imageToClean)) return
    setImageBusy(true)
    try { await onDeleteImage(imageToClean); setTemporaryImageUrls((current) => current.filter((url) => url !== imageToClean)) }
    catch (error) { setImageError(error instanceof Error ? error.message : 'Impossible de supprimer cette photo') }
    finally { setImageBusy(false) }
  }
  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= draft.imageUrls.length) return
    const nextImages = [...draft.imageUrls]
    ;[nextImages[index], nextImages[target]] = [nextImages[target], nextImages[index]]
    setDraft((current) => ({ ...current, imageUrl: nextImages[0], imageUrls: nextImages }))
  }
  const makePrimary = (index: number) => {
    const nextImages = [draft.imageUrls[index], ...draft.imageUrls.filter((_, imageIndex) => imageIndex !== index)]
    setDraft((current) => ({ ...current, imageUrl: nextImages[0], imageUrls: nextImages }))
  }
  const cancel = async () => {
    if (temporaryImageUrls.length) {
      setImageBusy(true)
      try { await Promise.all(temporaryImageUrls.map((imageUrl) => onDeleteImage(imageUrl))) } catch { /* Cleanup can be retried from Cloudinary. */ }
    }
    onClose()
  }

  return <div className="fixed inset-0 z-50 bg-black/35 p-0 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true">
    <form onSubmit={submit} className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-[24px]">
      <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7"><div><p className="eyebrow">Catalogue</p><h2 className="display mt-1 text-3xl font-semibold">{product ? 'Modifier le bijou' : 'Ajouter un bijou'}</h2></div><button type="button" onClick={cancel} disabled={imageBusy} className="grid h-11 w-11 place-items-center rounded-full border border-line disabled:opacity-50" aria-label="Fermer"><X size={18} /></button></header>
      <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-7">
        <section><p className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-accent">Contenu bilingue</p><div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Nom français<input className="field mt-2" value={draft.nameFr} onChange={(event) => set('nameFr', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Nom arabe<input dir="rtl" className="field mt-2 text-right" value={draft.nameAr} onChange={(event) => set('nameAr', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Description française<textarea className="field mt-2 min-h-28" value={draft.descriptionFr} onChange={(event) => set('descriptionFr', event.target.value)} required /></label>
          <label className="text-xs font-semibold">Description arabe<textarea dir="rtl" className="field mt-2 min-h-28 text-right" value={draft.descriptionAr} onChange={(event) => set('descriptionAr', event.target.value)} required /></label>
        </div></section>
        <section><p className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-accent">Informations produit</p><div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Lien produit<input className="field mt-2" value={draft.slug} onChange={(event) => set('slug', event.target.value)} placeholder="collier-layali" required /></label>
          <label className="text-xs font-semibold">Catégorie<select className="field mt-2" value={draft.category} onChange={(event) => set('category', event.target.value)}>{categories.map((category) => <option key={category} value={category}>{categoryLabel(category, 'fr')}</option>)}</select></label>
          <label className="text-xs font-semibold">Matière<input className="field mt-2" value={draft.material} onChange={(event) => set('material', event.target.value)} /></label>
          <label className="text-xs font-semibold">Taille / dimensions<input className="field mt-2" value={draft.dimensions} onChange={(event) => set('dimensions', event.target.value)} /></label>
          <label className="text-xs font-semibold">Finition<input className="field mt-2" value={draft.variantName} onChange={(event) => set('variantName', event.target.value)} required /></label>
          <div className="text-xs font-semibold"><p>Référence produit (SKU)</p><div className="mt-2 rounded-xl border border-[#DDD4C9] bg-[#F8F5F0] px-4 py-3"><strong className="tracking-[.08em]">{product?.sku || suggestedSku}</strong><span className="mt-1 block text-[10px] font-normal text-[#7B7074]">{product ? 'Référence produit permanente' : 'Prochaine référence, confirmée à l’enregistrement'}</span></div></div>
          <label className="text-xs font-semibold">Prix (MAD)<input className="field mt-2" type="number" min="0" value={draft.price} onChange={(event) => set('price', Number(event.target.value))} required /></label>
          <label className="text-xs font-semibold">Ancien prix (facultatif)<input className="field mt-2" type="number" min="0" value={draft.comparisonPrice ?? ''} onChange={(event) => set('comparisonPrice', event.target.value ? Number(event.target.value) : null)} /></label>
          <label className="text-xs font-semibold">Stock<input className="field mt-2" type="number" min="0" value={draft.stock} onChange={(event) => set('stock', Number(event.target.value))} required /></label>
        </div></section>
        <section>
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Galerie du bijou</p><p className="mt-1 text-xs text-[#7B7074]">Jusqu’à 6 photos. La première devient la couverture du catalogue.</p></div><span className="rounded-full border border-[#DDD4C9] px-3 py-1 text-[10px] font-bold">{draft.imageUrls.length}/6</span></div>
          {draft.imageUrls.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{draft.imageUrls.map((imageUrl, index) => <article key={imageUrl} className="overflow-hidden rounded-2xl border border-[#DDD4C9] bg-[#F7F4EF]"><div className="relative aspect-square"><img src={imageUrl} alt={`Photo ${index + 1} du bijou`} className="h-full w-full object-cover" />{index === 0 && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#C4943D] px-2 py-1 text-[8px] font-bold uppercase"><Star size={10} />Principale</span>}</div><div className="grid grid-cols-4 border-t border-[#DDD4C9]"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0 || imageBusy} className="grid h-10 place-items-center disabled:opacity-25" aria-label="Déplacer la photo à gauche"><ArrowLeft size={14} /></button><button type="button" onClick={() => moveImage(index, 1)} disabled={index === draft.imageUrls.length - 1 || imageBusy} className="grid h-10 place-items-center disabled:opacity-25" aria-label="Déplacer la photo à droite"><ArrowRight size={14} /></button><button type="button" onClick={() => makePrimary(index)} disabled={index === 0 || imageBusy} className="grid h-10 place-items-center text-[#A06F22] disabled:opacity-25" aria-label="Définir comme photo principale"><Star size={14} /></button><button type="button" onClick={() => removeImage(index)} disabled={imageBusy} className="grid h-10 place-items-center text-red-700 disabled:opacity-50" aria-label="Retirer la photo"><Trash2 size={14} /></button></div></article>)}</div> : <div className="grid min-h-52 place-items-center rounded-2xl border border-[#DDD4C9] bg-[#F7F4EF] px-6 py-10 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#C4943D] shadow-sm"><ImagePlus size={23} /></span><p className="display mt-4 text-xl font-semibold">Ajouter de belles photos</p><p className="mt-2 text-xs text-[#7B7074]">JPG, PNG, WebP, AVIF ou HEIC · 10 Mo maximum</p></div></div>}
          <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#302A2E] px-5 text-[10px] font-bold uppercase tracking-[.14em] text-white transition hover:bg-[#463D42]">
            {imageBusy ? <LoaderCircle className="animate-spin" size={15} /> : <ImagePlus size={15} />}Ajouter des photos
            <input aria-label="Choisir des photos" multiple type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif" onChange={uploadImage} disabled={imageBusy || busy || draft.imageUrls.length >= 6} className="sr-only" />
          </label>
          {imageError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{imageError}</p>}
        </section>
        <div className="flex flex-wrap gap-5"><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.active} onChange={(event) => set('active', event.target.checked)} />Publié dans la boutique</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.featured} onChange={(event) => set('featured', event.target.checked)} />Mettre en avant</label></div>
      </div>
      <footer className="flex justify-end gap-3 border-t border-line bg-[#FBF9F6] p-4 sm:px-7"><button type="button" onClick={cancel} disabled={imageBusy} className="button-secondary disabled:opacity-50">Annuler</button><button disabled={busy || imageBusy} className="button-primary button-accent disabled:opacity-60"><Save size={16} />{busy ? 'Enregistrement…' : 'Enregistrer'}</button></footer>
    </form>
  </div>
}
