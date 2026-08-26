import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import AdeguamentiCanone from '@/pages/Operazioni/Locazioni/Adeguamenti'

function AdeguamentiCanonePage() {
  const { t } = useTranslation('operazioni')

  return (
    <SectionPage
      title={t('locazioni.adeguamenti.page.title')}
      description={t('locazioni.adeguamenti.page.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/operazioni/vendite"
    >
      <AdeguamentiCanone />
    </SectionPage>
  )
}

export default AdeguamentiCanonePage
