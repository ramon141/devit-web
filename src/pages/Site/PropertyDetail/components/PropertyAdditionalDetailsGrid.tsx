import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import {
  formatAvailability,
  formatBoolean,
  formatCondition,
  formatCurrency,
  formatFurnished,
  formatMediationType,
} from '@/pages/Site/PropertyDetail/utils/formatters'
import type { PublicPropertyControllerFindById200 } from '@/api/generated/models'

type PropertyAdditionalDetailsGridProps = {
  property: PublicPropertyControllerFindById200
}

type DetailRow = {
  label: string
  value: string | null
}

function buildDetailRows(
  t: TFunction<'site'>,
  detail: PublicPropertyControllerFindById200['detail'],
): DetailRow[] {
  if (!detail) return []

  return [
    { label: t('propertyAdditionalDetailsGrid.type'), value: detail.subtype ?? null },
    {
      label: t('propertyAdditionalDetailsGrid.mediationType'),
      value: detail.mediationType ? formatMediationType(t, detail.mediationType) : null,
    },
    {
      label: t('propertyAdditionalDetailsGrid.condition'),
      value: detail.condition ? formatCondition(t, detail.condition) : null,
    },
    {
      label: t('propertyAdditionalDetailsGrid.furnished'),
      value: detail.furnished ? formatFurnished(t, detail.furnished) : null,
    },
    { label: t('propertyAdditionalDetailsGrid.exposure'), value: detail.exposure ?? null },
    {
      label: t('propertyAdditionalDetailsGrid.availability'),
      value: detail.availability ? formatAvailability(t, detail.availability) : null,
    },
    { label: t('propertyAdditionalDetailsGrid.negotiable'), value: formatBoolean(t, detail.negotiable) },
    {
      label: t('propertyAdditionalDetailsGrid.newConstruction'),
      value: formatBoolean(t, detail.newConstruction),
    },
    {
      label: t('propertyAdditionalDetailsGrid.bareOwnership'),
      value: formatBoolean(t, detail.bareOwnership),
    },
    { label: t('propertyAdditionalDetailsGrid.prestige'), value: formatBoolean(t, detail.prestige) },
    {
      label: t('propertyAdditionalDetailsGrid.estimatedValue'),
      value: formatCurrency(detail.estimatedValue),
    },
  ]
}

function buildAdditionalDetailRows(
  t: TFunction<'site'>,
  additionalDetail: PublicPropertyControllerFindById200['additionalDetail'],
): DetailRow[] {
  if (!additionalDetail) return []

  return [
    {
      label: t('propertyAdditionalDetailsGrid.roomsCount'),
      value: additionalDetail.roomsCount?.toString() ?? null,
    },
    { label: t('propertyAdditionalDetailsGrid.quality'), value: additionalDetail.quality ?? null },
    {
      label: t('propertyAdditionalDetailsGrid.habitability'),
      value: additionalDetail.habitability ?? null,
    },
    {
      label: t('propertyAdditionalDetailsGrid.windowFrames'),
      value: additionalDetail.windowFrames ?? null,
    },
  ]
}

function buildLocationDetailRows(
  t: TFunction<'site'>,
  locationDetail: PublicPropertyControllerFindById200['locationDetail'],
): DetailRow[] {
  if (!locationDetail) return []

  const floor = locationDetail.floorNumber !== null && locationDetail.floorNumber !== undefined
    ? locationDetail.totalFloors
      ? t('propertyAdditionalDetailsGrid.floorOf', {
          floor: locationDetail.floorNumber,
          total: locationDetail.totalFloors,
        })
      : String(locationDetail.floorNumber)
    : null

  return [
    { label: t('propertyAdditionalDetailsGrid.floor'), value: floor },
    { label: t('propertyAdditionalDetailsGrid.elevator'), value: formatBoolean(t, locationDetail.hasElevator) },
    {
      label: t('propertyAdditionalDetailsGrid.builtYear'),
      value: locationDetail.builtYear?.toString() ?? null,
    },
    {
      label: t('propertyAdditionalDetailsGrid.usableArea'),
      value: locationDetail.usableAreaSqm ? `${locationDetail.usableAreaSqm} m²` : null,
    },
  ]
}

function buildPropertyRows(
  t: TFunction<'site'>,
  property: PublicPropertyControllerFindById200,
): DetailRow[] {
  return [
    { label: t('propertyAdditionalDetailsGrid.condoFee'), value: formatCurrency(property.condoFee) },
    {
      label: t('propertyAdditionalDetailsGrid.parkingSpots'),
      value: property.parkingSpots?.toString() ?? null,
    },
  ]
}

function PropertyAdditionalDetailsGrid({ property }: PropertyAdditionalDetailsGridProps) {
  const { t } = useTranslation('site')

  const rows = [
    ...buildDetailRows(t, property.detail),
    ...buildAdditionalDetailRows(t, property.additionalDetail),
    ...buildLocationDetailRows(t, property.locationDetail),
    ...buildPropertyRows(t, property),
  ].filter((row) => row.value !== null)

  if (rows.length === 0) return null

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">
        {t('propertyAdditionalDetailsGrid.title')}
      </h2>

      <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between border-b py-1 sm:justify-start sm:gap-2">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default PropertyAdditionalDetailsGrid
