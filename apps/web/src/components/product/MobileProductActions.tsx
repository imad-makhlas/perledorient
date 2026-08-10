import { Check, MessageCircle, ShoppingBag } from 'lucide-react'
import { createPortal } from 'react-dom'

export type MobileProductActionsProps = {
  added: boolean
  disabled: boolean
  regionLabel: string
  addLabel: string
  orderLabel: string
  compactOrderLabel: string
  onAdd: () => void
  onOrder: () => void
}

export function MobileProductActions({
  added,
  disabled,
  regionLabel,
  addLabel,
  orderLabel,
  compactOrderLabel,
  onAdd,
  onOrder,
}: MobileProductActionsProps) {
  return createPortal(<div
    role="region"
    aria-label={regionLabel}
    className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] left-3 right-3 z-30 mx-auto flex min-h-[64px] max-w-[720px] items-center gap-2 rounded-[6px] border border-line bg-white/95 p-2 shadow-[0_-10px_30px_rgba(47,42,44,.12)] backdrop-blur-md md:hidden"
  >
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-[6px] border border-[#2F2A2C] bg-white text-[#2F2A2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={addLabel}
    >
      {added ? <Check size={17} aria-hidden="true" /> : <ShoppingBag size={17} aria-hidden="true" />}
    </button>
    <button
      type="button"
      onClick={onOrder}
      disabled={disabled}
      aria-label={orderLabel}
      className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[6px] bg-[#C4953D] px-4 text-[10px] font-bold uppercase tracking-[.09em] text-[#241F21] shadow-[0_8px_22px_rgba(196,149,61,.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-[#E8E1D9] disabled:text-[#8B7E80]"
    >
      <MessageCircle size={16} aria-hidden="true" />
      <span className="hidden min-[390px]:inline">{orderLabel}</span>
      <span className="min-[390px]:hidden">{compactOrderLabel}</span>
    </button>
  </div>, document.body)
}
