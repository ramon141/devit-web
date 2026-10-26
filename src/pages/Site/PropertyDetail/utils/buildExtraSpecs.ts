import type { SiteDict } from '@/lib/site/dict'
import type { SiteDetail } from '@/lib/site/types'
import type { Spec } from '@/pages/Site/PropertyDetail/utils/buildSpecs'

type PropertyLabelKey = keyof SiteDict['property']

const CONDITION_LABELS: Record<string, PropertyLabelKey> = {
  new: 'conditionNew',
  excellent: 'conditionExcellent',
  good: 'conditionGood',
  to_renovate: 'conditionToRenovate',
}

const FURNISHED_LABELS: Record<string, PropertyLabelKey> = {
  yes: 'furnishedYes',
  partial: 'furnishedPartial',
  no: 'furnishedNo',
}

function labelFor(map: Record<string, PropertyLabelKey>, value: string | null | undefined, dict: SiteDict) {
  const key = value ? map[value] : undefined

  return key ? dict.property[key] : undefined
}

// Informações do cadastro que ajudam o cliente a decidir; só entram as preenchidas
export function buildExtraSpecs(property: SiteDetail, dict: SiteDict): Spec[] {
  const labels = dict.property
  const detail = property.detail
  const location = property.locationDetail
  const condition = labelFor(CONDITION_LABELS, detail?.condition, dict)
  const furnished = labelFor(FURNISHED_LABELS, detail?.furnished, dict)
  const specs: Spec[] = []

  if (condition) specs.push({ label: labels.condition, value: condition })
  if (furnished) specs.push({ label: labels.furnished, value: furnished })
  if (detail?.newConstruction) specs.push({ label: labels.newConstruction, value: labels.yes })
  if (detail?.availableImmediately) {
    specs.push({ label: labels.availability, value: labels.availableNow })
  }
  if (detail?.boxIncludedInPrice) {
    specs.push({ label: labels.parkingIncluded, value: labels.parkingIncludedValue })
  }
  if (location?.totalFloors) specs.push({ label: labels.totalFloors, value: String(location.totalFloors) })
  if (location?.hasElevator) specs.push({ label: labels.elevator, value: labels.yes })

  return specs
}
