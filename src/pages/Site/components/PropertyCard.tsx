import { Link } from 'react-router'
import { BedDouble, Bath, Ruler } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

  return (
    <Card className="h-full overflow-hidden">
      <Link to={`/site/property/${property.id}`}>
        {property.coverPhotoUrl ? (
          <img
            src={property.coverPhotoUrl}
            alt={property.title}
            className="aspect-4/3 w-full object-cover"
          />
        ) : (
          <div className="aspect-4/3 w-full bg-muted" />
        )}
      </Link>

      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {status && <Badge variant="secondary">{status}</Badge>}

          {property.price != null && (
            <span className="font-semibold">
              {currencyFormatter.format(property.price)}
            </span>
          )}
        </div>

        <Link to={`/site/property/${property.id}`} className="font-semibold hover:underline">
          {property.title}
        </Link>

        {address && <p className="text-sm text-muted-foreground">{address}</p>}

        <div className="flex gap-4 text-sm text-muted-foreground">
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
