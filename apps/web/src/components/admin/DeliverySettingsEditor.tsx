import { Save, Truck } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import type { DeliverySettings } from '../../features/checkout/delivery-pricing'

type Props = { settings: DeliverySettings; busy: boolean; onSave: (settings: DeliverySettings) => void }

export function DeliverySettingsEditor({ settings, busy, onSave }: Props) {
  const [draft, setDraft] = useState(settings)

  useEffect(() => {
    setDraft(settings)
  }, [settings])

  const numberField = (key: keyof Pick<DeliverySettings, 'freeThreshold' | 'pickupFee' | 'majorCityFee' | 'northRegionFee' | 'southRegionFee'>, label: string, suffix = 'MAD') => <label className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#62575B]">{label}<div className="mt-2 flex items-center rounded-xl border border-[#DDD4C9] bg-white focus-within:border-[#C4943D]"><input aria-label={label} min="0" type="number" className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base font-semibold outline-none" value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: Number(event.target.value) }))} /><span className="pr-4 text-[9px] font-bold tracking-wider text-[#8A7E82]">{suffix}</span></div></label>

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave(draft)
  }

  return <form onSubmit={submit}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Expédition</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Livraison</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#7B7074]">Centralisez les tarifs Silver. Le client voit automatiquement le bon montant selon sa ville.</p></div><button disabled={busy} className="button-primary button-accent disabled:opacity-50"><Save size={16} />Enregistrer les tarifs</button></div>

    <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_.8fr]">
      <section className="rounded-3xl border border-[#DDD4C9] bg-white p-5 shadow-[0_14px_40px_rgba(48,42,46,.05)] sm:p-7">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#F5EBDD] text-[#A06F22]"><Truck size={19} /></span><div><h2 className="display text-2xl font-semibold">Tarifs Silver</h2><p className="text-xs text-[#7B7074]">Montants appliqués au panier</p></div></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#62575B]">Ville de ramassage<input aria-label="Ville de ramassage" className="field mt-2 normal-case tracking-normal" value={draft.pickupCity} onChange={(event) => setDraft((current) => ({ ...current, pickupCity: event.target.value }))} /></label>{numberField('freeThreshold', 'Livraison offerte dès')}{numberField('pickupFee', 'Tarif ville de ramassage')}{numberField('majorCityFee', 'Grandes villes')}{numberField('northRegionFee', 'Régions Nord')}{numberField('southRegionFee', 'Régions Sud')}</div>
      </section>

      <aside className="overflow-hidden rounded-3xl bg-[#302A2E] text-white shadow-[0_18px_45px_rgba(48,42,46,.12)]">
        <div className="border-b border-white/10 p-5 sm:p-7"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#D9AB57]">Tarification retenue</p><h2 className="display mt-2 text-2xl font-semibold">Une grille simple pour le client</h2><p className="mt-2 text-sm leading-6 text-white/60">Les montants ci-dessous sont automatiquement ajoutés au panier.</p></div>
        <div className="divide-y divide-white/10 px-5 sm:px-7">
          {[['Ville de ramassage', draft.pickupFee], ['Grandes villes', draft.majorCityFee], ['Régions Nord', draft.northRegionFee], ['Régions Sud', draft.southRegionFee]].map(([label, fee], index) => <div key={String(label)} className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><span className="text-[10px] font-bold text-[#D9AB57]">0{index + 1}</span><span className="text-sm text-white/75">{label}</span></div><strong className="text-base">{fee} MAD</strong></div>)}
        </div>
        <div className="m-5 rounded-2xl border border-[#D9AB57]/25 bg-[#D9AB57]/10 p-4 text-sm leading-6 text-white/70 sm:m-7">Livraison offerte au Maroc dès <strong className="text-white">{draft.freeThreshold} MAD</strong>. L’international est confirmé sur WhatsApp.</div>
      </aside>
    </div>
  </form>
}
