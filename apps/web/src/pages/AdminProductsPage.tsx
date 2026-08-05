import { Image, LogIn, Package, Save } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type AdminCredentials } from '../features/admin/admin-orders'
import { fetchAdminProducts, updateAdminProduct, type AdminProduct } from '../features/admin/admin-products'
import { formatMoney } from '../lib/format'

const credentialsKey = 'perle-d-orient-owner-credentials'

export function AdminProductsPage() {
  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    try { return JSON.parse(localStorage.getItem(credentialsKey) || '{"email":"atelier@perledorient.com","password":""}') as AdminCredentials } catch { return { email: 'atelier@perledorient.com', password: '' } }
  })
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const load = async () => {
    setMessage('')
    try {
      const data = await fetchAdminProducts(credentials)
      localStorage.setItem(credentialsKey, JSON.stringify(credentials))
      setProducts(data)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to sign in') }
  }
  const edit = (id: string, key: keyof AdminProduct, value: string | number | boolean) => setProducts((current) => current.map((product) => product.id === id ? { ...product, [key]: value } : product))
  const save = async (product: AdminProduct) => {
    setBusy(product.id); setMessage('')
    try { const saved = await updateAdminProduct(credentials, product); setProducts((current) => current.map((item) => item.id === saved.id ? saved : item)); setMessage(`${saved.productName} saved.`) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save') }
    finally { setBusy(null) }
  }

  return <main className="container-shell py-12 lg:py-16">
    <div className="flex flex-col gap-5 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">Perle d'Orient Atelier</p><h1 className="display mt-2 text-5xl font-semibold">Jewelry catalogue</h1><p className="mt-3 text-sm text-muted">Update photos, prices, stock and availability from your single owner account.</p></div><Link to="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-burgundy">View WhatsApp orders</Link></div>
    <section className="mt-8 grid gap-3 border border-line bg-white p-5 sm:grid-cols-[1fr_1fr_auto]"><input className="field" type="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} placeholder="Owner email" /><input className="field" type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="Password" /><button onClick={load} className="button-primary"><LogIn size={16} />Open atelier</button></section>
    {message && <p className="mt-5 border border-champagne bg-white px-4 py-3 text-sm text-burgundy">{message}</p>}
    {!products.length ? <div className="mt-14 grid place-items-center py-16 text-center text-muted"><Package size={34} strokeWidth={1.2} /><p className="mt-4 text-sm">Sign in to manage your pieces.</p></div> : <div className="mt-8 grid gap-6">{products.map((product) => <article key={product.id} className="grid gap-6 border border-line bg-white p-5 shadow-soft lg:grid-cols-[170px_1fr_auto]">
      <div className="aspect-square overflow-hidden bg-canvas">{product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-muted"><Image size={28} /></div>}</div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-bold uppercase tracking-widest">Piece name<input className="field mt-2 normal-case tracking-normal" value={product.productName} onChange={(event) => edit(product.id, 'productName', event.target.value)} /></label><label className="text-[10px] font-bold uppercase tracking-widest">Finish<input className="field mt-2 normal-case tracking-normal" value={product.variantName} onChange={(event) => edit(product.id, 'variantName', event.target.value)} /></label><label className="text-[10px] font-bold uppercase tracking-widest">Price (MAD)<input className="field mt-2 normal-case tracking-normal" type="number" min="0" value={product.price} onChange={(event) => edit(product.id, 'price', Number(event.target.value))} /></label><label className="text-[10px] font-bold uppercase tracking-widest">Stock<input className="field mt-2 normal-case tracking-normal" type="number" min="0" value={product.stock} onChange={(event) => edit(product.id, 'stock', Number(event.target.value))} /></label><label className="text-[10px] font-bold uppercase tracking-widest sm:col-span-2">Photo URL<input className="field mt-2 normal-case tracking-normal" value={product.imageUrl ?? ''} onChange={(event) => edit(product.id, 'imageUrl', event.target.value)} placeholder="Paste your product image URL" /></label><label className="flex items-center gap-3 text-xs font-semibold sm:col-span-2"><input type="checkbox" checked={product.active} onChange={(event) => edit(product.id, 'active', event.target.checked)} />Available in the shop</label></div>
      <div className="flex flex-row items-center justify-between gap-4 lg:flex-col lg:items-end"><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-widest text-muted">{product.sku}</p><p className="mt-2 text-sm font-semibold">{formatMoney(product.price)}</p></div><button onClick={() => save(product)} disabled={busy === product.id} className="button-primary button-accent disabled:opacity-50"><Save size={15} />{busy === product.id ? 'Saving...' : 'Save piece'}</button></div>
    </article>)}</div>}
  </main>
}
