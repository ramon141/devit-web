import { Link } from 'react-router'
import { BedDouble, Bath, Ruler, Maximize2, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { PublicPropertyControllerFind200ItemsItem } from '@/api/generated/models'

const currencyFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function statusLabel(purpose?: string) {
  if (purpose === 'sale') return 'Vendita'
  if (purpose === 'rent') return 'Affitto'
  if (purpose === 'rent_or_sale') return 'Vendita / Affitto'
  return null
}

function addressLine(item: PublicPropertyControllerFind200ItemsItem) {
  const parts = [item.address?.street, item.address?.city].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : null
}

type PropertyCardProps = {
  property: PublicPropertyControllerFind200ItemsItem
}

function PropertyCard({ property }: PropertyCardProps) {
  const status = statusLabel(property.purpose)
  const address = addressLine(property)
  const detailUrl = `/property/${property.id}`

  return (
    <Card className="h-full overflow-hidden py-0 gap-0">
      <Link to={detailUrl} className="relative block">
        {property.coverPhotoUrl ? (
          <img
            src={property.coverPhotoUrl}
            alt={property.title}
            className="aspect-4/3 w-full object-cover"
          />
        ) : (
          <div className="flex aspect-4/3 w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            Nessuna foto disponibile
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          {property.featured ? (
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              Esclusiva
            </span>
          ) : (
            <span />
          )}

          {status && (
            <span className="rounded bg-[var(--devit-navy-dark)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              {status}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-8">
          {property.price != null && (
            <span className="text-lg font-bold text-white drop-shadow-sm">
              {currencyFormatter.format(property.price)}
            </span>
          )}

          <span className="flex gap-1.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-white/85 text-foreground">
              <Maximize2 className="size-3.5" />
            </span>
            <span className="flex size-7 items-center justify-center rounded-full bg-white/85 text-foreground">
              <Heart className="size-3.5" />
            </span>
          </span>
        </div>
      </Link>

      <CardContent className="flex flex-col gap-2 py-4">
        <Link to={detailUrl} className="font-heading text-sm font-bold uppercase tracking-wide hover:text-primary">
          {property.title}
        </Link>

        {address && <p className="text-sm text-muted-foreground">{address}</p>}

        <div className="mt-1 flex gap-4 border-t border-border pt-2 text-sm text-muted-foreground">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="size-4" />
              {property.bedrooms}
            </span>
          )}

          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="size-4" />
              {property.bathrooms}
            </span>
          )}

          {property.areaSqm != null && (
            <span className="flex items-center gap-1">
              <Ruler className="size-4" />
              {property.areaSqm} m²
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
