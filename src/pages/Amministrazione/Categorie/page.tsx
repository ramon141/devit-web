import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Categorie from '@/pages/Amministrazione/Categorie'

function CategoriePage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('categoriePage.title')}
      description={t('categoriePage.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Categorie />
    </SectionPage>
  )
}

export default CategoriePage
