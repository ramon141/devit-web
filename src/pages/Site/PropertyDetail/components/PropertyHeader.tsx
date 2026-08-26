import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Heart, Share2, Printer } from 'lucide-react'
import DropCapHeading from '@/pages/Site/components/DropCapHeading'
import { formatCurrency } from '@/pages/Site/PropertyDetail/utils/formatters'
import type { PublicPropertyControllerFindById200 } from '@/api/generated/models'

type PropertyHeaderProps = {
  property: PublicPropertyControllerFindById200
}

function buildShortAddress(property: PublicPropertyControllerFindById200): string {
  const address = property.address
  if (!address) return ''

  const parts = [address.street, address.city].filter(Boolean)
  return parts.join(', ')
}

function ActionIcon({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <span
      title={label}
      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground"
    >
      {icon}
    </span>
  )
}

function PropertyHeader({ property }: PropertyHeaderProps) {
  const isRent = property.purpose === 'rent'
  const price = formatCurrency(property.price)

  return (
    <div className="flex flex-col gap-3">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        {property.category?.name && <span>{property.category.name}</span>}
        <span>/</span>
        <span className="truncate">{property.title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <DropCapHeading as="h1" text={property.title ?? ''} className="text-2xl font-bold sm:text-3xl" />

        <div className="flex items-center gap-2">
          <ActionIcon label="Preferiti" icon={<Heart className="size-4" />} />
          <ActionIcon label="Condividi" icon={<Share2 className="size-4" />} />
          <ActionIcon label="Stampa" icon={<Printer className="size-4" />} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {property.featured && (
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              Esclusiva
            </span>
          )}

          <span className="rounded bg-[var(--devit-navy-dark)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            {isRent ? 'Affitto' : 'Vendita'}
          </span>

          {property.code && (
            <span className="text-xs text-muted-foreground">Rif. {property.code}</span>
          )}
        </div>

        {price && <p className="text-2xl font-bold text-foreground">{price}</p>}
      </div>

      <p className="text-sm text-muted-foreground">{buildShortAddress(property)}</p>
    </div>
  )
}

export default PropertyHeader
