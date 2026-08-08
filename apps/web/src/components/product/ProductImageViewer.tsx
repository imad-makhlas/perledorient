import { Expand, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ProductImageViewerProps = {
  src: string
  alt: string
  openLabel: string
  closeLabel: string
  dialogLabel: string
  enlargedAlt: string
  hint: string
}

export function ProductImageViewer({ src, alt, openLabel, closeLabel, dialogLabel, enlargedAlt, hint }: ProductImageViewerProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return <>
    <button type="button" aria-label={openLabel} onClick={() => setOpen(true)} className="group relative h-full w-full cursor-zoom-in overflow-hidden text-left">
      <img src={src} alt={alt} draggable={false} className="h-full w-full select-none object-cover transition duration-500 group-hover:scale-[1.015]" />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.12em] text-ink shadow-sm backdrop-blur-md sm:bottom-5 sm:right-5">
        <Expand size={14} />{hint}
      </span>
    </button>
    {open && createPortal(<div
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
      onMouseDown={() => setOpen(false)}
      className="fixed inset-0 z-[90] grid place-items-center bg-[#211C1E]/30 p-4 backdrop-blur-[1px] sm:p-8 lg:p-12"
    >
      <div onMouseDown={(event) => event.stopPropagation()} className="relative inline-flex max-h-[calc(100vh-2rem)] items-center justify-center overflow-hidden rounded-[22px] border border-white/50 bg-[#F8F5F0] p-2 shadow-[0_30px_90px_rgba(24,19,21,.32)] sm:max-h-[calc(100vh-4rem)] sm:rounded-[28px] sm:p-3">
        <img src={src} alt={enlargedAlt} className="block h-auto max-h-[calc(100vh-3rem)] w-auto max-w-[calc(100vw-3rem)] rounded-[16px] object-contain sm:max-h-[calc(100vh-5.5rem)] sm:max-w-[calc(100vw-5.5rem)] sm:rounded-[20px]" />
        <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-[#2F2A2C]/90 text-white shadow-lg backdrop-blur transition hover:bg-[#423A3E] sm:right-5 sm:top-5">
          <X size={18} />
        </button>
      </div>
    </div>, document.body)}
  </>
}
