import SectionPage from '@/components/layout/SectionPage'
import Leads from '@/pages/Clientes/Leads'

function LeadsPage() {
  return (
    <SectionPage
      title="Richieste"
      description="Funnel di captazione dei contatti"
      parentLabel="Clienti"
      parentPath="/gestionale/clienti"
    >
      <Leads />
    </SectionPage>
  )
}

export default LeadsPage
