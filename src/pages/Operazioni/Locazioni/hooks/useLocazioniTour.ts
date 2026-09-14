import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

const LIST_STEP_KEYS = [
  'title',
  'search',
  'situation',
  'owner',
  'tenant',
  'ownerAgent',
  'tenantAgent',
  'stipulaDateFrom',
  'stipulaDateTo',
  'startDateFrom',
  'startDateTo',
  'onlyMine',
  'table',
  'newBtn',
] as const

const LIST_TARGETS: Record<(typeof LIST_STEP_KEYS)[number], string> = {
  title: '#page-section-title',
  search: '#locazioni-search-filter',
  situation: '#locazioni-situation-filter',
  owner: '#locazioni-owner-filter',
  tenant: '#locazioni-tenant-filter',
  ownerAgent: '#locazioni-ownerAgent-filter',
  tenantAgent: '#locazioni-tenantAgent-filter',
  stipulaDateFrom: '#locazioni-stipulaDateFrom-filter',
  stipulaDateTo: '#locazioni-stipulaDateTo-filter',
  startDateFrom: '#locazioni-startDateFrom-filter',
  startDateTo: '#locazioni-startDateTo-filter',
  onlyMine: '#locazioni-onlyMine-filter',
  table: '#locazioni-table',
  newBtn: '#locazioni-new-btn',
}

const DATI_FIELD_KEYS = [
  'number',
  'situation',
  'propertyId',
  'ownerIds',
  'tenantIds',
  'ownerAgentId',
  'tenantAgentId',
  'startDate',
  'endDate',
  'stipulaDate',
  'registeredAt',
  'renewalDueDate',
  'rentAmount',
  'condoFee',
  'depositAmount',
  'dueDay',
  'adjustmentIndex',
  'noticeDays',
  'notes',
] as const

export const MODAL_TOUR_START_STEP = LIST_STEP_KEYS.length
const DATI_TOUR_START_STEP = MODAL_TOUR_START_STEP + 1
const ALLEGATI_TOUR_START_STEP = DATI_TOUR_START_STEP + DATI_FIELD_KEYS.length
const STORICO_TOUR_START_STEP = ALLEGATI_TOUR_START_STEP + 1
export const ACTIONS_TOUR_STEP = STORICO_TOUR_START_STEP + 1

export function getLocazioniTourActiveTab(stepIndex: number): string {
  if (stepIndex < ALLEGATI_TOUR_START_STEP) return 'dati'
  if (stepIndex < STORICO_TOUR_START_STEP) return 'allegati'
  return 'storico'
}

function buildListSteps(t: TFunction<'operazioni'>): Step[] {
  return LIST_STEP_KEYS.map((key) => ({
    target: LIST_TARGETS[key],
    title: t(`tour.locazioni.list.${key}.title`),
    content: t(`tour.locazioni.list.${key}.content`),
    placement: (key === 'table' ? 'top' : 'bottom') as Step['placement'],
  }))
}

function buildModalSteps(t: TFunction<'operazioni'>): Step[] {
  const datiSteps: Step[] = DATI_FIELD_KEYS.map((field) => ({
    target: `#modal-field-${field}`,
    title: t(`tour.locazioni.modal.fields.${field}.title`),
    content: t(`tour.locazioni.modal.fields.${field}.content`),
    placement: 'auto',
  }))

  return [
    {
      target: '#modal-locazioni-form',
      title: t('tour.locazioni.modal.intro.title'),
      content: t('tour.locazioni.modal.intro.content'),
      placement: 'center',
    },
    ...datiSteps,
    {
      target: '#modal-locazioni-tab-allegati',
      title: t('tour.locazioni.modal.allegati.title'),
      content: t('tour.locazioni.modal.allegati.content'),
      placement: 'center',
    },
    {
      target: '#modal-locazioni-tab-storico',
      title: t('tour.locazioni.modal.storico.title'),
      content: t('tour.locazioni.modal.storico.content'),
      placement: 'center',
    },
    {
      target: '#modal-btn-actions',
      title: t('tour.locazioni.modal.actions.title'),
      content: t('tour.locazioni.modal.actions.content'),
      placement: 'top',
    },
  ]
}

export function useLocazioniTour() {
  const { t } = useTranslation('operazioni')
  const steps = [...buildListSteps(t), ...buildModalSteps(t)]

  return useTour({ steps })
}
