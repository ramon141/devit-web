import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Scadenziario from '@/pages/Operazioni/Locazioni/Scadenziario'

function ScadenziarioPage() {
  const { t } = useTranslation('operazioni')

  return (
    <SectionPage
      title={t('locazioni.scadenziario.page.title')}
      description={t('locazioni.scadenziario.page.description')}
    >
      <Scadenziario />
    </SectionPage>
  )
}

export default ScadenziarioPage
