import { ArrowLeft, CheckCircle2, Clock3, Edit3, LayoutDashboard, LogOut, MessageCircle, Package, Plus, Search, ShoppingBag, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AdminLogin } from '../components/admin/AdminLogin'
import { ProductEditor } from '../components/admin/ProductEditor'
import { deleteAdminImage, uploadAdminImage } from '../features/admin/admin-images'
import { changeAdminOrderStatus, fetchAdminOrders, getNextAdminActions, orderStatusLabel, type AdminCredentials, type AdminOrder, type AdminOrderStatus } from '../features/admin/admin-orders'
import { createAdminProduct, deleteAdminProduct, fetchAdminProducts, updateAdminProduct, type AdminProduct, type EditableAdminProduct } from '../features/admin/admin-products'
import { formatMoney } from '../lib/format'

type AdminView = 'overview' | 'catalogue' | 'orders'

export function AdminDashboardPage() {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null)
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [view, setView] = useState<AdminView>('overview')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | 'new' | null>(null)

  const login = async (next: AdminCredentials) => {
    setBusy(true); setMessage('')
    try {
      const [nextProducts, nextOrders] = await Promise.all([fetchAdminProducts(next), fetchAdminOrders(next)])
      setCredentials(next); setProducts(nextProducts); setOrders(nextOrders)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Connexion impossible') }
    finally { setBusy(false) }
  }
  const visibleProducts = useMemo(() => products.filter((product) => `${product.nameEn} ${product.nameFr} ${product.sku}`.toLowerCase().includes(query.toLowerCase())), [products, query])
  const pendingOrders = orders.filter((order) => order.status === 'PENDING_CONFIRMATION').length

  const saveProduct = async (draft: EditableAdminProduct, replacedImageUrl?: string) => {
    if (!credentials) return
    setBusy(true); setMessage('')
    try {
      if (editing === 'new') {
        const created = await createAdminProduct(credentials, draft)
        setProducts((current) => [created, ...current])
      } else if (editing) {
        const saved = await updateAdminProduct(credentials, { ...editing, ...draft })
        setProducts((current) => current.map((item) => item.id === saved.id ? saved : item))
      }
      if (replacedImageUrl) await deleteAdminImage(credentials, replacedImageUrl).catch(() => undefined)
      setEditing(null); setMessage('Bijou enregistré avec succès.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Enregistrement impossible') }
    finally { setBusy(false) }
  }
  const removeProduct = async (product: AdminProduct) => {
    if (!credentials || !window.confirm(`Supprimer ${product.nameFr} ?`)) return
    setBusy(true)
    try {
      await deleteAdminProduct(credentials, product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      try { await deleteAdminImage(credentials, product.imageUrl); setMessage('Bijou et photo supprimés.') }
      catch { setMessage('Bijou supprimé. La photo devra être retirée depuis Cloudinary.') }
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Suppression impossible') }
    finally { setBusy(false) }
  }
  const updateOrder = async (order: AdminOrder, status: AdminOrderStatus) => {
    if (!credentials) return
    setBusy(true)
    try {
      const saved = await changeAdminOrderStatus(credentials, order.orderNumber, status)
      setOrders((current) => current.map((item) => item.orderNumber === saved.orderNumber ? saved : item))
      if (status === 'CANCELLED' || status === 'RETURNED') setProducts(await fetchAdminProducts(credentials))
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Mise à jour impossible') }
    finally { setBusy(false) }
  }

  if (!credentials) return <AdminLogin onLogin={login} message={message} busy={busy} />

  const navigation: Array<[AdminView, string, typeof LayoutDashboard]> = [['overview', 'Accueil', LayoutDashboard], ['catalogue', 'Catalogue', Package], ['orders', 'Commandes', ShoppingBag]]
  return <main className="min-h-screen bg-[#F7F4EF] text-[#302A2E]">
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#302A2E] text-white shadow-lg"><div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-7"><button onClick={() => window.location.assign('/')} className="grid h-10 w-10 place-items-center rounded-full border border-white/15"><ArrowLeft size={17} /></button><div><p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#C4943D]">Perle d’Orient</p><p className="display text-xl font-semibold">Atelier</p></div><button onClick={() => { setCredentials(null); setProducts([]); setOrders([]) }} className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-wider"><LogOut size={14} />Déconnexion</button></div></header>
    <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-[#DDD4C9] bg-white p-2 lg:min-h-[calc(100vh-65px)] lg:border-b-0 lg:border-r lg:p-5"><nav className="grid grid-cols-3 gap-1 lg:flex lg:flex-col lg:gap-2">{navigation.map(([key, label, Icon]) => <button key={key} onClick={() => setView(key)} className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[9px] font-bold uppercase tracking-[.08em] transition lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-left lg:text-xs lg:tracking-wider ${view === key ? 'bg-[#302A2E] text-white' : 'text-[#6D6266] hover:bg-[#F7F4EF]'}`}><Icon size={17} className={view === key ? 'text-[#C4943D]' : ''} /><span className="truncate">{label}</span>{key === 'orders' && pendingOrders > 0 && <span className="absolute right-2 top-1 rounded-full bg-[#C4943D] px-1.5 py-0.5 text-[8px] text-[#302A2E] lg:static lg:ml-auto lg:px-2 lg:text-[9px]">{pendingOrders}</span>}</button>)}</nav></aside>
      <section className="min-w-0 p-4 sm:p-7 lg:p-10">
        {message && <div className="mb-6 flex items-center justify-between rounded-xl border border-[#DCC8A1] bg-white px-4 py-3 text-sm"><span>{message}</span><button onClick={() => setMessage('')}><X size={16} /></button></div>}
        {view === 'overview' && <Overview products={products} orders={orders} onAdd={() => { setEditing('new'); setView('catalogue') }} onOrders={() => setView('orders')} />}
        {view === 'catalogue' && <Catalogue products={visibleProducts} total={products.length} query={query} setQuery={setQuery} onAdd={() => setEditing('new')} onEdit={setEditing} onDelete={removeProduct} />}
        {view === 'orders' && <Orders orders={orders} busy={busy} onUpdate={updateOrder} />}
      </section>
    </div>
    {editing && <ProductEditor product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveProduct} onUploadImage={(file) => uploadAdminImage(credentials, file)} onDeleteImage={(imageUrl) => deleteAdminImage(credentials, imageUrl)} busy={busy} />}
  </main>
}

function Overview({ products, orders, onAdd, onOrders }: { products: AdminProduct[]; orders: AdminOrder[]; onAdd: () => void; onOrders: () => void }) {
  const pending = orders.filter((order) => order.status === 'PENDING_CONFIRMATION').length
  const stats: Array<[string, number, typeof Package]> = [['Bijoux publiés', products.filter((item) => item.active).length, Package], ['Ruptures de stock', products.filter((item) => item.stock === 0).length, Clock3], ['Commandes en attente', pending, ShoppingBag], ['Commandes totales', orders.length, CheckCircle2]]
  return <div><p className="eyebrow">Aujourd’hui</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Vue d’ensemble</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-[#DDD4C9] bg-white p-5 shadow-[0_12px_35px_rgba(48,42,46,.05)]"><Icon size={20} className="text-[#C4943D]" /><p className="mt-6 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs uppercase tracking-wider text-[#7B7074]">{label}</p></article>)}</div><div className="mt-7 grid gap-4 lg:grid-cols-2"><button onClick={onAdd} className="rounded-2xl bg-[#302A2E] p-6 text-left text-white"><Plus className="text-[#C4943D]" /><p className="display mt-5 text-2xl font-semibold">Ajouter un nouveau bijou</p><p className="mt-2 text-sm text-white/55">Publiez une pièce en français et en anglais.</p></button><button onClick={onOrders} className="rounded-2xl border border-[#DDD4C9] bg-white p-6 text-left"><ShoppingBag className="text-[#C4943D]" /><p className="display mt-5 text-2xl font-semibold">Voir les commandes</p><p className="mt-2 text-sm text-[#7B7074]">Confirmez et suivez les demandes WhatsApp.</p></button></div></div>
}

function Catalogue({ products, total, query, setQuery, onAdd, onEdit, onDelete }: { products: AdminProduct[]; total: number; query: string; setQuery: (value: string) => void; onAdd: () => void; onEdit: (product: AdminProduct) => void; onDelete: (product: AdminProduct) => void }) {
  return <div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Gestion des pièces</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Catalogue</h1><p className="mt-2 text-sm text-[#7B7074]">{total} bijoux enregistrés</p></div><button onClick={onAdd} className="button-primary button-accent"><Plus size={16} />Ajouter un bijou</button></div><label className="mt-7 flex min-h-12 items-center gap-3 rounded-xl border border-[#DDD4C9] bg-white px-4"><Search size={17} /><input className="w-full bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher par nom ou référence…" /></label><div className="mt-5 grid gap-4">{products.map((product) => <article key={product.id} className="grid gap-4 rounded-2xl border border-[#DDD4C9] bg-white p-4 shadow-[0_10px_30px_rgba(48,42,46,.04)] sm:grid-cols-[100px_1fr_auto] sm:items-center"><div className="aspect-square overflow-hidden rounded-xl bg-[#F2EEE8]">{product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="display truncate text-xl font-semibold">{product.nameFr}</h2><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${product.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{product.active ? 'Publié' : 'Masqué'}</span></div><p className="mt-1 text-xs text-[#7B7074]">{product.nameEn} · {product.sku}</p><div className="mt-3 flex flex-wrap gap-4 text-sm"><strong>{formatMoney(product.price)}</strong><span>Stock : {product.stock}</span><span>{product.category}</span></div></div><div className="flex gap-2 sm:justify-end"><button onClick={() => onEdit(product)} className="grid h-11 w-11 place-items-center rounded-xl border border-[#DDD4C9]" aria-label="Modifier"><Edit3 size={16} /></button><button onClick={() => onDelete(product)} className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-700" aria-label="Supprimer"><Trash2 size={16} /></button></div></article>)}</div></div>
}

function Orders({ orders, busy, onUpdate }: { orders: AdminOrder[]; busy: boolean; onUpdate: (order: AdminOrder, status: AdminOrderStatus) => void }) {
  return <div><p className="eyebrow">Suivi WhatsApp</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Commandes</h1><p className="mt-2 text-sm text-[#7B7074]">Chaque demande est enregistrée avant l’ouverture de WhatsApp.</p><div className="mt-7 grid gap-4">{orders.length === 0 && <div className="rounded-2xl border border-[#DDD4C9] bg-white p-12 text-center text-sm text-[#7B7074]">Aucune commande pour le moment.</div>}{orders.map((order) => <article key={order.orderNumber} className="rounded-2xl border border-[#DDD4C9] bg-white p-5 shadow-[0_10px_30px_rgba(48,42,46,.04)]"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="display text-2xl font-semibold">{order.orderNumber}</h2><span className="rounded-full bg-[#F2EEE8] px-3 py-1 text-[9px] font-bold uppercase tracking-wider">{orderStatusLabel(order.status, 'fr')}</span></div><p className="mt-2 text-sm text-[#7B7074]">{order.customerName} · {order.customerTelephone} · {order.city}</p><p className="mt-1 text-sm text-[#7B7074]">{order.address}</p></div><strong className="text-lg">{formatMoney(Number(order.total))}</strong></div><div className="mt-5 divide-y divide-[#E7DED4] border-y border-[#E7DED4]">{order.items.map((item) => <div key={`${order.orderNumber}-${item.sku}`} className="flex justify-between gap-4 py-3 text-sm"><span>{item.productName} · {item.variantName} × {item.quantity}</span><strong>{formatMoney(Number(item.lineTotal))}</strong></div>)}</div><div className="mt-5 flex flex-wrap gap-2">{order.whatsappUrl && <a href={order.whatsappUrl} target="_blank" rel="noreferrer" className="button-primary button-accent"><MessageCircle size={16} />WhatsApp</a>}{getNextAdminActions(order.status).map((status) => <button key={status} disabled={busy} onClick={() => onUpdate(order, status)} className="button-secondary">{orderStatusLabel(status, 'fr')}</button>)}</div></article>)}</div></div>
}
