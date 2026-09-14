import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type StepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: StepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#leads-search-filter', placement: 'bottom', key: 'search' },
  { target: '#leads-source-filter', placement: 'bottom', key: 'source' },
  { target: '#leads-requestType-filter', placement: 'bottom', key: 'requestType' },
  { target: '#leads-assignedTo-filter', placement: 'bottom', key: 'assignedTo' },
  { target: '#leads-onlyMine-filter', placement: 'bottom', key: 'onlyMine' },
  { target: '#leads-board', placement: 'top', key: 'board' },
  { target: '#leads-column-new', placement: 'right', key: 'columnNew' },
  { target: '#leads-column-contacted', placement: 'right', key: 'columnContacted' },
  { target: '#leads-column-negotiating', placement: 'right', key: 'columnNegotiating' },
  { target: '#leads-column-converted', placement: 'right', key: 'columnConverted' },
  { target: '#leads-column-lost', placement: 'right', key: 'columnLost' },
  { target: '#leads-new-btn', placement: 'bottom', key: 'newBtn' },
]

const MODAL_FIELD_KEYS = [
  'name',
  'phone',
  'email',
  'firstContactAt',
  'status',
  'source',
  'requestType',
  'desiredCity',
  'maxBudget',
  'subject',
  'assignedTo',
  'lossReason',
  'notes',
] as const

const CRITERIA_FIELD_KEYS = [
  'purpose',
  'category',
  'expiresAt',
  'zones',
  'priceRange',
  'areaRange',
  'roomsRange',
  'bedroomsRange',
  'bathroomsRange',
] as const

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

function buildPageSteps(t: TFunction<'clientes'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.leads.page.${key}.title`),
    content: t(`tour.leads.page.${key}.content`),
  }))
}

function buildFieldSteps(t: TFunction<'clientes'>, keys: readonly string[], group: string): Step[] {
  return keys.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.leads.modal.${group}.${field}.title`),
    content: t(`tour.leads.modal.${group}.${field}.content`),
    placement: 'auto',
  }))
}

function buildModalSteps(t: TFunction<'clientes'>): Step[] {
  return [
    {
      target: '#modal-leads-form',
      title: t('tour.leads.modal.intro.title'),
      content: t('tour.leads.modal.intro.content'),
      placement: 'center',
    },
    ...buildFieldSteps(t, MODAL_FIELD_KEYS, 'fields'),
    {
      target: '#modal-leads-criteria',
      title: t('tour.leads.modal.criteriaIntro.title'),
      content: t('tour.leads.modal.criteriaIntro.content'),
      placement: 'top',
    },
    ...buildFieldSteps(t, CRITERIA_FIELD_KEYS, 'criteria'),
    {
      target: '#modal-btn-actions',
      title: t('tour.leads.modal.actions.title'),
      content: t('tour.leads.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useLeadsTour() {
  const { t } = useTranslation('clientes')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
