import { useTranslation } from 'react-i18next'
import devitFavicon from '@/assets/logos/devit-favicon.png'
import WaveBackground from '@/pages/Login/components/WaveBackground'

function LoginPanel() {
  const { t } = useTranslation('login')

  return (
    <div className="relative flex w-[46%] shrink-0 flex-col items-center justify-center overflow-hidden px-10 py-14">
      <WaveBackground />

      <div className="relative z-10 flex flex-col items-center text-center">
        <img src={devitFavicon} alt="Devit" className="mb-6 size-16 rounded-2xl" />
        <p className="mb-1 text-base font-normal text-sidebar-foreground/70">
          {t('loginPanel.welcomeBack')}
        </p>
        <h1 className="mb-5 text-3xl font-semibold tracking-wide text-sidebar-foreground">
          {t('loginPanel.brand')}
        </h1>
        <p className="max-w-[220px] text-sm leading-relaxed text-sidebar-foreground/50">
          {t('loginPanel.tagline')}
        </p>
      </div>
    </div>
  )
}

export default LoginPanel
