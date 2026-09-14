import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

type StepDef = { target: string; placement: Step['placement']; key: string }

const STEP_DEFS: StepDef[] = [
  { target: '#page-section-title', placement: 'bottom', key: 'title' },
  { target: '#proprieta-search-filter', placement: 'bottom', key: 'search' },
  { target: '#proprieta-new-btn', placement: 'bottom', key: 'newBtn' },
  { target: '#proprieta-kind-tabs', placement: 'bottom', key: 'kindTabs' },
  { target: '#proprieta-category-filter', placement: 'bottom', key: 'category' },
  { target: '#proprieta-purpose-filter', placement: 'bottom', key: 'purpose' },
  { target: '#proprieta-status-filter', placement: 'bottom', key: 'status' },
  { target: '#proprieta-priceMin-filter', placement: 'bottom', key: 'priceMin' },
  { target: '#proprieta-priceMax-filter', placement: 'bottom', key: 'priceMax' },
  { target: '#proprieta-advanced-filters-btn', placement: 'bottom', key: 'advancedFilters' },
  { target: '#proprieta-view-toggle', placement: 'left', key: 'viewToggle' },
  { target: '#proprieta-table', placement: 'top', key: 'table' },
]

function buildSteps(t: TFunction<'imoveis'>): Step[] {
  return STEP_DEFS.map(({ key, ...step }) => ({
    ...step,
    title: t(`tour.list.${key}.title`),
    content: t(`tour.list.${key}.content`),
  }))
}

export function useProprietaTour() {
  const { t } = useTranslation('imoveis')
  return useTour({ steps: buildSteps(t) })
}
