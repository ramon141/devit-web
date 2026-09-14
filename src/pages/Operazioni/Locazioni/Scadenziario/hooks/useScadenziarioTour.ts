import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

function useSteps(): Step[] {
  const { t } = useTranslation('operazioni')

  return [
    {
      target: '#page-section-title',
      title: t('tour.scadenziario.title.title'),
      content: t('tour.scadenziario.title.content'),
      placement: 'bottom',
    },
    {
      target: '#scadenziario-days-filter',
      title: t('tour.scadenziario.days.title'),
      content: t('tour.scadenziario.days.content'),
      placement: 'bottom',
    },
    {
      target: '#scadenziario-table',
      title: t('tour.scadenziario.table.title'),
      content: t('tour.scadenziario.table.content'),
      placement: 'top',
    },
  ]
}

export function useScadenziarioTour() {
  return useTour({ steps: useSteps() })
}
