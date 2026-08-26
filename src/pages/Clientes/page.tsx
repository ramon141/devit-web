import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Anagrafica from '@/pages/Clientes/Anagrafica'

function ClientiPage() {
  const { t } = useTranslation('clientes')

  return (
    <SectionPage
      title={t('page.title')}
      description={t('page.description')}
      parentLabel={t('page.parentLabel')}
      parentPath="/gestionale/clienti"
    >
      <Anagrafica />
    </SectionPage>
  )
}

export default ClientiPage
