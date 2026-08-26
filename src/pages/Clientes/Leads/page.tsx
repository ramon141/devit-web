import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Leads from '@/pages/Clientes/Leads'

function LeadsPage() {
  const { t } = useTranslation('clientes')

  return (
    <SectionPage
      title={t('leadsPage.title')}
      description={t('leadsPage.description')}
      parentLabel={t('leadsPage.parentLabel')}
      parentPath="/gestionale/clienti"
    >
      <Leads />
    </SectionPage>
  )
}

export default LeadsPage
