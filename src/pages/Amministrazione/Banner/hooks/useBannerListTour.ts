import { useTranslation } from 'react-i18next'
import type { Step } from 'react-joyride'
import { useTour } from '@/hooks/useTour'

export function useBannerListTour() {
  const { t } = useTranslation('amministrazione')

  const steps: Step[] = [
    {
      target: '#page-section-title',
      title: t('tour.banner.list.title.title'),
      content: t('tour.banner.list.title.content'),
      placement: 'bottom',
    },
    {
      target: '#banner-search-filter',
      title: t('tour.banner.list.search.title'),
      content: t('tour.banner.list.search.content'),
      placement: 'bottom',
    },
    {
      target: '#banner-carousel',
      title: t('tour.banner.list.carousel.title'),
      content: t('tour.banner.list.carousel.content'),
      placement: 'top',
    },
    {
      target: '#banner-new-btn',
      title: t('tour.banner.list.newBtn.title'),
      content: t('tour.banner.list.newBtn.content'),
      placement: 'bottom',
    },
  ]

  return useTour({ steps })
}
