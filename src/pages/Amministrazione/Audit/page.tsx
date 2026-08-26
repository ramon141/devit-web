import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Audit from '@/pages/Amministrazione/Audit'

function AuditPage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('auditPage.title')}
      description={t('auditPage.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Audit />
    </SectionPage>
  )
}

export default AuditPage
