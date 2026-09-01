import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Proprietari from '@/pages/Amministrazione/Proprietari'

function ProprietariPage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('proprietariPage.title')}
      description={t('proprietariPage.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/amministrazione/utenti"
    >
      <Proprietari />
    </SectionPage>
  )
}

export default ProprietariPage
