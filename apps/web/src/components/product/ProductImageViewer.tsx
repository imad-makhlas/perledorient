import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type ProductImageViewerProps = {
  images: string[]
  alt: string
  openLabel: string
  closeLabel: string
  dialogLabel: string
  enlargedAlt: string
  hint: string
  previousLabel?: string
  nextLabel?: string
  thumbnailLabel?: string
  zoomPreviousLabel?: string
  zoomNextLabel?: string
}

export function ProductImageViewer({ images, alt, openLabel, closeLabel, dialogLabel, enlargedAlt, hint, previousLabel = 'Image précédente', nextLabel = 'Image suivante', thumbnailLabel = 'Afficher la photo', zoomPreviousLabel, zoomNextLabel }: ProductImageViewerProps) {
  const galleryImages = useMemo(() => [...new Set(images.filter(Boolean))], [images])
  const [activeIndex, setActiveIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const count = galleryImages.length

  useEffect(() => { setActiveIndex(0) }, [galleryImages])
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key === 'ArrowLeft') setActiveIndex((current) => (current - 1 + count) % count)
      if (event.key === 'ArrowRight') setActiveIndex((current) => (current + 1) % count)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, count])

  const show = (index: number) => {
    const nextIndex = (index + count) % count
    setActiveIndex(nextIndex)
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollTo?.({ left: scroller.clientWidth * nextIndex, behavior: 'smooth' })
  }
  const syncScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller?.clientWidth) return
    setActiveIndex(Math.min(count - 1, Math.max(0, Math.round(scroller.scrollLeft / scroller.clientWidth))))
  }
  if (!count) return null

  return <>
    <div className="space-y-3">
      <div className="group relative aspect-square overflow-hidden rounded-[6px] border border-line bg-[#F5F2ED] shadow-[0_20px_60px_rgba(47,42,44,.08)] sm:aspect-[5/4]">
        <div ref={scrollerRef} role="region" aria-label={`Galerie photo : ${alt}`} onScroll={syncScroll} className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {galleryImages.map((src, index) => <button key={src} type="button" aria-label={index === 0 ? openLabel : `${openLabel} ${index + 1}`} onClick={() => { setActiveIndex(index); setOpen(true) }} className="relative h-full w-full shrink-0 snap-center cursor-zoom-in overflow-hidden text-left">
            <img src={src} alt={index === 0 ? alt : `${alt} — ${index + 1}`} draggable={false} className="h-full w-full select-none object-cover" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" aria-hidden="true" />
          </button>)}
        </div>
        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-white/60 bg-white/90 px-2.5 py-1.5 text-[9px] font-bold text-ink shadow-sm backdrop-blur-md">{activeIndex + 1} / {count}</span>
        <span className="pointer-events-none absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.12em] text-ink shadow-sm backdrop-blur-md sm:bottom-5 sm:right-5"><Expand size={14} />{hint}</span>
        {count > 1 && <><button type="button" onClick={() => show(activeIndex - 1)} aria-label={previousLabel} className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/90 text-ink shadow-sm backdrop-blur-md"><ChevronLeft size={18} /></button><button type="button" onClick={() => show(activeIndex + 1)} aria-label={nextLabel} className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/90 text-ink shadow-sm backdrop-blur-md"><ChevronRight size={18} /></button></>}
      </div>
      {count > 1 && <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{galleryImages.map((src, index) => <button key={src} type="button" onClick={() => show(index)} aria-label={`${thumbnailLabel} ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} className={`h-16 w-16 shrink-0 overflow-hidden rounded-[6px] border-2 bg-[#F5F2ED] p-0.5 ${index === activeIndex ? 'border-accent' : 'border-transparent opacity-65'}`}><img src={src} alt="" className="h-full w-full rounded-[4px] object-cover" /></button>)}</div>}
    </div>
    {open && createPortal(<div role="dialog" aria-modal="true" aria-label={dialogLabel} onMouseDown={() => setOpen(false)} className="fixed inset-0 z-[90] flex items-center justify-center bg-[#211C1E]/95 p-3 backdrop-blur-md sm:p-8">
      <div onMouseDown={(event) => event.stopPropagation()} className="relative flex h-full w-full items-center justify-center">
        <img src={galleryImages[activeIndex]} alt={enlargedAlt} className="max-h-[calc(100vh-5rem)] max-w-[calc(100vw-2rem)] rounded-[6px] object-contain shadow-[0_30px_100px_rgba(0,0,0,.42)] sm:max-w-[calc(100vw-8rem)]" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur sm:left-6 sm:top-6">{activeIndex + 1} / {count}</span>
        <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:right-6 sm:top-6"><X size={19} /></button>
        {count > 1 && <><button type="button" onClick={() => setActiveIndex((current) => (current - 1 + count) % count)} aria-label={zoomPreviousLabel ?? previousLabel} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:left-6"><ChevronLeft size={22} /></button><button type="button" onClick={() => setActiveIndex((current) => (current + 1) % count)} aria-label={zoomNextLabel ?? nextLabel} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:right-6"><ChevronRight size={22} /></button></>}
      </div>
    </div>, document.body)}
  </>
}
