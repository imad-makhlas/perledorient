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
  const content = <span className={`inline-flex items-center ${compact ? 'gap-2' : 'gap-3'} ${getLogoToneClass(tone)} ${className}`}>
    <span className={`grid place-items-center ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}>
      <svg viewBox="0 0 48 48" aria-hidden="true" className={compact ? 'h-9 w-9' : 'h-11 w-11'}>
        <path d="M8 42V22C8 14 14.2 8.5 24 4c9.8 4.5 16 10 16 18v20" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 42V23.5C14 18 18 13.8 24 10.5c6 3.3 10 7.5 10 13V42" fill="none" stroke="currentColor" strokeWidth="1" opacity=".42" />
        <circle cx="24" cy="27" r="6.2" fill="#DEC69A" stroke="#B8893D" strokeWidth="1.4" />
        <circle cx="21.8" cy="24.7" r="1.5" fill="white" opacity=".72" />
        <path d="M17 39h14" stroke="#B8893D" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
    {!markOnly && <span className="leading-none">
      <span className={`display block font-semibold tracking-[-.025em] ${compact ? 'text-[1.125rem]' : 'text-[1.55rem]'}`}>Perle d'<span className="text-accent">Orient</span></span>
      <span className={`block font-bold uppercase text-current/45 ${compact ? 'mt-0.5 text-[6px] tracking-[.22em]' : 'mt-1 text-[7px] tracking-[.32em]'}`}>Bijoux artisanaux</span>
    </span>}
  </span>

  return <Link to="/" aria-label={label}>{content}</Link>
}
