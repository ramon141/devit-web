import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import ZonePage from '@/pages/Amministrazione/Zone'

function ZonePageWrapper() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('zonePage.title')}
      description={t('zonePage.description')}
    >
      <ZonePage />
    </SectionPage>
  )
}

export default ZonePageWrapper
