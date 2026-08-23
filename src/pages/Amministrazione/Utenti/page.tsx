import SectionPage from '@/components/layout/SectionPage'
import Utenti from '@/pages/Amministrazione/Utenti'

function UtentiPage() {
  return (
    <SectionPage
      title="Utenti"
      description="Gestisci gli utenti dell'agenzia"
      parentLabel="Amministrazione"
      parentPath="/amministrazione/utenti"
    >
      <Utenti />
    </SectionPage>
  )
}

export default UtentiPage
