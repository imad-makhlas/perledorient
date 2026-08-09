import { MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '../config/contact'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/i18n'

type LocalizedContent = Record<'fr' | 'ar', Record<string, readonly [string, string]>>

const content: LocalizedContent = {
  fr: {
    '/delivery': ['Livraison au Maroc et à l’international', 'Chaque commande est confirmée personnellement sur WhatsApp. La livraison coûte 30 MAD à Casablanca et 45 MAD dans les autres villes du Maroc. Elle est offerte au Maroc dès 500 MAD. Pour l’international, les frais et délais sont confirmés selon la destination.'],
    '/returns': ['Entretien et retours', 'Si une pièce non portée ne vous convient pas, contactez-nous sur WhatsApp dans les 7 jours suivant sa réception. Les créations personnalisées sont étudiées individuellement.'],
    '/tracking': ['Suivre votre commande', 'Envoyez votre référence PDO et votre numéro de téléphone sur WhatsApp pour recevoir une mise à jour personnalisée de la livraison.'],
  },
  ar: {
    '/delivery': ['التوصيل داخل المغرب ودولياً', 'يتم تأكيد كل طلب شخصياً عبر واتساب. تبلغ تكلفة التوصيل 30 درهماً في الدار البيضاء و45 درهماً في باقي مدن المغرب، ويصبح مجانياً داخل المغرب ابتداءً من 500 درهم. أما التوصيل الدولي فتُحدد تكلفته ومدته حسب الوجهة.'],
    '/returns': ['العناية والإرجاع', 'إذا لم تناسبك قطعة غير مستعملة، تواصلي معنا عبر واتساب خلال 7 أيام من الاستلام. تتم دراسة القطع المخصصة بشكل فردي.'],
    '/tracking': ['تتبع طلبك', 'أرسلي مرجع PDO ورقم الهاتف عبر واتساب للحصول على تحديث شخصي حول التوصيل.'],
  },
}

export function BrandContentPage() {
  const { pathname } = useLocation()
  const { locale } = useI18n()
  const localizedContent = content[locale]
  const [title, body] = localizedContent[pathname] ?? ['Casa de Perla', locale === 'fr' ? "Bijoux artisanaux inspirés d’un souffle oriental." : 'مجوهرات حرفية مستوحاة من نفحة شرقية.']
  return <main className="container-shell grid min-h-[58vh] place-items-center py-20"><article className="max-w-2xl text-center"><p className="eyebrow">{locale === 'fr' ? "L’atelier" : 'المشغل'}</p><h1 className="display mt-4 text-5xl font-semibold sm:text-6xl">{title}</h1><p className="mt-6 text-base leading-8 text-muted">{body}</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="button-primary button-accent mt-8"><MessageCircle size={16} />{locale === 'fr' ? 'Écrire sur WhatsApp' : 'اكتبي لنا عبر واتساب'}</a></article></main>
}
