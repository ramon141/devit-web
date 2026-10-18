import { z } from 'zod'
import type { TFunction } from 'i18next'

function optionalNumberInRange(min: number, max: number, message: string) {
  return z.string().refine((value) => {
    if (!value) return true
    const parsed = Number(value)

    return Number.isFinite(parsed) && parsed >= min && parsed <= max
  }, message)
}

export function createLocationDetailSchema(t: TFunction<'imoveis'>) {
  const nonNegative = t('scheda.locationDetailSection.nonNegative')

  return z.object({
    latitude: optionalNumberInRange(-90, 90, t('scheda.locationDetailSection.latitudeInvalid')),
    longitude: optionalNumberInRange(-180, 180, t('scheda.locationDetailSection.longitudeInvalid')),
    publicLatitude: optionalNumberInRange(-90, 90, t('scheda.locationDetailSection.latitudeInvalid')),
    publicLongitude: optionalNumberInRange(-180, 180, t('scheda.locationDetailSection.longitudeInvalid')),
    position: z.string(),
    distanceToWaterM: optionalNumberInRange(0, Number.MAX_SAFE_INTEGER, nonNegative),
    floorNumber: z.string(),
    totalFloors: optionalNumberInRange(0, Number.MAX_SAFE_INTEGER, nonNegative),
    hasElevator: z.boolean(),
    hasArchitecturalBarriers: z.boolean(),
    builtYear: optionalNumberInRange(0, Number.MAX_SAFE_INTEGER, nonNegative),
    totalUnitsInBuilding: optionalNumberInRange(0, Number.MAX_SAFE_INTEGER, nonNegative),
    usableAreaSqm: optionalNumberInRange(0, Number.MAX_SAFE_INTEGER, nonNegative),
  })
}
