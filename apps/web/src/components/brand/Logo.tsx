import { Link } from 'react-router-dom'
import { getBrandLabel, getLogoToneClass, type LogoTone } from './brand'

type LogoProps = {
  tone?: LogoTone
  markOnly?: boolean
  compact?: boolean
  className?: string
}

export function Logo({ tone = 'dark', markOnly = false, compact = false, className = '' }: LogoProps) {
  const label = getBrandLabel(markOnly)
  const content = <span className={`inline-flex items-center ${compact ? 'gap-1.5 min-[341px]:gap-2' : 'gap-3'} ${getLogoToneClass(tone)} ${className}`}>
    <span className={`grid shrink-0 place-items-center ${compact ? 'h-8 w-8 min-[341px]:h-9 min-[341px]:w-9' : 'h-11 w-11'}`}>
      <svg viewBox="0 0 48 48" aria-hidden="true" className={compact ? 'h-8 w-8 min-[341px]:h-9 min-[341px]:w-9' : 'h-11 w-11'}>
        <path d="M5.5 21.5 24 5l18.5 16.5" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 19.5V42h29V19.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".56" />
        <path d="M15 42V27.5C15 18.9 19.5 13.4 24 10.4c4.5 3 9 8.5 9 17.1V42" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="24" cy="28" r="6" fill="#DEC69A" stroke="#B8893D" strokeWidth="1.4" />
        <circle cx="21.8" cy="25.8" r="1.45" fill="white" opacity=".78" />
        <path d="M17.5 39.5h13" stroke="#B8893D" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    </span>
    {!markOnly && <span className="min-w-0 leading-none">
      <span className={`display block whitespace-nowrap font-semibold tracking-[-.03em] ${compact ? 'text-[.9rem] min-[341px]:text-[1.075rem]' : 'text-[1.48rem]'}`}>Casa de <span className="text-accent">Perla</span></span>
      <span className={`block whitespace-nowrap font-bold uppercase text-current/45 ${compact ? 'mt-0.5 text-[5px] tracking-[.16em] min-[341px]:text-[6px] min-[341px]:tracking-[.22em]' : 'mt-1 text-[7px] tracking-[.32em]'}`}>Bijoux artisanaux</span>
    </span>}
  </span>

  return <Link to="/" aria-label={label}>{content}</Link>
}
