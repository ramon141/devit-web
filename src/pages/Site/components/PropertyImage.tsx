import type { SitePhoto } from '@/lib/site/types'

/**
 * Imóvel sem foto: desenhamos um bloco vetorial com o arco da marca, em vez de
 * uma imagem quebrada. Com URL o componente renderiza <img>.
 */

const PALETTES = [
  ['#1b1712', '#0b0b0b'],
  ['#141a1c', '#0b0b0b'],
  ['#1c1712', '#100d0a'],
  ['#12161b', '#0b0b0b'],
  ['#1a1410', '#0b0b0b'],
]

function hash(text: string) {
  let value = 0

  for (let index = 0; index < text.length; index++) {
    value = (Math.imul(31, value) + text.charCodeAt(index)) | 0
  }

  return Math.abs(value)
}

type PropertyImageProps = {
  image?: SitePhoto
  seed: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

function PropertyImage({ image, seed, alt, className = '', priority = false, sizes }: PropertyImageProps) {
  const isPlaceholder = !image?.url

  if (!isPlaceholder) {
    return (
      <img
        src={image.url}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={className}
      />
    )
  }

  const seedHash = hash(seed)
  const [from = '#1b1712', to = '#0b0b0b'] = PALETTES[seedHash % PALETTES.length] ?? []
  const shift = (seedHash % 7) * 12 - 36

  return (
    <svg
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
      className={className}
    >
      <defs>
        <linearGradient id={`g-${seedHash}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#g-${seedHash})`} />
      <g
        fill="none"
        stroke="#FFCC00"
        strokeWidth="1.5"
        opacity="0.22"
        strokeLinecap="round"
        transform={`translate(${shift} 0)`}
      >
        <path d="M210 330 V190 Q210 130 300 130 Q390 130 390 190 V330" />
        <path d="M240 330 V196 Q240 158 300 158 Q360 158 360 196 V330" />
        <line x1="300" y1="134" x2="300" y2="330" />
      </g>
    </svg>
  )
}

export default PropertyImage
