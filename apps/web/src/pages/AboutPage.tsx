import { useI18n } from '../i18n/i18n'

const story = {
  ar: {
    eyebrow: 'قصة Casa de Perla',
    title: 'مجوهرات تصوغها اليد وتحملها الحكاية.',
    body: 'وُلدت Casa de Perla من شغف بالتفاصيل الشرقية وجمال العمل الحرفي الهادئ. تُصمم كل قطعة في المغرب وتُنجز ضمن مجموعات محدودة لتصبح قريبة منك وفريدة.',
    signaturesLabel: 'بصمات حرفية',
    signatures: ['صنع يدوي', 'مجموعات محدودة', 'المغرب'],
  },
  fr: {
    eyebrow: "L'histoire de Casa de Perla",
    title: 'Des bijoux façonnés à la main, portés par une histoire.',
    body: "Casa de Perla est née d'un amour pour les détails orientaux et la beauté sincère du travail artisanal. Chaque pièce est imaginée au Maroc, façonnée en petite série et créée pour devenir personnelle.",
    signaturesLabel: 'Signatures artisanales',
    signatures: ['Fait main', 'Petites séries', 'Maroc'],
  },
} as const

const STORY_IMAGE = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=92'

export function AboutPage() {
  const { locale } = useI18n()
  const copy = story[locale]

  return <main className="bg-white">
    <section className="container-shell grid gap-8 py-9 sm:gap-10 sm:py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-20">
      <div className="relative order-2 mx-auto w-full max-w-[520px] lg:order-1 lg:mx-0">
        <div className="absolute -left-3 -top-3 h-full w-full border border-accent/55" aria-hidden="true" />
        <div className="relative aspect-[16/11] overflow-hidden bg-ivory sm:aspect-[4/5] sm:max-h-[560px]">
          <img src={STORY_IMAGE} alt="Bijoux artisanaux Casa de Perla" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy/25 via-transparent to-transparent" aria-hidden="true" />
        </div>
      </div>

      <article className="order-1 max-w-2xl lg:order-2 lg:pr-10">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="display mt-4 text-[2.35rem] font-semibold leading-[1.02] sm:text-5xl lg:text-[3.5rem]">{copy.title}</h1>
        <div className="mt-5 h-px w-16 bg-accent sm:mt-7" aria-hidden="true" />
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted sm:mt-7 sm:text-lg sm:leading-9">{copy.body}</p>
        <ul aria-label={copy.signaturesLabel} className="mt-7 grid grid-cols-3 border-y border-line py-4 sm:mt-9 sm:py-5">
          {copy.signatures.map((signature, index) => <li key={signature} className={`text-center text-[9px] font-bold uppercase tracking-[.18em] text-burgundy sm:text-[10px] ${index > 0 ? 'border-l border-line' : ''}`}>{signature}</li>)}
        </ul>
      </article>
    </section>
  </main>
}
