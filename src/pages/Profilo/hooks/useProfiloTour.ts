import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

export function useProfiloTour() {
  const { t } = useTranslation('profilo')

  const steps: Step[] = [
    {
      target: '#page-section-title',
      title: t('tour.title.title'),
      content: t('tour.title.content'),
      placement: 'bottom',
    },
    {
      target: '#profilo-form-fields',
      title: t('tour.formFields.title'),
      content: t('tour.formFields.content'),
      placement: 'top',
    },
    {
      target: '#profilo-language-field',
      title: t('tour.language.title'),
      content: t('tour.language.content'),
      placement: 'top',
    },
    {
      target: '#profilo-save-btn',
      title: t('tour.save.title'),
      content: t('tour.save.content'),
      placement: 'top',
    },
  ]

  return useTour({ steps })
}
