import type { TFunction } from 'i18next'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

export type PropertyStep = {
  value: string
  label: string
  step: number
  requiresId: boolean
}

export function getPropertySteps(t: TFunction<'imoveis'>): PropertyStep[] {
  return [
    { value: 'generale', label: t('formFields.steps.general'), step: 1, requiresId: false },
    { value: 'prezzo', label: t('formFields.steps.price'), step: 2, requiresId: false },
    { value: 'localizzazione', label: t('formFields.steps.location'), step: 3, requiresId: false },
    { value: 'descrizione', label: t('formFields.steps.description'), step: 4, requiresId: false },
    { value: 'dettagli', label: t('formFields.steps.details'), step: 5, requiresId: false },
    { value: 'foto', label: t('formFields.steps.photos'), step: 6, requiresId: false },
    { value: 'documenti', label: t('formFields.steps.documents'), step: 7, requiresId: false },
    { value: 'commerciale', label: t('formFields.steps.commercial'), step: 8, requiresId: false },
    { value: 'industriale', label: t('formFields.steps.industrial'), step: 9, requiresId: false },
    { value: 'terreno', label: t('formFields.steps.land'), step: 10, requiresId: false },
    { value: 'tasse', label: t('formFields.steps.taxes'), step: 11, requiresId: false },
    { value: 'storico', label: t('formFields.steps.history'), step: 12, requiresId: true },
  ]
}

// Campos de cada etapa do wizard — usados para validar só a etapa atual antes de avançar
export const stepFields: Record<string, (keyof PropertyFormValues)[]> = {
  generale: ['code', 'title', 'categoryId', 'ownerId', 'purpose', 'status', 'featuredOrder'],
  prezzo: ['salePrice', 'rentPrice', 'condoFee'],
  localizzazione: ['country', 'city', 'region', 'postalCode', 'street', 'number', 'neighborhood', 'neighborhoodId', 'complement'],
  descrizione: ['areaSqm', 'bedrooms', 'bathrooms', 'parkingSpots', 'description'],
}

export function getNextStepValue(t: TFunction<'imoveis'>, current: string) {
  const steps = getPropertySteps(t)
  const index = steps.findIndex((step) => step.value === current)

  return steps[index + 1]?.value ?? current
}
