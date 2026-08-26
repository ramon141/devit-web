import SectionPage from '@/components/layout/SectionPage'
import Scadenziario from '@/pages/Operazioni/Locazioni/Scadenziario'

function ScadenziarioPage() {
  return (
    <SectionPage
      title="Scadenziario"
      description="Contratti di locazione in scadenza"
      parentLabel="Operazioni"
      parentPath="/operazioni/vendite"
    >
      <Scadenziario />
    </SectionPage>
  )
}

export default ScadenziarioPage
