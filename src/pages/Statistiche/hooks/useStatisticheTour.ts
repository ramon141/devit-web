import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

const STEP_KEYS = [
  'title',
  'leadsByStatus',
  'salesByStatus',
  'communicationsByChannel',
  'communicationsWindow',
  'communicationsSummary',
] as const

const STEP_TARGETS = [
  '#page-section-title',
  '#statistiche-card-leadsByStatus',
  '#statistiche-card-salesByStatus',
  '#statistiche-card-communicationsByChannel',
  '#statistiche-communicationsWindow-filter',
  '#statistiche-card-communicationsSummary',
] as const

function buildSteps(t: TFunction<'statistiche'>): Step[] {
  return STEP_TARGETS.map((target, index) => ({
    target,
    title: t(`tour.${STEP_KEYS[index]}.title`),
    content: t(`tour.${STEP_KEYS[index]}.content`),
    placement: 'auto' as Step['placement'],
  }))
}

export function useStatisticheTour() {
  const { t } = useTranslation('statistiche')
  return useTour({ steps: buildSteps(t) })
}
