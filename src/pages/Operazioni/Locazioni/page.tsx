import SectionPage from '@/components/layout/SectionPage'
import Locazioni from '@/pages/Operazioni/Locazioni'

function LocazioniPage() {
  return (
    <SectionPage
      title="Locazioni"
      description="Gestisci i contratti di locazione"
      parentLabel="Operazioni"
      parentPath="/gestionale/operazioni/vendite"
    >
      <Locazioni />
    </SectionPage>
  )
}

export default LocazioniPage
