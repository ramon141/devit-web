import { useTranslation } from 'react-i18next'
import { FlagIcon, ImageIcon } from 'lucide-react'
import type { Attachment, PropertyPhoto, PropertyWithRelations } from '@/api/generated/models'
import { PropertyDetailRating } from '@/api/generated/models'
import PropertyCardActions from '@/pages/Imoveis/components/PropertyCardActions'
import { formatDateTime } from '@/utils/formatDate'

type PropertyCardBodyProps = {
  property: PropertyWithRelations
}

function coverUrl(photos?: (PropertyPhoto & { attachment?: Attachment })[]) {
  const cover = photos?.find((photo) => photo.cover) ?? photos?.[0]
  return cover?.attachment?.url ?? null
}

function PropertyCardBody({ property }: PropertyCardBodyProps) {
  const { t } = useTranslation('imoveis')
  const photo = coverUrl(property.propertyPhotos)
  const isGold = property.propertyDetail?.rating === PropertyDetailRating.gold
  const region = property.address?.region

  return (
    <div className="flex flex-col gap-3 p-3 sm:flex-row">
      <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted sm:w-40">
        {photo ? (
          <img src={photo} alt={property.title} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold uppercase">{property.category?.name ?? property.title}</p>

        <p className="text-sm font-medium text-muted-foreground">
          {property.address?.city ?? '—'}
          {region ? ` (${region})` : ''}
        </p>

        {property.description && (
          <p className="mt-2 line-clamp-3 text-sm whitespace-pre-line text-muted-foreground">
            {property.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2 sm:border-l sm:border-border sm:pl-3">
        <p className="text-xs text-muted-foreground">
          {t('card.modifiedOn', { date: formatDateTime(property.updatedAt ?? property.createdAt) })}
        </p>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {t('card.quality')}
          <FlagIcon
            className={isGold ? 'size-4 text-amber-500' : 'size-4 text-muted-foreground'}
            fill="currentColor"
          />
        </div>

        <PropertyCardActions property={property} />
      </div>
    </div>
  )
}

export default PropertyCardBody
