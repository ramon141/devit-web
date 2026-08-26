import type { MouseEvent } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { BedDouble, Bath, Ruler, Maximize2, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useFavorite } from '@/pages/Site/hooks/useFavorite'
import type { PublicPropertyControllerFind200ItemsItem } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'

function statusLabel(t: TFunction<'site'>, purpose?: string) {
  if (purpose === 'sale') return t('propertyCard.statusSale')
  if (purpose === 'rent') return t('propertyCard.statusRent')
  if (purpose === 'rent_or_sale') return t('propertyCard.statusRentOrSale')
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
  const { t } = useTranslation('site')
  const status = statusLabel(t, property.purpose)
  const address = addressLine(property)
  const detailUrl = `/property/${property.id}`
  const { isFavorite, toggle } = useFavorite(property.id ?? '')

  function handleFavoriteClick(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    toggle()
  }

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
            {t('propertyCard.noPhoto')}
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          {property.featured ? (
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              {t('propertyCard.exclusive')}
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
              {formatAmount(property.price, { maximumFractionDigits: 0 })}
            </span>
          )}

          <span className="flex gap-1.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-white/85 text-foreground">
              <Maximize2 className="size-3.5" />
            </span>
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite
                  ? t('propertyCard.removeFavorite')
                  : t('propertyCard.addFavorite')
              }
              className="flex size-7 items-center justify-center rounded-full bg-white/85 text-foreground"
            >
              <Heart className={cn('size-3.5', isFavorite && 'fill-red-500 text-red-500')} />
            </button>
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
