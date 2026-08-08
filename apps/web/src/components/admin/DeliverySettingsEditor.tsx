import { MapPin, Save, Truck } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { deliveryZoneLabels, type DeliverySettings, type DeliveryZone } from '../../features/checkout/delivery-pricing'

type Props = { settings: DeliverySettings; busy: boolean; onSave: (settings: DeliverySettings) => void }

const zones: DeliveryZone[] = ['PICKUP_CITY', 'MAJOR_CITIES', 'NORTH_REGIONS', 'SOUTH_REGIONS']
const listToText = (items: string[]) => items.join(', ')
const textToList = (value: string) => value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean)

export function DeliverySettingsEditor({ settings, busy, onSave }: Props) {
  const [draft, setDraft] = useState(settings)
  const [majorCities, setMajorCities] = useState(listToText(settings.majorCities))
  const [southCities, setSouthCities] = useState(listToText(settings.southCities))

  useEffect(() => {
    setDraft(settings)
    setMajorCities(listToText(settings.majorCities))
    setSouthCities(listToText(settings.southCities))
  }, [settings])

  const numberField = (key: keyof Pick<DeliverySettings, 'freeThreshold' | 'pickupFee' | 'majorCityFee' | 'northRegionFee' | 'southRegionFee'>, label: string, suffix = 'MAD') => <label className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#62575B]">{label}<div className="mt-2 flex items-center rounded-xl border border-[#DDD4C9] bg-white focus-within:border-[#C4943D]"><input aria-label={label} min="0" type="number" className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base font-semibold outline-none" value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: Number(event.target.value) }))} /><span className="pr-4 text-[9px] font-bold tracking-wider text-[#8A7E82]">{suffix}</span></div></label>

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({ ...draft, majorCities: textToList(majorCities), southCities: textToList(southCities) })
  }

  return <form onSubmit={submit}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Expédition</p><h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">Livraison</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#7B7074]">Centralisez les tarifs Silver. Le client voit automatiquement le bon montant selon sa ville.</p></div><button disabled={busy} className="button-primary button-accent disabled:opacity-50"><Save size={16} />Enregistrer les tarifs</button></div>

    <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_.8fr]">
      <section className="rounded-3xl border border-[#DDD4C9] bg-white p-5 shadow-[0_14px_40px_rgba(48,42,46,.05)] sm:p-7">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#F5EBDD] text-[#A06F22]"><Truck size={19} /></span><div><h2 className="display text-2xl font-semibold">Tarifs Silver</h2><p className="text-xs text-[#7B7074]">Montants appliqués au panier</p></div></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#62575B]">Ville de ramassage<input aria-label="Ville de ramassage" className="field mt-2 normal-case tracking-normal" value={draft.pickupCity} onChange={(event) => setDraft((current) => ({ ...current, pickupCity: event.target.value }))} /></label>{numberField('freeThreshold', 'Livraison offerte dès')}{numberField('pickupFee', 'Tarif ville de ramassage')}{numberField('majorCityFee', 'Grandes villes')}{numberField('northRegionFee', 'Petites villes / Nord')}{numberField('southRegionFee', 'Régions Sud')}</div>
      </section>

      <aside className="rounded-3xl bg-[#302A2E] p-5 text-white shadow-[0_18px_45px_rgba(48,42,46,.12)] sm:p-7"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#D9AB57]">Règle client</p><h2 className="display mt-2 text-2xl font-semibold">Calcul simple et transparent</h2><ol className="mt-5 space-y-4 text-sm leading-6 text-white/65"><li><strong className="mr-2 text-[#D9AB57]">01</strong>Le client choisit Maroc ou International.</li><li><strong className="mr-2 text-[#D9AB57]">02</strong>La ville détermine automatiquement la zone.</li><li><strong className="mr-2 text-[#D9AB57]">03</strong>À partir de {draft.freeThreshold} MAD, la livraison au Maroc est offerte.</li><li><strong className="mr-2 text-[#D9AB57]">04</strong>L’international reste confirmé sur WhatsApp.</li></ol></aside>
    </div>

    <section className="mt-5 rounded-3xl border border-[#DDD4C9] bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><MapPin size={19} className="text-[#C4943D]" /><div><h2 className="display text-2xl font-semibold">Répartition des villes</h2><p className="text-xs text-[#7B7074]">Séparez les villes par une virgule.</p></div></div><div className="mt-6 grid gap-5 lg:grid-cols-2"><label className="text-[10px] font-bold uppercase tracking-[.12em]">Grandes villes<textarea className="field mt-2 min-h-32 resize-y normal-case leading-6 tracking-normal" value={majorCities} onChange={(event) => setMajorCities(event.target.value)} /></label><label className="text-[10px] font-bold uppercase tracking-[.12em]">Régions Sud<textarea className="field mt-2 min-h-32 resize-y normal-case leading-6 tracking-normal" value={southCities} onChange={(event) => setSouthCities(event.target.value)} /></label></div><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{zones.map((zone) => <label key={zone} className="flex items-center justify-between gap-3 rounded-xl border border-[#E7DED4] bg-[#FCFAF7] p-4 text-xs font-semibold"><span>{deliveryZoneLabels.fr[zone]}</span><input type="checkbox" checked={draft.activeZones[zone]} onChange={(event) => setDraft((current) => ({ ...current, activeZones: { ...current.activeZones, [zone]: event.target.checked } }))} /></label>)}</div></section>
  </form>
}
