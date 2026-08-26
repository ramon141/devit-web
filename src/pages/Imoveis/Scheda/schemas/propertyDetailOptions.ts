import type { TFunction } from 'i18next'

export function getRatingOptions(t: TFunction<'imoveis'>) {
  return [
    { value: 'standard', label: t('options.rating.standard') },
    { value: 'gold', label: t('options.rating.gold') },
  ]
}

export function getMediationOptions(t: TFunction<'imoveis'>) {
  return [
    { value: 'exclusive', label: t('options.mediation.exclusive') },
    { value: 'open', label: t('options.mediation.open') },
  ]
}

export function getAvailabilityOptions(t: TFunction<'imoveis'>) {
  return [
    { value: 'available', label: t('options.availability.available') },
    { value: 'occupied', label: t('options.availability.occupied') },
    { value: 'under_renovation', label: t('options.availability.underRenovation') },
  ]
}

export function getConditionOptions(t: TFunction<'imoveis'>) {
  return [
    { value: 'new', label: t('options.condition.new') },
    { value: 'excellent', label: t('options.condition.excellent') },
    { value: 'good', label: t('options.condition.good') },
    { value: 'to_renovate', label: t('options.condition.toRenovate') },
  ]
}

export function getFurnishedOptions(t: TFunction<'imoveis'>) {
  return [
    { value: 'yes', label: t('options.furnished.yes') },
    { value: 'partial', label: t('options.furnished.partial') },
    { value: 'no', label: t('options.furnished.no') },
  ]
}
