import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import VideoHome from '@/pages/Amministrazione/VideoHome'

function VideoHomePage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('videoHomePage.title')}
      description={t('videoHomePage.description')}
      parentLabel={t('common.parentLabel')}
      parentPath="/gestionale/amministrazione/utenti"
    >
      <VideoHome />
    </SectionPage>
  )
}

export default VideoHomePage
