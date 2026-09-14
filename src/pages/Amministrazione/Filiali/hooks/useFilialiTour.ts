import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type PageStepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: PageStepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#filiali-search-filter', placement: 'bottom', key: 'search' },
  { target: '#filiali-table', placement: 'top', key: 'table' },
  { target: '#filiali-new-btn', placement: 'bottom', key: 'newBtn' },
]

const MODAL_FIELD_KEYS = ['name', 'active'] as const

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

function buildPageSteps(t: TFunction<'amministrazione'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.filiali.page.${key}.title`),
    content: t(`tour.filiali.page.${key}.content`),
  }))
}

function buildModalSteps(t: TFunction<'amministrazione'>): Step[] {
  const fieldSteps: Step[] = MODAL_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.filiali.modal.fields.${field}.title`),
    content: t(`tour.filiali.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-filiali-form',
      title: t('tour.filiali.modal.intro.title'),
      content: t('tour.filiali.modal.intro.content'),
      placement: 'center',
    },
    ...fieldSteps,
    {
      target: '#modal-btn-actions',
      title: t('tour.filiali.modal.actions.title'),
      content: t('tour.filiali.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useFilialiTour() {
  const { t } = useTranslation('amministrazione')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
