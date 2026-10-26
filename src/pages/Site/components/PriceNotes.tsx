import { useSiteDict } from '@/lib/site/dict'

type PriceNotesProps = {
  priceFrom?: boolean
  negotiable?: boolean
}

// "a partir de" vem antes do valor
export function PriceFromPrefix({ priceFrom }: Pick<PriceNotesProps, 'priceFrom'>) {
  const { dict } = useSiteDict()

  if (!priceFrom) return null

  return <span className="mr-1.5 font-site-sans text-sm text-site-muted">{dict.property.priceFrom}</span>
}

// Etiqueta discreta abaixo do preço
export function NegotiableNote({ negotiable }: Pick<PriceNotesProps, 'negotiable'>) {
  const { dict } = useSiteDict()

  if (!negotiable) return null

  return <p className="mt-1.5 text-[0.78rem] text-site-muted">{dict.property.negotiable}</p>
}
