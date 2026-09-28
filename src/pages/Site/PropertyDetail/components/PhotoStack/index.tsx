import { useRef, useState, type CSSProperties } from 'react'
import type { SiteDict } from '@/lib/site/dict'
import type { SitePhoto } from '@/lib/site/types'
import Lightbox from '@/pages/Site/PropertyDetail/components/PhotoStack/Lightbox'
import { usePhotoFlip } from '@/pages/Site/PropertyDetail/components/PhotoStack/usePhotoFlip'
import PropertyImage from '@/pages/Site/components/PropertyImage'

type PhotoStackProps = {
  images: SitePhoto[]
  seed: string
  title: string
  labels: SiteDict['gallery']
}

type PileStyle = CSSProperties & { '--r': string; '--x': string; '--y': string; '--k': number }

const PILE = [
  { r: -6, x: 0, y: 0 },
  { r: 4, x: 26, y: 5 },
  { r: -3, x: 53, y: 1 },
  { r: 6, x: 4, y: 33 },
  { r: -5, x: 31, y: 37 },
  { r: 3, x: 56, y: 32 },
  { r: -7, x: 1, y: 65 },
  { r: 5, x: 29, y: 69 },
]
const PILE_MAX = 8
const DEFAULT_SLOT = { r: 0, x: 0, y: 0 }

function photoSeed(seed: string, index: number) {
  return index === 0 ? seed : `${seed}-${index}`
}

function pileStyle(position: number): PileStyle {
  const slot = PILE[position % PILE.length] ?? DEFAULT_SLOT

  return { '--r': `${slot.r}deg`, '--x': `${slot.x}%`, '--y': `${slot.y}%`, '--k': position }
}

/**
 * As fotos do imóvel como fotos impressas espalhadas sobre a mesa: uma grande
 * na frente e as outras numa pilha. Clicar numa da pilha a traz para a frente
 * (FLIP com GSAP); a etiqueta "Tutte le foto" abre o carrossel em tela cheia.
 */
function PhotoStack({ images, seed, title, labels }: PhotoStackProps) {
  const sorted = images
  const total = sorted.length
  const [main, setMain] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const remember = usePhotoFlip(rootRef, main)

  const pile = sorted.map((image, index) => ({ image, index })).filter(({ index }) => index !== main)
  const extra = Math.max(0, pile.length - PILE_MAX)

  const bring = (index: number, element: HTMLElement) => {
    if (index === main) return

    remember(element)
    setMain(index)
  }

  const show = (index: number) => {
    if (total === 0) return

    restoreRef.current = document.activeElement as HTMLElement | null
    setOpen(((index % total) + total) % total)
  }

  const close = () => {
    setOpen(null)
    restoreRef.current?.focus?.()
  }

  return (
    <div className="prints" ref={rootRef}>
      <button
        type="button"
        className="print print--main"
        onClick={() => show(main)}
        aria-label={`${labels.photo} ${main + 1} ${labels.of} ${total} — ${title}`}
      >
        <PropertyImage
          image={sorted[main]}
          seed={photoSeed(seed, main)}
          alt={`${title} — ${main + 1}`}
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="h-full w-full object-cover"
        />
        {total > 0 && (
          <span className="print-count" aria-hidden>
            {main + 1} / {total}
          </span>
        )}
      </button>

      {pile.length > 0 && (
        <div className="pile" role="list" aria-label={labels.all}>
          {pile.map(({ image, index }, position) => (
            <button
              key={index}
              type="button"
              role="listitem"
              data-index={index}
              hidden={position >= PILE_MAX}
              className="print print--small"
              style={pileStyle(position)}
              onClick={(event) => bring(index, event.currentTarget)}
              aria-label={`${labels.photo} ${index + 1} ${labels.of} ${total}`}
            >
              <PropertyImage
                image={image}
                seed={photoSeed(seed, index)}
                alt=""
                sizes="(max-width: 768px) 40vw, 18vw"
                className="h-full w-full object-cover"
              />
            </button>
          ))}

          <button type="button" className="print-tag" onClick={() => show(main)}>
            {labels.all} · {total}
            {extra > 0 ? ` (+${extra})` : ''}
          </button>
          <p className="print-hint">{labels.hint}</p>
        </div>
      )}

      {open !== null && (
        <Lightbox
          images={sorted}
          index={open}
          seed={seed}
          title={title}
          labels={labels}
          onIndexChange={setOpen}
          onClose={close}
        />
      )}
    </div>
  )
}

export default PhotoStack
