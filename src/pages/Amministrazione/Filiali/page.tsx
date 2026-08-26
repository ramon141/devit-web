import SectionPage from '@/components/layout/SectionPage'
import Filiali from '@/pages/Amministrazione/Filiali'

function FilialiPage() {
  return (
    <SectionPage
      title="Filiali"
      description="Gestisci le filiali dell'agenzia"
      parentLabel="Amministrazione"
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Filiali />
    </SectionPage>
  )
}

export default FilialiPage
