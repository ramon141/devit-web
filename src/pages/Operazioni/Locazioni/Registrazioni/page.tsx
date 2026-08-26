import SectionPage from '@/components/layout/SectionPage'
import Registrazioni from '@/pages/Operazioni/Locazioni/Registrazioni'

function RegistrazioniPage() {
  return (
    <SectionPage
      title="Registrazioni"
      description="Registrazione e rinnovo dei contratti di locazione"
      parentLabel="Operazioni"
      parentPath="/gestionale/operazioni/vendite"
    >
      <Registrazioni />
    </SectionPage>
  )
}

export default RegistrazioniPage
