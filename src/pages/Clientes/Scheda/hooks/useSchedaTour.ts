import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type StepDef = { target: string; placement: Step['placement']; key: string; tab: string }

const DATI_FIELD_KEYS = [
  'name',
  'role',
  'email',
  'birthDate',
  'phone',
  'secondaryPhone',
  'documentType',
  'documentNumber',
  'notes',
  'active',
  'country',
  'city',
  'region',
  'postalCode',
  'street',
  'number',
  'neighborhood',
  'complement',
] as const

const datiFieldSteps: StepDef[] = DATI_FIELD_KEYS.map((field) => ({
  target: `#modal-field-${field}`,
  placement: 'auto',
  key: `dati.${field}`,
  tab: 'dati',
}))

const STEP_DEFS: StepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title', tab: 'dati' },
  { target: '#cliente-scheda-tab-dati', placement: 'bottom', key: 'tabDati', tab: 'dati' },
  ...datiFieldSteps,
  { target: '#cliente-scheda-tab-allegati', placement: 'bottom', key: 'tabAllegati', tab: 'allegati' },
  { target: '#cliente-scheda-allegati', placement: 'top', key: 'allegati', tab: 'allegati' },
  { target: '#cliente-scheda-tab-immobili', placement: 'bottom', key: 'tabImmobili', tab: 'immobili' },
  { target: '#cliente-scheda-immobili', placement: 'top', key: 'immobili', tab: 'immobili' },
  { target: '#cliente-scheda-tab-agenda', placement: 'bottom', key: 'tabAgenda', tab: 'agenda' },
  { target: '#cliente-scheda-agenda', placement: 'top', key: 'agenda', tab: 'agenda' },
  { target: '#cliente-scheda-tab-comunicazioni', placement: 'bottom', key: 'tabComunicazioni', tab: 'comunicazioni' },
  { target: '#cliente-scheda-comunicazioni', placement: 'top', key: 'comunicazioni', tab: 'comunicazioni' },
]

export const SCHEDA_TAB_BY_STEP: string[] = STEP_DEFS.map((step) => step.tab)

function buildSteps(t: TFunction<'clientes'>): Step[] {
  return STEP_DEFS.map(({ key, tab: _tab, ...step }) => ({
    ...step,
    title: t(`tour.scheda.${key}.title`),
    content: t(`tour.scheda.${key}.content`),
  }))
}

export function useSchedaTour() {
  const { t } = useTranslation('clientes')
  const steps = buildSteps(t)

  return useTour({ steps })
}
