import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Registrazioni from '@/pages/Operazioni/Locazioni/Registrazioni'

function RegistrazioniPage() {
  const { t } = useTranslation('operazioni')

  return (
    <SectionPage
      title={t('locazioni.registrazioni.page.title')}
      description={t('locazioni.registrazioni.page.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/operazioni/vendite"
    >
      <Registrazioni />
    </SectionPage>
  )
}

export default RegistrazioniPage
