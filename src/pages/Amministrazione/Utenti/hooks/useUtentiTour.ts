import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type PageStepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: PageStepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#utenti-search-filter', placement: 'bottom', key: 'search' },
  { target: '#utenti-table', placement: 'top', key: 'table' },
  { target: '#utenti-new-btn', placement: 'bottom', key: 'newBtn' },
]

const MODAL_FIELD_KEYS = [
  'avatar',
  'fullName',
  'email',
  'accessLevel',
  'branch',
  'password',
  'active',
] as const

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

function buildPageSteps(t: TFunction<'amministrazione'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.utenti.page.${key}.title`),
    content: t(`tour.utenti.page.${key}.content`),
  }))
}

function buildModalSteps(t: TFunction<'amministrazione'>): Step[] {
  const fieldSteps: Step[] = MODAL_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.utenti.modal.fields.${field}.title`),
    content: t(`tour.utenti.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-utenti-form',
      title: t('tour.utenti.modal.intro.title'),
      content: t('tour.utenti.modal.intro.content'),
      placement: 'center',
    },
    ...fieldSteps,
    {
      target: '#modal-btn-actions',
      title: t('tour.utenti.modal.actions.title'),
      content: t('tour.utenti.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useUtentiTour() {
  const { t } = useTranslation('amministrazione')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
