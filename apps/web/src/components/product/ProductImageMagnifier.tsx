import { ZoomIn, ZoomOut } from 'lucide-react'
import { useState, type MouseEvent, type TouchEvent } from 'react'

type ProductImageMagnifierProps = {
  src: string
  alt: string
  label: string
  hint?: string
}

export function ProductImageMagnifier({ src, alt, label, hint }: ProductImageMagnifierProps) {
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })

  const moveLens = (clientX: number, clientY: number, target: HTMLButtonElement) => {
    if (!active) return
    const bounds = target.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const x = Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100))
    const y = Math.min(100, Math.max(0, ((clientY - bounds.top) / bounds.height) * 100))
    setPosition({ x, y })
  }

  const moveLensWithMouse = (event: MouseEvent<HTMLButtonElement>) => moveLens(event.clientX, event.clientY, event.currentTarget)
  const moveLensWithTouch = (event: TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0]
    if (touch) moveLens(touch.clientX, touch.clientY, event.currentTarget)
  }

  return <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    onClick={() => setActive((current) => !current)}
    onMouseMove={moveLensWithMouse}
    onTouchMove={moveLensWithTouch}
    className={`group relative h-full w-full overflow-hidden text-left ${active ? 'cursor-crosshair touch-none' : 'cursor-zoom-in'}`}
  >
    <img src={src} alt={alt} draggable={false} className="h-full w-full select-none object-cover transition duration-500 group-hover:scale-[1.015]" />
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" aria-hidden="true" />
    {active && <span
      data-testid="product-image-lens"
      aria-hidden="true"
      className="pointer-events-none absolute z-10 h-28 w-28 rounded-full border-[3px] border-white bg-no-repeat shadow-[0_16px_45px_rgba(0,0,0,.3)] sm:h-40 sm:w-40"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        backgroundImage: `url(${JSON.stringify(src)})`,
        backgroundPosition: `${position.x}% ${position.y}%`,
        backgroundSize: '260%',
      }}
    />}
    <span className={`pointer-events-none absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/60 px-3 py-2 text-[9px] font-bold uppercase tracking-[.12em] shadow-sm backdrop-blur-md transition sm:bottom-5 sm:right-5 ${active ? 'bg-[#2F2A2C]/90 text-white' : 'bg-white/90 text-ink'}`}>
      {active ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
      {hint}
    </span>
  </button>
}
