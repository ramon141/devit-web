import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

export function useAuditTour() {
  const { t } = useTranslation('amministrazione')

  const steps: Step[] = [
    {
      target: '#page-section-title',
      title: t('tour.audit.title.title'),
      content: t('tour.audit.title.content'),
      placement: 'bottom',
    },
    {
      target: '#audit-table',
      title: t('tour.audit.table.title'),
      content: t('tour.audit.table.content'),
      placement: 'top',
    },
  ]

  return useTour({ steps })
}
