import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type Tone = 'light' | 'cream' | 'dark'
type Side = 'left' | 'right'

type RoomProps<T extends ElementType> = {
  as?: T
  tone?: Tone
  decor?: Side
  className?: string
  inner?: boolean
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

const WALLS: Record<Tone, string> = {
  light: '',
  cream: 'bg-site-cream',
  dark: 'bg-site-ink text-site-cream',
}

// O arco de Devit (o mesmo motivo dos placeholders), como quadro na parede
function ArchDecor({ side, dark }: { side: Side; dark: boolean }) {
  return (
    <svg
      className={`arch-decor arch-decor--${side}`}
      viewBox="0 0 400 520"
      aria-hidden
      fill="none"
      stroke={dark ? '#FFCC00' : '#0B0B0B'}
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M60 500 V200 Q60 60 200 60 Q340 60 340 200 V500" />
      <path d="M110 500 V214 Q110 120 200 120 Q290 120 290 214 V500" />
      <line x1="200" y1="64" x2="200" y2="500" />
    </svg>
  )
}

/**
 * Um cômodo da casa: seção cujo conteúdo entra em cena com o visitante (cada
 * filho direto de `.room-inner` é revelado em sequência pelo motor em
 * src/lib/site/casa). `decor` pendura na parede um arco da marca em paralaxe.
 */
function Room<T extends ElementType = 'section'>({
  as,
  tone = 'light',
  decor,
  className = '',
  inner = true,
  children,
  ...rest
}: RoomProps<T>) {
  const Tag: ElementType = as ?? 'section'

  return (
    <Tag className={`room room--${tone} ${WALLS[tone]} ${className}`} {...rest}>
      {decor && <ArchDecor side={decor} dark={tone === 'dark'} />}
      {inner ? <div className="room-inner">{children}</div> : children}
    </Tag>
  )
}

export default Room
