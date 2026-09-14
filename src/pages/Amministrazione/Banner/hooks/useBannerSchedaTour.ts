import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

const FIELD_KEYS = [
  'image',
  'mobileImage',
  'title',
  'subtitle',
  'targetLink',
  'displayOrder',
  'startDate',
  'endDate',
  'active',
] as const

export function useBannerSchedaTour() {
  const { t } = useTranslation('amministrazione')

  const fieldSteps: Step[] = FIELD_KEYS.map((field) => ({
    target: `#banner-field-${field}`,
    title: t(`tour.banner.scheda.fields.${field}.title`),
    content: t(`tour.banner.scheda.fields.${field}.content`),
    placement: 'auto',
  }))

  const steps: Step[] = [
    {
      target: '#page-section-title',
      title: t('tour.banner.scheda.intro.title'),
      content: t('tour.banner.scheda.intro.content'),
      placement: 'bottom',
    },
    ...fieldSteps,
    {
      target: '#banner-form-actions',
      title: t('tour.banner.scheda.actions.title'),
      content: t('tour.banner.scheda.actions.content'),
      placement: 'top',
    },
  ]

  return useTour({ steps })
}
