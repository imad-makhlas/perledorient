import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Edit3, LayoutDashboard, LogOut, MapPin, MessageCircle, Package, Phone, Plus, Search, ShoppingBag, StickyNote, Trash2, UserRound, X } from 'lucide-react'
import { useLayoutEffect, useMemo, useState } from 'react'
import { AdminLogin } from '../components/admin/AdminLogin'
import { ProductEditor } from '../components/admin/ProductEditor'
import { deleteAdminImage, uploadAdminImage } from '../features/admin/admin-images'
import { changeAdminOrderStatus, deleteAdminOrder, fetchAdminOrders, getNextAdminActions, orderStatusLabel, orderStatusPalette, type AdminCredentials, type AdminOrder, type AdminOrderStatus } from '../features/admin/admin-orders'
import { createAdminProduct, deleteAdminProduct, fetchAdminProducts, updateAdminProduct, type AdminProduct, type EditableAdminProduct } from '../features/admin/admin-products'
import { generateProductSku } from '../features/admin/admin-product-record'
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

  useLayoutEffect(() => {
    if (credentials) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [credentials])

  const login = async (next: AdminCredentials) => {
    setBusy(true); setMessage('')
    try {
      const [nextProducts, nextOrders] = await Promise.all([fetchAdminProducts(next), fetchAdminOrders(next)])
      setCredentials(next); setProducts(nextProducts); setOrders(nextOrders)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Connexion impossible') }
    finally { setBusy(false) }
  }
  const visibleProducts = useMemo(() => products.filter((product) => `${product.nameAr} ${product.nameFr} ${product.sku}`.toLowerCase().includes(query.toLowerCase())), [products, query])
  const nextProductSku = useMemo(() => generateProductSku(products.map((product) => product.sku)), [products])
  const pendingOrders = orders.filter((order) => order.status === 'PENDING_CONFIRMATION').length

  const saveProduct = async (draft: EditableAdminProduct, removedImageUrls: string[] = []) => {
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
      await Promise.all(removedImageUrls.map((imageUrl) => deleteAdminImage(credentials, imageUrl).catch(() => undefined)))
      setEditing(null); setMessage('Bijou enregistrÃ© avec succÃ¨s.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Enregistrement impossible') }
    finally { setBusy(false) }
  }
  const removeProduct = async (product: AdminProduct) => {
    if (!credentials || !window.confirm(`Supprimer ${product.nameFr} ?`)) return
    setBusy(true)
    try {
      await deleteAdminProduct(credentials, product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      try { await Promise.all(product.imageUrls.map((imageUrl) => deleteAdminImage(credentials, imageUrl))); setMessage('Bijou et photos supprimÃ©s.') }
      catch { setMessage('Bijou supprimÃ©. La photo devra Ãªtre retirÃ©e depuis Cloudinary.') }
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Suppression impossible') }
    finally { setBusy(false) }
  }
  const updateOrder = async (order: AdminOrder, status: AdminOrderStatus) => {
    if (!credentials) return
    setBusy(true)
    try {
      const saved = await changeAdminOrderStatus(credentials, order.orderNumber, status)
      setOrders((current) => 'deleted' in saved ? current : current.map((item) => item.orderNumber === saved.orderNumber ? saved : item))
      if (status === 'CANCELLED' || status === 'RETURNED') setProducts(await fetchAdminProducts(credentials))
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Mise Ã  jour impossible') }
    finally { setBusy(false) }
  }
  const removeOrder = async (order: AdminOrder) => {
    const stockMessage = order.status === 'DELIVERED' ? 'Le stock ne sera pas modifiÃ©.' : 'Le stock rÃ©servÃ© sera restaurÃ©.'
    if (!credentials || !window.confirm(`Supprimer dÃ©finitivement la commande ${order.orderNumber} ?\n\n${stockMessage}`)) return
    setBusy(true)
    try {
      await deleteAdminOrder(credentials, order.orderNumber)
      setOrders((current) => current.filter((item) => item.orderNumber !== order.orderNumber))
      setMessage('Commande supprimÃ©e.')
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Suppression impossible') }
    finally { setBusy(false) }
  }

  if (!credentials) return <AdminLogin onLogin={login} message={message} busy={busy} />

  const navigation: Array<[AdminView, string, typeof LayoutDashboard]> = [['overview', 'Accueil', LayoutDashboard], ['catalogue', 'Catalogue', Package], ['orders', 'Commandes', ShoppingBag]]
  return <main className="min-h-screen bg-[#F7F4EF] text-[#302A2E]">
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#302A2E] text-white shadow-lg"><div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-7"><button onClick={() => window.location.assign('/')} className="grid h-10 w-10 place-items-center rounded-full border border-white/15"><ArrowLeft size={17} /></button><div><p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#C4943D]">Perle dâ€™Orient</p><p className="display text-xl font-semibold">Atelier</p></div><button onClick={() => { setCredentials(null); setProducts([]); setOrders([]) }} className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-wider"><LogOut size={14} />DÃ©connexion</button></div></header>
    <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-[#DDD4C9] bg-white p-2 lg:min-h-[calc(100vh-65px)] lg:border-b-0 lg:border-r lg:p-5"><nav className="grid grid-cols-3 gap-1 lg:flex lg:flex-col lg:gap-2">{navigation.map(([key, label, Icon]) => <button key={key} onClick={() => setView(key)} className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[9px] font-bold uppercase tracking-[.08em] transition lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-left lg:text-xs lg:tracking-wider ${view === key ? 'bg-[#302A2E] text-white' : 'text-[#6D6266] hover:bg-[#F7F4EF]'}`}><Icon size={17} className={view === key ? 'text-[#C4943D]' : ''} /><span className="truncate">{label}</span>{key === 'orders' && pendingOrders > 0 && <span className="absolute right-2 top-1 rounded-full bg-[#C4943D] px-1.5 py-0.5 text-[8px] text-[#302A2E] lg:static lg:ml-auto lg:px-2 lg:text-[9px]">{pendingOrders}</span>}</button>)}</nav></aside>
      <section className="min-w-0 p-4 sm:p-7 lg:p-10">
        {message && <div className="mb-6 flex items-center justify-between rounded-xl border border-[#DCC8A1] bg-white px-4 py-3 text-sm"><span>{message}</span><button onClick={() => setMessage('')}><X size={16} /></button></div>}
        {view === 'overview' && <Overview products={products} orders={orders} onAdd={() => { setEditing('new'); setView('catalogue') }} onOrders={() => setView('orders')} />}
        {view === 'catalogue' && <Catalogue products={visibleProducts} total={products.length} query={query} setQuery={setQuery} onAdd={() => setEditing('new')} onEdit={setEditing} onDelete={removeProduct} />}
        {view === 'orders' && <Orders orders={orders} busy={busy} onUpdate={updateOrder} onDelete={removeOrder} />}
      </section>
    </div>
    {editing && <ProductEditor product={editing === 'new' ? null : editing} suggestedSku={nextProductSku} onClose={() => setEditing(null)} onSave={saveProduct} onUploadImage={(file) => uploadAdminImage(credentials, file)} onDeleteImage={(imageUrl) => deleteAdminImage(credentials, imageUrl)} busy={busy} />}
  </main>
}

function Overview({ products, orders, onAdd, onOrders }: { products: AdminProduct[]; orders: AdminOrder[]; onAdd: () => void; onOrders: () => void }) {
  const pending = orders.filter((order) => order.status === 'PENDING_CONFIRMATION').length
  const stats: Array<[string, number, typeof Package]> = [['Bijoux publiÃ©s', products.filter((item) => item.active).length, Package], ['Ruptures de stock', products.filter((item) => item.stock === 0).length, Clock3], ['Commandes en attente', pending, ShoppingBag], ['Commandes totales', orders.length, CheckCircle2]]
  return <div><p className="eyebrow">Aujourdâ€™hui</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Vue dâ€™ensemble</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-[#DDD4C9] bg-white p-5 shadow-[0_12px_35px_rgba(48,42,46,.05)]"><Icon size={20} className="text-[#C4943D]" /><p className="mt-6 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs uppercase tracking-wider text-[#7B7074]">{label}</p></article>)}</div><div className="mt-7 grid gap-4 lg:grid-cols-2"><button onClick={onAdd} className="rounded-2xl bg-[#302A2E] p-6 text-left text-white"><Plus className="text-[#C4943D]" /><p className="display mt-5 text-2xl font-semibold">Ajouter un nouveau bijou</p><p className="mt-2 text-sm text-white/55">Publiez une piÃ¨ce en franÃ§ais et en anglais.</p></button><button onClick={onOrders} className="rounded-2xl border border-[#DDD4C9] bg-white p-6 text-left"><ShoppingBag className="text-[#C4943D]" /><p className="display mt-5 text-2xl font-semibold">Voir les commandes</p><p className="mt-2 text-sm text-[#7B7074]">Confirmez et suivez les demandes WhatsApp.</p></button></div></div>
}

function Catalogue({ products, total, query, setQuery, onAdd, onEdit, onDelete }: { products: AdminProduct[]; total: number; query: string; setQuery: (value: string) => void; onAdd: () => void; onEdit: (product: AdminProduct) => void; onDelete: (product: AdminProduct) => void }) {
  return <div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Gestion des piÃ¨ces</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Catalogue</h1><p className="mt-2 text-sm text-[#7B7074]">{total} bijoux enregistrÃ©s</p></div><button onClick={onAdd} className="button-primary button-accent"><Plus size={16} />Ajouter un bijou</button></div><label className="mt-7 flex min-h-12 items-center gap-3 rounded-xl border border-[#DDD4C9] bg-white px-4"><Search size={17} /><input className="w-full bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher par nom ou rÃ©fÃ©renceâ€¦" /></label><div className="mt-5 grid gap-4">{products.map((product) => <article key={product.id} className="grid gap-4 rounded-2xl border border-[#DDD4C9] bg-white p-4 shadow-[0_10px_30px_rgba(48,42,46,.04)] sm:grid-cols-[100px_1fr_auto] sm:items-center"><div className="aspect-square overflow-hidden rounded-xl bg-[#F2EEE8]">{product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="display truncate text-xl font-semibold">{product.nameFr}</h2><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${product.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{product.active ? 'PubliÃ©' : 'MasquÃ©'}</span></div><p className="mt-1 text-xs text-[#7B7074]">{product.nameAr} Â· {product.sku}</p><div className="mt-3 flex flex-wrap gap-4 text-sm"><strong>{formatMoney(product.price)}</strong><span>Stock : {product.stock}</span><span>{product.category}</span></div></div><div className="flex gap-2 sm:justify-end"><button onClick={() => onEdit(product)} className="grid h-11 w-11 place-items-center rounded-xl border border-[#DDD4C9]" aria-label="Modifier"><Edit3 size={16} /></button><button onClick={() => onDelete(product)} className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-700" aria-label="Supprimer"><Trash2 size={16} /></button></div></article>)}</div></div>
}

function Orders({ orders, busy, onUpdate, onDelete }: { orders: AdminOrder[]; busy: boolean; onUpdate: (order: AdminOrder, status: AdminOrderStatus) => void; onDelete: (order: AdminOrder) => void }) {
  return <div>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="eyebrow">Suivi WhatsApp</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Commandes</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#7B7074]">Consultez les coordonnÃ©es, vÃ©rifiez les piÃ¨ces et mettez Ã  jour chaque demande depuis un seul espace.</p></div>
      <div className="w-fit rounded-full border border-[#DDD4C9] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#6D6266]"><strong className="mr-2 text-sm text-[#302A2E]">{orders.length}</strong>{orders.length > 1 ? 'commandes' : 'commande'}</div>
    </div>
    <div className="mt-7 grid gap-5">
      {orders.length === 0 && <div className="rounded-3xl border border-[#DDD4C9] bg-white p-12 text-center text-sm text-[#7B7074] shadow-[0_12px_38px_rgba(48,42,46,.04)]">Aucune commande pour le moment.</div>}
      {orders.map((order) => <article key={order.orderNumber} className="overflow-hidden rounded-3xl border border-[#DDD4C9] bg-white shadow-[0_16px_45px_rgba(48,42,46,.055)]">
        <header className="border-b border-[#E7DED4] bg-[#FCFAF7] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="display break-all text-2xl font-semibold sm:text-[1.7rem]"><span className="mr-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#8A7E82]">Commande nÂ°</span>{order.orderNumber}</h2><span className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] ${orderStatusPalette(order.status).badge}`}>{orderStatusLabel(order.status, 'fr')}</span></div><p className="mt-2 flex items-center gap-2 text-xs text-[#7B7074]"><CalendarDays size={14} className="shrink-0 text-[#C4943D]" /><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</time></p></div>
            <div className="flex items-baseline justify-between gap-3 border-t border-[#E7DED4] pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8A7E82]">Total</span><strong className="block text-xl font-semibold text-[#302A2E] sm:mt-1">{formatMoney(Number(order.total), 'fr')}</strong></div>
          </div>
        </header>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(240px,.75fr)_minmax(0,1.25fr)] lg:gap-8">
          <section role="group" aria-label="CoordonnÃ©es client" className="min-w-0 rounded-2xl border border-[#E7DED4] bg-[#FCFAF7] p-4 sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#A06F22]">CoordonnÃ©es client</p>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex min-w-0 gap-3"><UserRound size={17} className="mt-0.5 shrink-0 text-[#C4943D]" /><div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-[#8A7E82]">Client</p><p className="mt-1 break-words font-semibold">{order.customerName}</p></div></div>
              <div className="flex min-w-0 gap-3"><Phone size={17} className="mt-0.5 shrink-0 text-[#C4943D]" /><div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-[#8A7E82]">TÃ©lÃ©phone</p><a href={`tel:${order.customerTelephone}`} className="mt-1 block break-all font-semibold hover:text-[#A06F22]">{order.customerTelephone}</a></div></div>
              <div className="flex min-w-0 gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-[#C4943D]" /><div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-[#8A7E82]">Livraison</p><p className="mt-1 break-words font-semibold">{order.city}</p>{order.address && <p className="mt-1 break-words leading-5 text-[#6D6266]">{order.address}</p>}</div></div>
              {order.notes && <div className="flex min-w-0 gap-3 border-t border-[#E7DED4] pt-4"><StickyNote size={17} className="mt-0.5 shrink-0 text-[#C4943D]" /><div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-[#8A7E82]">Note</p><p className="mt-1 break-words leading-5 text-[#6D6266]">{order.notes}</p></div></div>}
            </div>
          </section>

          <section role="group" aria-label="Articles de la commande" className="min-w-0">
            <div className="flex items-center justify-between gap-3"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#A06F22]">Articles de la commande</p><span className="text-xs text-[#7B7074]">{order.items.reduce((total, item) => total + item.quantity, 0)} piÃ¨ce(s)</span></div>
            <div className="mt-3 divide-y divide-[#E7DED4] rounded-2xl border border-[#E7DED4]">{order.items.map((item) => <div key={`${order.orderNumber}-${item.sku}`} className="grid min-w-0 gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="min-w-0"><p className="break-words text-sm font-semibold">{item.productName}</p><p className="mt-1 text-xs leading-5 text-[#7B7074]">{item.variantName} <span className="mx-1 text-[#C4943D]">Â·</span> QtÃ© {item.quantity}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[.08em] text-[#8A7E82]">RÃ©f. produit : {item.sku}</p></div><strong className="text-sm sm:text-right">{formatMoney(Number(item.lineTotal), 'fr')}</strong></div>)}</div>
          </section>
        </div>

        <div role="group" aria-label="Actions de la commande" className="flex flex-col gap-2 border-t border-[#E7DED4] bg-[#FCFAF7] px-5 py-4 sm:flex-row sm:flex-wrap sm:px-7">
          {order.whatsappUrl && <a href={order.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C4943D] px-5 text-[10px] font-bold uppercase tracking-[.12em] text-[#241F21] transition hover:bg-[#D2A852] sm:w-auto"><MessageCircle size={16} />Contacter sur WhatsApp</a>}
          {getNextAdminActions(order.status).map((status) => <button key={status} disabled={busy} onClick={() => onUpdate(order, status)} className={`inline-flex min-h-12 w-full items-center justify-center rounded-xl border px-5 text-[10px] font-bold uppercase tracking-[.12em] transition disabled:opacity-50 sm:w-auto ${orderStatusPalette(status).action}`}>{orderStatusLabel(status, 'fr')}</button>)}
          <button disabled={busy} onClick={() => onDelete(order)} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E3C2C2] bg-white px-5 text-[10px] font-bold uppercase tracking-[.12em] text-[#8A3D3D] transition hover:bg-[#FBF0F0] disabled:opacity-50 sm:ml-auto sm:w-auto"><Trash2 size={15} />Supprimer</button>
        </div>
      </article>)}
    </div>
  </div>
}

