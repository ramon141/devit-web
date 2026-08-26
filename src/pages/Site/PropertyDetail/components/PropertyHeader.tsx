import { Badge } from '@/components/ui/badge'
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

function PropertyHeader({ property }: PropertyHeaderProps) {
  const isRent = property.purpose === 'rent'
  const price = formatCurrency(property.price)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {property.featured && <Badge variant="secondary">Esclusiva</Badge>}

        <Badge variant={isRent ? 'outline' : 'default'}>
          {isRent ? 'Affitto' : 'Vendita'}
        </Badge>

        {property.code && (
          <span className="text-xs text-muted-foreground">Rif. {property.code}</span>
        )}
      </div>

      <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
        {property.title}
      </h1>

      {price && <p className="text-xl font-semibold text-primary">{price}</p>}

      <p className="text-sm text-muted-foreground">{buildShortAddress(property)}</p>
    </div>
  )
}

export default PropertyHeader
