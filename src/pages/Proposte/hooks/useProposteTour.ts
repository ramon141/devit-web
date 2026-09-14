import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type StepDef = { target: string; placement: Step['placement']; key: string }

const PAGE_STEP_DEFS: StepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#proposte-search-filter', placement: 'bottom', key: 'search' },
  { target: '#proposte-status-filter', placement: 'bottom', key: 'status' },
  { target: '#proposte-financed-filter', placement: 'bottom', key: 'financed' },
  { target: '#proposte-property-filter', placement: 'bottom', key: 'property' },
  { target: '#proposte-buyer-filter', placement: 'bottom', key: 'buyer' },
  { target: '#proposte-sellerAgent-filter', placement: 'bottom', key: 'sellerAgent' },
  { target: '#proposte-assignedTo-filter', placement: 'bottom', key: 'assignedTo' },
  { target: '#proposte-dateFrom-filter', placement: 'bottom', key: 'dateFrom' },
  { target: '#proposte-dateTo-filter', placement: 'bottom', key: 'dateTo' },
  { target: '#proposte-onlyMine-filter', placement: 'bottom', key: 'onlyMine' },
  { target: '#proposte-table', placement: 'top', key: 'table' },
  { target: '#proposte-new-btn', placement: 'bottom', key: 'newBtn' },
]

const MODAL_FIELD_KEYS = [
  'number',
  'proposalAmount',
  'propertyId',
  'buyerId',
  'paymentMethod',
  'status',
  'leadId',
  'assignedToId',
  'sellerAgentId',
  'proposalDate',
  'validUntil',
  'financed',
  'paymentTerms',
  'rejectionReason',
  'notes',
] as const

export const MODAL_TOUR_START_STEP = PAGE_STEP_DEFS.length

function buildPageSteps(t: TFunction<'proposte'>): Step[] {
  return PAGE_STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.page.${key}.title`),
    content: t(`tour.page.${key}.content`),
  }))
}

function buildModalSteps(t: TFunction<'proposte'>): Step[] {
  const fieldSteps: Step[] = MODAL_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.modal.fields.${field}.title`),
    content: t(`tour.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-proposte-form',
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

export function useProposteTour() {
  const { t } = useTranslation('proposte')
  const steps = [...buildPageSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
