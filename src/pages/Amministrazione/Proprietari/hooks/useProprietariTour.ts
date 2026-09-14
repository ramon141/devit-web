import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type PageStepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: PageStepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#proprietari-table', placement: 'top', key: 'table' },
  { target: '#proprietari-new-btn', placement: 'bottom', key: 'newBtn' },
]

const MODAL_FIELD_KEYS = ['owner', 'email'] as const

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

function buildPageSteps(t: TFunction<'amministrazione'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.proprietari.page.${key}.title`),
    content: t(`tour.proprietari.page.${key}.content`),
  }))
}

function buildModalSteps(t: TFunction<'amministrazione'>): Step[] {
  const fieldSteps: Step[] = MODAL_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.proprietari.modal.fields.${field}.title`),
    content: t(`tour.proprietari.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-proprietari-form',
      title: t('tour.proprietari.modal.intro.title'),
      content: t('tour.proprietari.modal.intro.content'),
      placement: 'center',
    },
    ...fieldSteps,
    {
      target: '#modal-btn-actions',
      title: t('tour.proprietari.modal.actions.title'),
      content: t('tour.proprietari.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useProprietariTour() {
  const { t } = useTranslation('amministrazione')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
