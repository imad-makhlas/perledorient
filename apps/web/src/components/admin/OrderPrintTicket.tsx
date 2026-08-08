import { Printer, X } from 'lucide-react'
import type { AdminOrder } from '../../features/admin/admin-orders'
import { formatMoney } from '../../lib/format'

type OrderPrintTicketProps = { order: AdminOrder; onClose: () => void }

const paymentLabels: Record<AdminOrder['paymentMethod'], string> = {
  CASH_ON_DELIVERY: 'Paiement à la livraison',
  WHATSAPP: 'Confirmation via WhatsApp',
  ONLINE_PAYMENT: 'Paiement en ligne',
}

export function OrderPrintTicket({ order, onClose }: OrderPrintTicketProps) {
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0)
  const createdAt = new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

  return <div className="order-print-overlay fixed inset-0 z-50 overflow-y-auto bg-[#211D1F]/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`Ticket de la commande ${order.orderNumber}`}>
    <div className="order-print-controls mx-auto mb-3 flex w-full max-w-[105mm] items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-xl">
      <button type="button" onClick={onClose} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#DDD4C9] px-4 text-[10px] font-bold uppercase tracking-[.1em]" aria-label="Fermer le ticket"><X size={15} />Fermer</button>
      <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C4943D] px-4 text-[10px] font-bold uppercase tracking-[.1em] text-[#241F21]" aria-label="Imprimer maintenant"><Printer size={15} />Imprimer</button>
    </div>
    <article className="order-print-ticket mx-auto flex min-h-[148mm] w-full max-w-[105mm] flex-col bg-white p-[9mm] text-[#241F21] shadow-2xl">
      <header className="flex items-start justify-between gap-5 border-b-2 border-[#241F21] pb-4">
        <div><p className="text-[18px] font-bold leading-none">Perle d'<span className="text-[#A87524]">Orient</span></p><p className="mt-1 text-[7px] font-bold uppercase tracking-[.24em] text-[#756B6F]">Bijoux artisanaux</p></div>
        <div className="text-right"><h1 className="text-[8px] font-bold uppercase tracking-[.18em] text-[#A87524]">Bon de préparation</h1><p className="mt-1 text-[10px] font-bold">{order.orderNumber}</p><p className="mt-1 text-[8px] text-[#756B6F]">{createdAt}</p></div>
      </header>
      <section className="grid grid-cols-2 gap-4 border-b border-[#D8D0C8] py-4 text-[9px] leading-4">
        <div><p className="ticket-label">Destinataire</p><p className="mt-1 font-bold">{order.customerName}</p><p>{order.customerTelephone}</p></div>
        <div><p className="ticket-label">Livraison</p><p className="mt-1 font-bold">{order.city}</p>{order.address && <p>{order.address}</p>}</div>
      </section>
      <section className="flex-1 py-4">
        <div className="flex items-center justify-between"><p className="ticket-label">Contenu du colis</p><span className="text-[8px] text-[#756B6F]">{itemCount} pièce{itemCount > 1 ? 's' : ''}</span></div>
        <div className="mt-2 divide-y divide-[#E5DED7] border-y border-[#D8D0C8]">
          {order.items.map((item) => <div key={`${order.orderNumber}-${item.sku}`} className="grid grid-cols-[1fr_auto] gap-3 py-3 text-[9px]"><div><p className="font-bold">{item.productName}</p><p className="mt-0.5 text-[#756B6F]">{item.variantName} · Qté {item.quantity}</p><p className="mt-1 font-mono text-[8px] font-bold tracking-[.04em]">{item.sku}</p></div><strong>{formatMoney(Number(item.lineTotal), 'fr')}</strong></div>)}
        </div>
        {order.notes && <div className="mt-4 rounded-lg border border-[#D8D0C8] bg-[#FAF8F5] p-3 text-[9px]"><p className="ticket-label">Note client</p><p className="mt-1 leading-4">{order.notes}</p></div>}
      </section>
      <footer className="border-t-2 border-[#241F21] pt-4 text-[9px]"><div className="flex items-end justify-between gap-4"><div><p className="ticket-label">Règlement</p><p className="mt-1 font-semibold">{paymentLabels[order.paymentMethod]}</p></div><div className="text-right"><p className="ticket-label">Total</p><p className="mt-1 text-[16px] font-bold">{formatMoney(Number(order.total), 'fr')}</p></div></div><p className="mt-5 text-center text-[8px] text-[#756B6F]">Merci pour votre confiance.</p></footer>
    </article>
  </div>
}
