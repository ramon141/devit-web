import SectionPage from '@/components/layout/SectionPage'
import Anagrafica from '@/pages/Clientes/Anagrafica'

function ClientiPage() {
  return (
    <SectionPage
      title="Clienti"
      description="Gestisci l'anagrafica di clienti e contatti"
      parentLabel="Clienti"
      parentPath="/clienti"
    >
      <Anagrafica />
    </SectionPage>
  )
}

export default ClientiPage
