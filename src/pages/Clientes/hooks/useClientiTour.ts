import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type PageStepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: PageStepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#clienti-search-filter', placement: 'bottom', key: 'search' },
  { target: '#clienti-role-filter', placement: 'bottom', key: 'roleFilter' },
  { target: '#clienti-table', placement: 'top', key: 'table' },
  { target: '#clienti-new-btn', placement: 'bottom', key: 'newBtn' },
]

const MODAL_FIELD_KEYS = [
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

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

function buildPageSteps(t: TFunction<'clientes'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.page.${key}.title`),
    content: t(`tour.page.${key}.content`),
  }))
}

function buildModalSteps(t: TFunction<'clientes'>): Step[] {
  const fieldSteps: Step[] = MODAL_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.modal.fields.${field}.title`),
    content: t(`tour.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-clienti-form',
      title: t('tour.modal.intro.title'),
      content: t('tour.modal.intro.content'),
      placement: 'center',
    },
    ...fieldSteps,
    {
      target: '#modal-btn-actions',
      title: t('tour.modal.actions.title'),
      content: t('tour.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useClientiTour() {
  const { t } = useTranslation('clientes')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
