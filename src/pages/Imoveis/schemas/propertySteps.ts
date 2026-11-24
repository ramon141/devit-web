import {
  ArrowRightLeftIcon,
  BanknoteIcon,
  BuildingIcon,
  FactoryIcon,
  FileTextIcon,
  HistoryIcon,
  HomeIcon,
  ImageIcon,
  ListChecksIcon,
  MapPinIcon,
  ReceiptIcon,
  SproutIcon,
  TextIcon,
  type LucideIcon,
} from 'lucide-react'
import type { TFunction } from 'i18next'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

export type PropertyStep = {
  value: string
  label: string
  step: number
  icon: LucideIcon
  requiresId: boolean
}

export function getPropertySteps(t: TFunction<'imoveis'>): PropertyStep[] {
  return [
    { value: 'generale', label: t('formFields.steps.general'), step: 1, icon: HomeIcon, requiresId: false },
    { value: 'prezzo', label: t('formFields.steps.price'), step: 2, icon: BanknoteIcon, requiresId: false },
    { value: 'localizzazione', label: t('formFields.steps.location'), step: 3, icon: MapPinIcon, requiresId: false },
    { value: 'descrizione', label: t('formFields.steps.description'), step: 4, icon: TextIcon, requiresId: false },
    { value: 'dettagli', label: t('formFields.steps.details'), step: 5, icon: ListChecksIcon, requiresId: false },
    { value: 'foto', label: t('formFields.steps.photos'), step: 6, icon: ImageIcon, requiresId: false },
    { value: 'documenti', label: t('formFields.steps.documents'), step: 7, icon: FileTextIcon, requiresId: false },
    { value: 'commerciale', label: t('formFields.steps.commercial'), step: 8, icon: BuildingIcon, requiresId: false },
    { value: 'industriale', label: t('formFields.steps.industrial'), step: 9, icon: FactoryIcon, requiresId: false },
    { value: 'terreno', label: t('formFields.steps.land'), step: 10, icon: SproutIcon, requiresId: false },
    { value: 'tasse', label: t('formFields.steps.taxes'), step: 11, icon: ReceiptIcon, requiresId: false },
    { value: 'trasferimento', label: t('formFields.steps.transfer'), step: 12, icon: ArrowRightLeftIcon, requiresId: true },
    { value: 'storico', label: t('formFields.steps.history'), step: 13, icon: HistoryIcon, requiresId: true },
  ]
}

// Campos de cada etapa do wizard — usados para validar só a etapa atual antes de avançar
export const stepFields: Record<string, (keyof PropertyFormValues)[]> = {
  generale: ['code', 'title', 'categoryId', 'ownerId', 'purpose', 'status', 'featuredOrder'],
  prezzo: ['salePrice', 'rentPrice', 'condoFee'],
  localizzazione: ['country', 'city', 'region', 'postalCode', 'street', 'number', 'neighborhoodId', 'complement'],
  descrizione: ['areaSqm', 'bedrooms', 'bathrooms', 'parkingSpots', 'description', 'instagramUrl', 'tiktokUrl'],
}

export function getNextStepValue(t: TFunction<'imoveis'>, current: string) {
  const steps = getPropertySteps(t)
  const index = steps.findIndex((step) => step.value === current)

  return steps[index + 1]?.value ?? current
}

export function getPreviousStepValue(t: TFunction<'imoveis'>, current: string) {
  const steps = getPropertySteps(t)
  const index = steps.findIndex((step) => step.value === current)

  return steps[index - 1]?.value ?? current
}
