import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Vendite from '@/pages/Operazioni/Vendite'

function VenditePage() {
  const { t } = useTranslation('operazioni')

  return (
    <SectionPage
      title={t('vendite.page.title')}
      description={t('vendite.page.description')}
    >
      <Vendite />
    </SectionPage>
  )
}

export default VenditePage
