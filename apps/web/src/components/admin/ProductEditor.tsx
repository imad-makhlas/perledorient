import { ImagePlus, LoaderCircle, Save, Trash2, X } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { validateProductImage } from '../../features/admin/cloudinary-image'
import type { AdminProduct, EditableAdminProduct } from '../../features/admin/admin-products'

const categories = ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Gift Sets']
const emptyProduct: EditableAdminProduct = {
  slug: '', nameEn: '', nameFr: '', descriptionEn: '', descriptionFr: '', category: 'Necklaces',
  material: '', dimensions: '', variantName: '', sku: '', price: 0, comparisonPrice: null,
  stock: 0, active: true, featured: false, imageUrl: '',
}

type ProductEditorProps = {
  product: AdminProduct | null
  onClose: () => void
  onSave: (value: EditableAdminProduct, replacedImageUrl?: string) => void
  onUploadImage: (file: File) => Promise<string>
  onDeleteImage: (imageUrl: string) => Promise<void>
  busy: boolean
}

export function ProductEditor({ product, onClose, onSave, onUploadImage, onDeleteImage, busy }: ProductEditorProps) {
  const [draft, setDraft] = useState<EditableAdminProduct>(product ? { ...product } : emptyProduct)
  const [temporaryImageUrl, setTemporaryImageUrl] = useState('')
  const [imageBusy, setImageBusy] = useState(false)
  const [imageError, setImageError] = useState('')
  const initialImageUrl = product?.imageUrl || ''
  const set = <K extends keyof EditableAdminProduct>(key: K, value: EditableAdminProduct[K]) => setDraft((current) => ({ ...current, [key]: value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave(draft, initialImageUrl && draft.imageUrl !== initialImageUrl ? initialImageUrl : undefined)
  }
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setImageBusy(true); setImageError('')
    try {
      validateProductImage(file)
      const nextImageUrl = await onUploadImage(file)
      const previousTemporaryImage = temporaryImageUrl
      set('imageUrl', nextImageUrl)
      setTemporaryImageUrl(nextImageUrl)
      if (previousTemporaryImage && previousTemporaryImage !== nextImageUrl) await onDeleteImage(previousTemporaryImage).catch(() => undefined)
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Impossible d’envoyer cette photo')
    } finally {
      setImageBusy(false)
    }
  }
  const removeImage = async () => {
    const imageToClean = temporaryImageUrl
    set('imageUrl', ''); setTemporaryImageUrl(''); setImageError('')
    if (!imageToClean) return
    setImageBusy(true)
    try { await onDeleteImage(imageToClean) }
    catch (error) { setImageError(error instanceof Error ? error.message : 'Impossible de supprimer cette photo') }
    finally { setImageBusy(false) }
  }
  const cancel = async () => {
    if (temporaryImageUrl) {
      setImageBusy(true)
      try { await onDeleteImage(temporaryImageUrl) } catch { /* Cleanup can be retried from Cloudinary. */ }
    }
    onClose()
  }

  return <div className="fixed inset-0 z-50 bg-black/35 p-0 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true">
    <form onSubmit={submit} className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-[24px]">
      <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7"><div><p className="eyebrow">Catalogue</p><h2 className="display mt-1 text-3xl font-semibold">{product ? 'Modifier le bijou' : 'Ajouter un bijou'}</h2></div><button type="button" onClick={cancel} disabled={imageBusy} className="grid h-11 w-11 place-items-center rounded-full border border-line disabled:opacity-50" aria-label="Fermer"><X size={18} /></button></header>
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
        </div></section>
        <section>
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Photo principale</p><p className="mt-1 text-xs text-[#7B7074]">Une photo lumineuse et verticale mettra mieux le bijou en valeur.</p></div>{draft.imageUrl && <button type="button" onClick={removeImage} disabled={imageBusy} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-red-200 px-4 text-[10px] font-bold uppercase tracking-wider text-red-700 disabled:opacity-50"><Trash2 size={14} />Retirer</button>}</div>
          <div className="relative overflow-hidden rounded-2xl border border-[#DDD4C9] bg-[#F7F4EF]">
            {draft.imageUrl ? <img src={draft.imageUrl} alt={temporaryImageUrl ? 'Aperçu de la nouvelle photo' : 'Aperçu de la photo'} className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]" /> : <div className="grid min-h-52 place-items-center px-6 py-10 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#C4943D] shadow-sm"><ImagePlus size={23} /></span><p className="display mt-4 text-xl font-semibold">Ajouter une belle photo</p><p className="mt-2 text-xs text-[#7B7074]">JPG, PNG, WebP, AVIF ou HEIC · 10 Mo maximum</p></div></div>}
            {imageBusy && <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-sm"><div className="text-center"><LoaderCircle className="mx-auto animate-spin text-[#C4943D]" size={28} /><p className="mt-3 text-[10px] font-bold uppercase tracking-[.16em]">Envoi de la photo…</p></div></div>}
          </div>
          <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#302A2E] px-5 text-[10px] font-bold uppercase tracking-[.14em] text-white transition hover:bg-[#463D42]">
            <ImagePlus size={15} />{draft.imageUrl ? 'Remplacer la photo' : 'Choisir une photo'}
            <input aria-label="Choisir une photo" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif" onChange={uploadImage} disabled={imageBusy || busy} className="sr-only" />
          </label>
          {imageError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{imageError}</p>}
        </section>
        <div className="flex flex-wrap gap-5"><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.active} onChange={(event) => set('active', event.target.checked)} />Publié dans la boutique</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.featured} onChange={(event) => set('featured', event.target.checked)} />Mettre en avant</label></div>
      </div>
      <footer className="flex justify-end gap-3 border-t border-line bg-[#FBF9F6] p-4 sm:px-7"><button type="button" onClick={cancel} disabled={imageBusy} className="button-secondary disabled:opacity-50">Annuler</button><button disabled={busy || imageBusy} className="button-primary button-accent disabled:opacity-60"><Save size={16} />{busy ? 'Enregistrement…' : 'Enregistrer'}</button></footer>
    </form>
  </div>
}
