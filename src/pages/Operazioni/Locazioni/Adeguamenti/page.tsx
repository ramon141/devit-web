import SectionPage from '@/components/layout/SectionPage'
import AdeguamentiCanone from '@/pages/Operazioni/Locazioni/Adeguamenti'

function AdeguamentiCanonePage() {
  return (
    <SectionPage
      title="Adeguamento canone"
      description="Genera le comunicazioni di adeguamento del canone di locazione"
      parentLabel="Operazioni"
      parentPath="/operazioni/vendite"
    >
      <AdeguamentiCanone />
    </SectionPage>
  )
}

export default AdeguamentiCanonePage
