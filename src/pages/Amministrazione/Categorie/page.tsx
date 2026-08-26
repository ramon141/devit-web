import SectionPage from '@/components/layout/SectionPage'
import Categorie from '@/pages/Amministrazione/Categorie'

function CategoriePage() {
  return (
    <SectionPage
      title="Categorie"
      description="Gestisci le categorie di immobile"
      parentLabel="Amministrazione"
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Categorie />
    </SectionPage>
  )
}

export default CategoriePage
