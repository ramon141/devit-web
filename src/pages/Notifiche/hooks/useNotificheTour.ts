import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

export function useNotificheTour() {
  const { t } = useTranslation('notifiche')

  const steps: Step[] = [
    {
      target: '#page-section-title',
      title: t('tour.title.title'),
      content: t('tour.title.content'),
      placement: 'bottom',
    },
    {
      target: '#notifiche-list',
      title: t('tour.list.title'),
      content: t('tour.list.content'),
      placement: 'top',
    },
    {
      target: '#notifiche-mark-read-btn',
      title: t('tour.markRead.title'),
      content: t('tour.markRead.content'),
      placement: 'left',
    },
  ]

  return useTour({ steps })
}
