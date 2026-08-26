import SectionPage from '@/components/layout/SectionPage'
import Vendite from '@/pages/Operazioni/Vendite'

function VenditePage() {
  return (
    <SectionPage
      title="Vendite"
      description="Gestisci le vendite dell'agenzia"
      parentLabel="Operazioni"
      parentPath="/gestionale/operazioni/vendite"
    >
      <Vendite />
    </SectionPage>
  )
}

export default VenditePage
