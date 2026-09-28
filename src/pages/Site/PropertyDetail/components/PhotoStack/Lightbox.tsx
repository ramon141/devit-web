import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { SiteDict } from '@/lib/site/dict'
import type { SitePhoto } from '@/lib/site/types'
import PropertyImage from '@/pages/Site/components/PropertyImage'

type LightboxProps = {
  images: SitePhoto[]
  index: number
  seed: string
  title: string
  labels: SiteDict['gallery']
  onIndexChange: (index: number) => void
  onClose: () => void
}

const SWIPE_MIN = 40
const TAP_MAX_MOVE = 6
const TAP_MAX_TIME = 400

function photoSeed(seed: string, index: number) {
  return index === 0 ? seed : `${seed}-${index}`
}

// Carrossel em tela cheia: setas, teclado, arrastar ou tocar nas laterais
function Lightbox({ images, index, seed, title, labels, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; t: number } | null>(null)
  const total = images.length

  const step = useCallback(
    (delta: number) => onIndexChange((index + delta + total) % total),
    [index, total, onIndexChange]
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)

    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, step])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('.lightbox-close')?.focus()

    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // a miniatura da foto atual sempre visível na tira
  useEffect(() => {
    dialogRef.current
      ?.querySelector<HTMLElement>('.lightbox-thumb.is-current')
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [index])

  const onPointerDown = (event: ReactPointerEvent) => {
    drag.current = { x: event.clientX, t: Date.now() }
  }

  const onPointerUp = (event: ReactPointerEvent) => {
    const start = drag.current
    drag.current = null
    if (!start) return

    const dx = event.clientX - start.x

    if (Math.abs(dx) > SWIPE_MIN) {
      step(dx < 0 ? 1 : -1)

      return
    }

    if ((event.target as HTMLElement).closest('button')) return

    const isTap = Math.abs(dx) < TAP_MAX_MOVE && Date.now() - start.t < TAP_MAX_TIME
    const x = event.clientX / window.innerWidth

    if (isTap && x < 0.3) step(-1)
    else if (isTap && x > 0.7) step(1)
  }

  // portal dentro de .site-root: os tokens do site só valem ali
  const container = document.querySelector('.site-root') ?? document.body

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={labels.all}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <button type="button" className="lightbox-close" onClick={onClose} aria-label={labels.close}>
        ×
      </button>
      <p className="lightbox-caption">
        {labels.photo} {index + 1} {labels.of} {total}
      </p>
      <button
        type="button"
        className="lightbox-arrow lightbox-arrow--prev"
        onClick={() => step(-1)}
        aria-label={labels.prev}
      >
        ‹
      </button>
      <button
        type="button"
        className="lightbox-arrow lightbox-arrow--next"
        onClick={() => step(1)}
        aria-label={labels.next}
      >
        ›
      </button>

      <div className="lightbox-track" style={{ transform: `translateX(${-index * 100}%)` }}>
        {images.map((image, position) => (
          <figure
            key={position}
            className={`lightbox-slide${position === index ? ' is-current' : ''}`}
            aria-hidden={position !== index}
          >
            {Math.abs(position - index) <= 1 || position === 0 || position === total - 1 ? (
              <PropertyImage
                image={image}
                seed={photoSeed(seed, position)}
                alt={`${title} — ${position + 1}`}
                sizes="100vw"
                className="lightbox-img"
              />
            ) : null}
          </figure>
        ))}
      </div>

      <div className="lightbox-strip">
        {images.map((image, position) => (
          <button
            key={position}
            type="button"
            className={`lightbox-thumb${position === index ? ' is-current' : ''}`}
            onClick={() => onIndexChange(position)}
            aria-label={`${labels.photo} ${position + 1}`}
            aria-current={position === index ? 'true' : undefined}
          >
            <PropertyImage
              image={image}
              seed={photoSeed(seed, position)}
              alt=""
              sizes="80px"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>,
    container
  )
}

export default Lightbox
