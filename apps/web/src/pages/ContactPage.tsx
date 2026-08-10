import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '../config/contact'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../config/social-links'
import { useI18n } from '../i18n/i18n'

const contact = {
  ar: {
    eyebrow: 'تواصل شخصي',
    title: 'لنجد القطعة التي تشبهك.',
    body: 'للاستفسار عن المقاس أو الخامة أو الهدية أو التوفر، تواصلي معنا مباشرة. نجيب عن كل رسالة بعناية واهتمام.',
    panelEyebrow: 'مساعدة مباشرة',
    panelTitle: 'نحن هنا لمساعدتك.',
    panelBody: 'أرسلي لنا رسالة وسنساعدك على الاختيار بعناية.',
    whatsapp: 'اكتبي لنا عبر واتساب',
    instagram: 'تابعينا على إنستغرام',
  },
  fr: {
    eyebrow: 'Un échange personnel',
    title: 'Trouvons la pièce qui vous ressemble.',
    body: 'Pour une taille, une matière, un cadeau ou une disponibilité, échangez directement avec nous. Chaque message reçoit une réponse personnelle.',
    panelEyebrow: 'Conseil direct',
    panelTitle: 'Nous sommes là pour vous guider.',
    panelBody: 'Écrivez-nous et nous vous aiderons à choisir avec attention.',
    whatsapp: 'Écrire sur WhatsApp',
    instagram: 'Suivre sur Instagram',
  },
} as const

export function ContactPage() {
  const { locale } = useI18n()
  const copy = contact[locale]

  return <main className="bg-white">
    <section className="container-shell grid gap-8 py-9 sm:py-16 lg:grid-cols-[1fr_.9fr] lg:items-center lg:gap-20 lg:py-12">
      <article className="max-w-2xl lg:pl-8">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="display mt-4 text-[2.35rem] font-semibold leading-[1.02] sm:text-5xl lg:text-[3.5rem]">{copy.title}</h1>
        <div className="mt-7 h-px w-16 bg-accent" aria-hidden="true" />
        <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg sm:leading-9">{copy.body}</p>
      </article>

      <aside className="relative overflow-hidden rounded-[6px] bg-[#302A2E] p-6 text-ivory shadow-[0_24px_70px_rgba(64,16,31,.16)] sm:rounded-[6px] sm:p-10 lg:p-12">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-accent/30" aria-hidden="true" />
        <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full border border-accent/20" aria-hidden="true" />
        <p className="text-[9px] font-bold uppercase tracking-[.24em] text-champagne">{copy.panelEyebrow}</p>
        <h2 className="display mt-4 max-w-sm text-3xl font-semibold leading-tight sm:text-4xl">{copy.panelTitle}</h2>
        <p className="mt-5 max-w-md text-sm leading-7 text-white/60 sm:text-base">{copy.panelBody}</p>
        <div className="mt-8 flex flex-col gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="button-primary button-accent w-full justify-between"><span className="flex items-center gap-3"><MessageCircle size={17} />{copy.whatsapp}</span><ArrowUpRight size={16} /></a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between border border-white/20 px-5 text-[10px] font-bold uppercase tracking-[.16em] text-white transition-colors hover:border-accent hover:text-champagne"><span className="flex items-center gap-3"><Instagram size={17} />{copy.instagram}</span><span className="normal-case tracking-normal text-white/45">{INSTAGRAM_HANDLE}</span></a>
        </div>
      </aside>
    </section>
  </main>
}
