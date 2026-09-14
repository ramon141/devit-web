import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type PageStepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: PageStepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#zone-search-filter', placement: 'bottom', key: 'search' },
  { target: '#zone-table', placement: 'top', key: 'table' },
  { target: '#zone-new-btn', placement: 'bottom', key: 'newBtn' },
  { target: '#zone-neighborhood-panel', placement: 'top', key: 'neighborhoodPanel' },
]

const MODAL_FIELD_KEYS = ['name', 'city', 'region', 'active'] as const

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

function buildPageSteps(t: TFunction<'amministrazione'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.zone.page.${key}.title`),
    content: t(`tour.zone.page.${key}.content`),
  }))
}

function buildModalSteps(t: TFunction<'amministrazione'>): Step[] {
  const fieldSteps: Step[] = MODAL_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.zone.modal.fields.${field}.title`),
    content: t(`tour.zone.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-zone-form',
      title: t('tour.zone.modal.intro.title'),
      content: t('tour.zone.modal.intro.content'),
      placement: 'center',
    },
    ...fieldSteps,
    {
      target: '#modal-btn-actions',
      title: t('tour.zone.modal.actions.title'),
      content: t('tour.zone.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useZoneTour() {
  const { t } = useTranslation('amministrazione')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
