import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { formatCurrency } from '@/pages/Site/PropertyDetail/utils/formatters'
import type { PublicPropertyControllerFindById200 } from '@/api/generated/models'

type PropertyDetailsGridProps = {
  property: PublicPropertyControllerFindById200
}

type DetailRow = {
  label: string
  value: string | null
}

function buildRows(
  t: TFunction<'site'>,
  property: PublicPropertyControllerFindById200,
): DetailRow[] {
  const isRent = property.purpose === 'rent'

  return [
    { label: t('propertyDetailsGrid.code'), value: property.code ?? null },
    { label: t('propertyDetailsGrid.price'), value: formatCurrency(property.price) },
    {
      label: t('propertyDetailsGrid.size'),
      value: property.areaSqm ? `${property.areaSqm} m²` : null,
    },
    { label: t('propertyDetailsGrid.bedrooms'), value: property.bedrooms?.toString() ?? null },
    { label: t('propertyDetailsGrid.bathrooms'), value: property.bathrooms?.toString() ?? null },
    { label: t('propertyDetailsGrid.propertyType'), value: property.category?.name ?? null },
    {
      label: t('propertyDetailsGrid.status'),
      value: isRent ? t('propertyDetailsGrid.statusRent') : t('propertyDetailsGrid.statusSale'),
    },
  ]
}

function PropertyDetailsGrid({ property }: PropertyDetailsGridProps) {
  const { t } = useTranslation('site')
  const rows = buildRows(t, property).filter((row) => row.value !== null)

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">{t('propertyDetailsGrid.title')}</h2>

      <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between border-b border-primary/10 py-1.5 sm:justify-start sm:gap-2">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default PropertyDetailsGrid
