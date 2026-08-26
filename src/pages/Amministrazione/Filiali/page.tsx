import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Filiali from '@/pages/Amministrazione/Filiali'

function FilialiPage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('filialiPage.title')}
      description={t('filialiPage.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Filiali />
    </SectionPage>
  )
}

export default FilialiPage
