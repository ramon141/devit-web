import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

function useSteps(): Step[] {
  const { t } = useTranslation('operazioni')

  return [
    {
      target: '#page-section-title',
      title: t('tour.registrazioni.title.title'),
      content: t('tour.registrazioni.title.content'),
      placement: 'bottom',
    },
    {
      target: '#registrazioni-table',
      title: t('tour.registrazioni.table.title'),
      content: t('tour.registrazioni.table.content'),
      placement: 'top',
    },
  ]
}

export function useRegistrazioniTour() {
  return useTour({ steps: useSteps() })
}
