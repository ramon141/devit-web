import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Utenti from '@/pages/Amministrazione/Utenti'

function UtentiPage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('utentiPage.title')}
      description={t('utentiPage.description')}
    >
      <Utenti />
    </SectionPage>
  )
}

export default UtentiPage
