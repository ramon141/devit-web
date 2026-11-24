import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import VideoHome from '@/pages/Amministrazione/VideoHome'

function VideoHomePage() {
  const { t } = useTranslation('amministrazione')

  return (
    <SectionPage
      title={t('videoHomePage.title')}
      description={t('videoHomePage.description')}
    >
      <VideoHome />
    </SectionPage>
  )
}

export default VideoHomePage
