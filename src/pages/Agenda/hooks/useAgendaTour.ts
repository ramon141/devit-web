import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type StepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: StepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#agenda-search-filter', placement: 'bottom', key: 'search' },
  { target: '#agenda-type-filter', placement: 'bottom', key: 'typeFilter' },
  { target: '#agenda-onlyCalls-filter', placement: 'bottom', key: 'onlyCalls' },
  { target: '#agenda-visibleUsers-filter', placement: 'bottom', key: 'visibleUsers' },
  { target: '#agenda-calendar', placement: 'top', key: 'calendar' },
]

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

const MODAL_FIELD_KEYS = [
  'title',
  'type',
  'place',
  'keysLocation',
  'date',
  'allDay',
  'startTime',
  'endTime',
  'client',
  'owner',
  'confirmationStatus',
  'reminder',
  'recurrence',
  'eventColor',
  'privateEvent',
  'description',
] as const

function buildPageSteps(t: TFunction<'agenda'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.page.${key}.title`),
    content: t(`tour.page.${key}.content`),
  }))
}

function buildModalSteps(t: TFunction<'agenda'>): Step[] {
  const fieldSteps: Step[] = MODAL_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.modal.fields.${field}.title`),
    content: t(`tour.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-agenda-form',
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

export function useAgendaTour() {
  const { t } = useTranslation('agenda')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
