import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

const STEP_KEYS = ['title', 'dashboardTab', 'inviaTab', 'storicoTab', 'modelliTab', 'rimozioniTab'] as const
const STEP_TARGETS = [
  '#page-section-title',
  '#marketing-tab-dashboard',
  '#marketing-tab-invia',
  '#marketing-tab-storico',
  '#marketing-tab-modelli',
  '#marketing-tab-rimozioni',
] as const

function buildSteps(t: TFunction<'marketing'>): Step[] {
  return STEP_TARGETS.map((target, index) => ({
    target,
    title: t(`tour.${STEP_KEYS[index]}.title`),
    content: t(`tour.${STEP_KEYS[index]}.content`),
    placement: 'bottom' as Step['placement'],
  }))
}

export function useMarketingTour() {
  const { t } = useTranslation('marketing')
  return useTour({ steps: buildSteps(t) })
}
