import { formatNumber, type SiteDict } from '@/lib/site/dict'
import { toNumber } from '@/lib/site/property'
import type { Locale, SiteDetail } from '@/lib/site/types'

export type Spec = { label: string; value: string }

// Dados curtos da ficha; cada item só entra se o imóvel tiver o valor
export function buildSpecs(property: SiteDetail, locale: Locale, dict: SiteDict): Spec[] {
  const labels = dict.property
  const area = toNumber(property.areaSqm)
  const bedrooms = toNumber(property.bedrooms)
  const bathrooms = toNumber(property.bathrooms)
  const parking = toNumber(property.parkingSpots)
  const condoFee = toNumber(property.condoFee)
  const floor = property.locationDetail?.floorNumber
  const builtYear = property.locationDetail?.builtYear
  const specs: Spec[] = []

  if (area !== null) {
    specs.push({ label: labels.surface, value: `${formatNumber(area, locale)} ${dict.common.mq}` })
  }

  if (bedrooms) specs.push({ label: labels.bedrooms, value: String(bedrooms) })

  if (bathrooms) {
    specs.push({
      label: bathrooms === 1 ? labels.bathroomOne : labels.bathrooms,
      value: String(bathrooms),
    })
  }

  if (parking) specs.push({ label: labels.parking, value: String(parking) })

  if (floor !== null && floor !== undefined) {
    specs.push({ label: labels.floor, value: floor === 0 ? labels.groundFloor : String(floor) })
  }

  if (builtYear) specs.push({ label: labels.yearBuilt, value: String(builtYear) })

  if (condoFee) specs.push({ label: labels.condoFees, value: `${formatNumber(condoFee, locale)} €` })

  return specs
}
