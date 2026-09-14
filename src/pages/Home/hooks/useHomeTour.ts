import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

const STEP_TARGETS = [
  'page-section-title',
  'home-window-select',
  'home-card-todayAppointments',
  'home-card-recentProperties',
  'home-card-dormantProperties',
  'home-card-leadsByStatus',
  'home-card-leadsBySource',
  'home-card-conversionFunnel',
  'home-card-agentConversion',
  'home-card-propertiesByStatusPurpose',
  'home-card-avgTimeOnMarket',
  'home-card-incompleteProperties',
  'home-card-agentRanking',
  'home-card-appointmentsStatus',
  'home-card-upcomingRenewals',
] as const

const STEP_KEYS = [
  'title',
  'windowSelect',
  'todayAppointments',
  'recentProperties',
  'dormantProperties',
  'leadsByStatus',
  'leadsBySource',
  'conversionFunnel',
  'agentConversion',
  'propertiesByStatusPurpose',
  'avgTimeOnMarket',
  'incompleteProperties',
  'agentRanking',
  'appointmentsStatus',
  'upcomingRenewals',
] as const

function buildSteps(t: TFunction<'home'>): Step[] {
  return STEP_TARGETS.map((target, index) => ({
    target: `#${target}`,
    title: t(`tour.${STEP_KEYS[index]}.title`),
    content: t(`tour.${STEP_KEYS[index]}.content`),
    placement: (index === 0 ? 'bottom' : 'auto') as Step['placement'],
  }))
}

export function useHomeTour() {
  const { t } = useTranslation('home')
  return useTour({ steps: buildSteps(t) })
}
