import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'site_cookie_consent'

// ponytail: banner só grava a escolha, sem central de preferências por categoria de cookie
function CookieBanner() {
  const { t } = useTranslation('site')
  const [visible, setVisible] = useState(() => !localStorage.getItem(COOKIE_CONSENT_KEY))

  function choose(value: string) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-site-line bg-site-cream-light/95 p-4 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{t('cookieBanner.title')}</p>
          <p className="text-sm text-site-ink-soft">{t('cookieBanner.description')}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => choose('customized')}>
            {t('cookieBanner.customize')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => choose('rejected')}>
            {t('cookieBanner.rejectAll')}
          </Button>
          <Button size="sm" onClick={() => choose('accepted')}>
            {t('cookieBanner.acceptAll')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
