import SectionPage from '@/components/layout/SectionPage'
import Banner from '@/pages/Amministrazione/Banner'

function BannerPage() {
  return (
    <SectionPage
      title="Banner"
      description="Gestisci i banner della home"
      parentLabel="Amministrazione"
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Banner />
    </SectionPage>
  )
}

export default BannerPage
