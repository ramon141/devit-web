import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import Feedback from '@/pages/Clientes/Feedback'

function FeedbackPage() {
  const { t } = useTranslation('clientes')

  return (
    <SectionPage
      title={t('feedbackPage.title')}
      description={t('feedbackPage.description')}
    >
      <Feedback />
    </SectionPage>
  )
}

export default FeedbackPage
