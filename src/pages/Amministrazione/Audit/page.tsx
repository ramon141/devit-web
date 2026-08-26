import SectionPage from '@/components/layout/SectionPage'
import Audit from '@/pages/Amministrazione/Audit'

function AuditPage() {
  return (
    <SectionPage
      title="Log di audit"
      description="Cronologia delle azioni nel sistema"
      parentLabel="Amministrazione"
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Audit />
    </SectionPage>
  )
}

export default AuditPage
