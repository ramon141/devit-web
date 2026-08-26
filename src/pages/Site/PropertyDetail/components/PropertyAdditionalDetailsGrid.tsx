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
  detail: PublicPropertyControllerFindById200['detail'],
): DetailRow[] {
  if (!detail) return []

  return [
    { label: 'Tipologia', value: detail.subtype ?? null },
    { label: 'Tipo di mediazione', value: detail.mediationType ? formatMediationType(detail.mediationType) : null },
    { label: 'Stato', value: detail.condition ? formatCondition(detail.condition) : null },
    { label: 'Arredato', value: detail.furnished ? formatFurnished(detail.furnished) : null },
    { label: 'Esposizione', value: detail.exposure ?? null },
    { label: 'Disponibilità', value: detail.availability ? formatAvailability(detail.availability) : null },
    { label: 'Trattabile', value: formatBoolean(detail.negotiable) },
    { label: 'Nuova costruzione', value: formatBoolean(detail.newConstruction) },
    { label: 'Nuda proprietà', value: formatBoolean(detail.bareOwnership) },
    { label: 'Immobile di prestigio', value: formatBoolean(detail.prestige) },
    { label: 'Valore stimato', value: formatCurrency(detail.estimatedValue) },
  ]
}

function buildAdditionalDetailRows(
  additionalDetail: PublicPropertyControllerFindById200['additionalDetail'],
): DetailRow[] {
  if (!additionalDetail) return []

  return [
    { label: 'Locali', value: additionalDetail.roomsCount?.toString() ?? null },
    { label: 'Qualità', value: additionalDetail.quality ?? null },
    { label: 'Abitabilità', value: additionalDetail.habitability ?? null },
    { label: 'Infissi', value: additionalDetail.windowFrames ?? null },
  ]
}

function buildLocationDetailRows(
  locationDetail: PublicPropertyControllerFindById200['locationDetail'],
): DetailRow[] {
  if (!locationDetail) return []

  const floor = locationDetail.floorNumber !== null && locationDetail.floorNumber !== undefined
    ? `${locationDetail.floorNumber}${locationDetail.totalFloors ? ` di ${locationDetail.totalFloors}` : ''}`
    : null

  return [
    { label: 'Piano', value: floor },
    { label: 'Ascensore', value: formatBoolean(locationDetail.hasElevator) },
    { label: 'Anno di costruzione', value: locationDetail.builtYear?.toString() ?? null },
    { label: 'Superficie calpestabile', value: locationDetail.usableAreaSqm ? `${locationDetail.usableAreaSqm} m²` : null },
  ]
}

function buildPropertyRows(property: PublicPropertyControllerFindById200): DetailRow[] {
  return [
    { label: 'Spese condominio', value: formatCurrency(property.condoFee) },
    { label: 'Posti auto', value: property.parkingSpots?.toString() ?? null },
  ]
}

function PropertyAdditionalDetailsGrid({ property }: PropertyAdditionalDetailsGridProps) {
  const rows = [
    ...buildDetailRows(property.detail),
    ...buildAdditionalDetailRows(property.additionalDetail),
    ...buildLocationDetailRows(property.locationDetail),
    ...buildPropertyRows(property),
  ].filter((row) => row.value !== null)

  if (rows.length === 0) return null

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">Dettagli aggiuntivi</h2>

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
