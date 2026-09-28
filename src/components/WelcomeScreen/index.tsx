import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WelcomeChart from '@/components/WelcomeScreen/WelcomeChart'
import WelcomeWords from '@/components/WelcomeScreen/WelcomeWords'

const WORD_INTERVAL_MS = 400
const COMPLETE_DELAY_MS = 900
const FADE_OUT_MS = 300

type WelcomeScreenProps = {
  onComplete: () => void
}

function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { t } = useTranslation('login')
  const words = t('welcomeScreen.title').split(' ')
  const [visibleCount, setVisibleCount] = useState(0)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (visibleCount < words.length) {
      const timer = setTimeout(() => setVisibleCount((prev) => prev + 1), WORD_INTERVAL_MS)
      return () => clearTimeout(timer)
    }

    const closeTimer = setTimeout(() => setClosing(true), COMPLETE_DELAY_MS)
    return () => clearTimeout(closeTimer)
  }, [visibleCount, words.length])

  useEffect(() => {
    if (!closing) return

    const timer = setTimeout(onComplete, FADE_OUT_MS)
    return () => clearTimeout(timer)
  }, [closing, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background transition-opacity duration-300 ${
        closing ? 'opacity-0' : 'animate-[wlc-fade-in_0.3s_ease-out_forwards]'
      }`}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[640px] w-[640px] rounded-full bg-primary/10 blur-3xl animate-[wlc-glow_1.5s_ease-out_forwards]"
        style={{ opacity: 0 }}
      />

      <div className="relative z-10 flex flex-col items-center gap-9 px-6">
        <WelcomeChart />
        <WelcomeWords words={words} visibleCount={visibleCount} />

        <div
          className="animate-[wlc-badge-in_0.5s_ease-out_forwards] rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold tracking-wide opacity-0"
          style={{ animationDelay: '1.6s' }}
        >
          <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
            {t('welcomeScreen.badge')}
          </span>
        </div>

        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full animate-[wlc-progress_2.6s_linear_forwards] bg-gradient-to-r from-primary via-amber-400 to-primary" />
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
