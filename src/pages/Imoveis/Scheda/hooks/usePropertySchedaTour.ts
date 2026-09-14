import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type StepDef = { target: string; placement: Step['placement']; key: string }

const GENERALE_FIELD_KEYS = ['code', 'title', 'categoryId', 'ownerId', 'purpose', 'status', 'flags']
const PREZZO_FIELD_KEYS = ['salePrice', 'rentPrice', 'condoFee']
const LOCALIZZAZIONE_FIELD_KEYS = [
  'country',
  'city',
  'region',
  'postalCode',
  'street',
  'number',
  'neighborhoodId',
  'complement',
]
const DESCRIZIONE_FIELD_KEYS = ['areaSqm', 'bedrooms', 'bathrooms', 'parkingSpots', 'description']

// Abas complementares (foto, documenti, commerciale...) recebem só o step do
// próprio botão da aba: são telas de gestão à parte, sem formulário do wizard principal
const OTHER_TAB_VALUES = [
  'dettagli',
  'foto',
  'documenti',
  'commerciale',
  'industriale',
  'terreno',
  'tasse',
  'storico',
]

function fieldSteps(fieldKeys: string[]): StepDef[] {
  return fieldKeys.map((field) => ({
    target: `#property-field-${field}`,
    placement: 'auto',
    key: `field.${field}`,
  }))
}

function buildStepDefs(): { defs: StepDef[]; tabRanges: Record<string, [number, number]> } {
  const defs: StepDef[] = [{ target: '#page-section-title', placement: 'bottom', key: 'intro' }]
  const tabRanges: Record<string, [number, number]> = {}

  const coreTabs: Array<[string, string[]]> = [
    ['generale', GENERALE_FIELD_KEYS],
    ['prezzo', PREZZO_FIELD_KEYS],
    ['localizzazione', LOCALIZZAZIONE_FIELD_KEYS],
    ['descrizione', DESCRIZIONE_FIELD_KEYS],
  ]

  for (const [tabValue, fields] of coreTabs) {
    const start = defs.length
    defs.push({ target: `#stepper-tab-${tabValue}`, placement: 'bottom', key: `tab${capitalize(tabValue)}` })
    defs.push(...fieldSteps(fields))
    defs.push({
      target: `#property-tab-${tabValue}-actions`,
      placement: 'top',
      key: 'actions',
    })
    tabRanges[tabValue] = [start, defs.length]
  }

  for (const tabValue of OTHER_TAB_VALUES) {
    defs.push({ target: `#stepper-tab-${tabValue}`, placement: 'bottom', key: `tab${capitalize(tabValue)}` })
  }

  return { defs, tabRanges }
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const { defs: STEP_DEFS, tabRanges: TAB_RANGES } = buildStepDefs()

export const PROPERTY_TAB_STEP_RANGES = TAB_RANGES

function translationKey(defKey: string) {
  return defKey === 'intro' ? 'tour.scheda.intro' : `tour.scheda.${defKey}`
}

function buildSteps(t: TFunction<'imoveis'>): Step[] {
  return STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`${translationKey(key)}.title`),
    content: t(`${translationKey(key)}.content`),
  }))
}

export function usePropertySchedaTour() {
  const { t } = useTranslation('imoveis')
  return useTour({ steps: buildSteps(t) })
}
