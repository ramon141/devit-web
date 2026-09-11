import { useTranslation } from 'react-i18next'
import { ArrowDownCircleIcon } from 'lucide-react'
import type { PropertyWithRelations } from '@/api/generated/models'
import { formatAmount } from '@/utils/formatAmount'

type PropertyCardFooterProps = {
  property: PropertyWithRelations
}

function PropertyCardFooter({ property }: PropertyCardFooterProps) {
  const { t } = useTranslation('imoveis')
  const price = property.salePrice ?? property.rentPrice

  const features = [
    { label: t('card.area'), value: property.areaSqm },
    { label: t('card.bedrooms'), value: property.bedrooms },
    { label: t('card.bathrooms'), value: property.bathrooms },
    { label: t('card.parkingSpots'), value: property.parkingSpots },
  ].filter((feature) => feature.value != null)

  return (
    <div className="flex flex-wrap items-center gap-y-1 border-t border-border bg-muted/40 px-3 py-2">
      <div className="flex flex-wrap items-center text-sm text-muted-foreground">
        {features.map((feature) => (
          <span
            key={feature.label}
            className="border-l border-dashed border-border px-3 first:border-none first:pl-0"
          >
            {feature.label}: <span className="text-foreground">{feature.value}</span>
          </span>
        ))}
      </div>

      <div className="ml-auto text-right">
        <p className="flex items-center justify-end gap-1 font-semibold">
          <ArrowDownCircleIcon className="size-4 text-emerald-600" />
          {formatAmount(price)}
        </p>

        {property.condoFee != null && (
          <p className="text-xs text-muted-foreground">
            {t('card.condoFee', { value: formatAmount(property.condoFee) })}
          </p>
        )}
      </div>
    </div>
  )
}

export default PropertyCardFooter
