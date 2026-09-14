import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

const LIST_STEP_KEYS = [
  'title',
  'search',
  'status',
  'seller',
  'buyer',
  'sellerAgent',
  'buyerAgent',
  'saleDateFrom',
  'saleDateTo',
  'onlyMine',
  'table',
  'newBtn',
] as const

const LIST_TARGETS: Record<(typeof LIST_STEP_KEYS)[number], string> = {
  title: '#page-section-title',
  search: '#vendite-search-filter',
  status: '#vendite-status-filter',
  seller: '#vendite-seller-filter',
  buyer: '#vendite-buyer-filter',
  sellerAgent: '#vendite-sellerAgent-filter',
  buyerAgent: '#vendite-buyerAgent-filter',
  saleDateFrom: '#vendite-saleDateFrom-filter',
  saleDateTo: '#vendite-saleDateTo-filter',
  onlyMine: '#vendite-onlyMine-filter',
  table: '#vendite-table',
  newBtn: '#vendite-new-btn',
}

const GENERALE_FIELD_KEYS = [
  'number',
  'saleDate',
  'propertyId',
  'sellerId',
  'buyerId',
  'proposalId',
  'extraSellerIds',
  'extraBuyerIds',
  'sellerAgentId',
  'buyerAgentId',
] as const

const PAGAMENTO_FIELD_KEYS = [
  'paymentMethod',
  'status',
  'deedDate',
  'finalAmount',
  'downPayment',
  'commissionAmount',
  'installmentsCount',
  'financialInstitution',
  'cancellationReason',
  'notes',
] as const

export const MODAL_TOUR_START_STEP = LIST_STEP_KEYS.length
const GENERALE_TOUR_START_STEP = MODAL_TOUR_START_STEP + 1
const PAGAMENTO_TOUR_START_STEP = GENERALE_TOUR_START_STEP + GENERALE_FIELD_KEYS.length
const DOCUMENTI_TOUR_START_STEP = PAGAMENTO_TOUR_START_STEP + PAGAMENTO_FIELD_KEYS.length
const STORICO_TOUR_START_STEP = DOCUMENTI_TOUR_START_STEP + 1
export const ACTIONS_TOUR_STEP = STORICO_TOUR_START_STEP + 1

export function getVenditeTourActiveTab(stepIndex: number): string {
  if (stepIndex < GENERALE_TOUR_START_STEP) return 'generale'
  if (stepIndex < PAGAMENTO_TOUR_START_STEP) return 'generale'
  if (stepIndex < DOCUMENTI_TOUR_START_STEP) return 'pagamento'
  if (stepIndex < STORICO_TOUR_START_STEP) return 'documenti'
  return 'storico'
}

function buildListSteps(t: TFunction<'operazioni'>): Step[] {
  return LIST_STEP_KEYS.map((key) => ({
    target: LIST_TARGETS[key],
    title: t(`tour.vendite.list.${key}.title`),
    content: t(`tour.vendite.list.${key}.content`),
    placement: (key === 'table' ? 'top' : 'bottom') as Step['placement'],
  }))
}

function buildModalSteps(t: TFunction<'operazioni'>): Step[] {
  const generaleSteps: Step[] = GENERALE_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.vendite.modal.fields.${field}.title`),
    content: t(`tour.vendite.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  const pagamentoSteps: Step[] = PAGAMENTO_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.vendite.modal.fields.${field}.title`),
    content: t(`tour.vendite.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-vendite-form',
      title: t('tour.vendite.modal.intro.title'),
      content: t('tour.vendite.modal.intro.content'),
      placement: 'center',
    },
    ...generaleSteps,
    ...pagamentoSteps,
    {
      target: '#modal-vendite-tab-documenti',
      title: t('tour.vendite.modal.documenti.title'),
      content: t('tour.vendite.modal.documenti.content'),
      placement: 'center',
    },
    {
      target: '#modal-vendite-tab-storico',
      title: t('tour.vendite.modal.storico.title'),
      content: t('tour.vendite.modal.storico.content'),
      placement: 'center',
    },
    {
      target: '#modal-btn-actions',
      title: t('tour.vendite.modal.actions.title'),
      content: t('tour.vendite.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useVenditeTour() {
  const { t } = useTranslation('operazioni')
  const steps = [...buildListSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
