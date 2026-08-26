import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Banner from '@/pages/Amministrazione/Banner'

function BannerPage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('bannerPage.title')}
      description={t('bannerPage.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Banner />
    </SectionPage>
  )
}

export default BannerPage
