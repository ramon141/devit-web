import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

function useSteps(): Step[] {
  const { t } = useTranslation('operazioni')

  return [
    {
      target: '#page-section-title',
      title: t('tour.adeguamenti.title.title'),
      content: t('tour.adeguamenti.title.content'),
      placement: 'bottom',
    },
    {
      target: '#adeguamenti-index-filter',
      title: t('tour.adeguamenti.indexPercent.title'),
      content: t('tour.adeguamenti.indexPercent.content'),
      placement: 'bottom',
    },
    {
      target: '#adeguamenti-generate-btn',
      title: t('tour.adeguamenti.generateBtn.title'),
      content: t('tour.adeguamenti.generateBtn.content'),
      placement: 'bottom',
    },
    {
      target: '#adeguamenti-eligible-table',
      title: t('tour.adeguamenti.eligibleTable.title'),
      content: t('tour.adeguamenti.eligibleTable.content'),
      placement: 'top',
    },
    {
      target: '#adeguamenti-generated-table',
      title: t('tour.adeguamenti.generatedTable.title'),
      content: t('tour.adeguamenti.generatedTable.content'),
      placement: 'top',
    },
  ]
}

export function useAdeguamentiTour() {
  return useTour({ steps: useSteps() })
}
