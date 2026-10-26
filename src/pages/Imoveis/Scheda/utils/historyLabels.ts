import type { TFunction } from 'i18next'
import type {
  PropertyHistoryControllerHistory200ItemsItemChangesItemNew as HistoryValue,
} from '@/api/generated/models/propertyHistoryControllerHistory200ItemsItemChangesItemNew'
import {
  getAmenityOptions,
  getIndustrialFeatureOptions,
  getLandFeatureOptions,
  getLifestyleOptions,
  getNeighborhoodOptions,
} from '@/pages/Imoveis/Scheda/schemas/featureOptions'
import {
  getFeeFrequencyOptions,
} from '@/pages/Imoveis/Scheda/schemas/feeFrequencyOptions'
import {
  getIndustrialAreaTypeOptions,
} from '@/pages/Imoveis/Scheda/schemas/industrialAreaOptions'
import {
  getAvailabilityOptions,
  getConditionOptions,
  getFurnishedOptions,
  getMediationOptions,
  getRatingOptions,
} from '@/pages/Imoveis/Scheda/schemas/propertyDetailOptions'
import {
  getRoomTypeOptions,
} from '@/pages/Imoveis/Scheda/schemas/roomTypeOptions'

type LabeledOption = { value?: string; key?: string; label: string }

const EMPTY_VALUE = '—'

// Campos cujo valor é um código sem lista pronta: o texto fica em "prefixo.codigoEmCamelCase"
const VALUE_PREFIXES: Record<string, string> = {
  status: 'options.status',
  purpose: 'options.purpose',
  scope: 'scheda.commercialActivityFields.scopeOptions',
  terrainType: 'scheda.landDetailFields.terrainTypeOptions',
  heatingType: 'scheda.heatingSection.typeOptions',
  category: 'scheda.storicoTab.featureCategories',
}

function getOptionsByField(t: TFunction<'imoveis'>): Record<string, LabeledOption[]> {
  return {
    rating: getRatingOptions(t),
    mediationType: getMediationOptions(t),
    availability: getAvailabilityOptions(t),
    condition: getConditionOptions(t),
    furnished: getFurnishedOptions(t),
    frequency: getFeeFrequencyOptions(t),
    areaType: getIndustrialAreaTypeOptions(t),
    roomType: getRoomTypeOptions(t),
    featureKey: [
      ...getLifestyleOptions(t),
      ...getAmenityOptions(t),
      ...getNeighborhoodOptions(t),
      ...getIndustrialFeatureOptions(t),
      ...getLandFeatureOptions(t),
    ],
  }
}

function toCamelCase(code: string) {
  return code.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

function translateCode(t: TFunction<'imoveis'>, field: string, code: string) {
  const option = getOptionsByField(t)[field]?.find((item) => (item.value ?? item.key) === code)
  if (option) return option.label

  const prefix = VALUE_PREFIXES[field]

  return prefix ? t(`${prefix}.${toCamelCase(code)}`, { defaultValue: code }) : code
}

export function formatHistoryValue(t: TFunction<'imoveis'>, field: string, value: HistoryValue) {
  if (value === null || value === undefined || value === '') return EMPTY_VALUE
  if (typeof value === 'boolean') return t(value ? 'scheda.storicoTab.yes' : 'scheda.storicoTab.no')
  if (typeof value === 'object') return JSON.stringify(value)

  return translateCode(t, field, String(value))
}
