import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Locazioni from '@/pages/Operazioni/Locazioni'

function LocazioniPage() {
  const { t } = useTranslation('operazioni')

  return (
    <SectionPage
      title={t('locazioni.page.title')}
      description={t('locazioni.page.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/operazioni/vendite"
    >
      <Locazioni />
    </SectionPage>
  )
}

export default LocazioniPage
