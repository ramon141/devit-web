import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const COOKIE_CONSENT_KEY = 'site_cookie_consent'
const COOKIE_PREFERENCES_KEY = 'site_cookie_preferences'

function CookieBanner() {
  const { t } = useTranslation('site')
  const [visible, setVisible] = useState(() => !localStorage.getItem(COOKIE_CONSENT_KEY))
  const [customizing, setCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  function choose(value: string) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value)
    setVisible(false)
  }

  function savePreferences() {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify({ necessary: true, analytics }))
    choose('customized')
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-site-line bg-site-cream-light/95 p-4 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2">
          <p className="font-semibold">{t('cookieBanner.title')}</p>
          <p className="text-sm text-site-ink-soft">{t('cookieBanner.description')}</p>

          {customizing && (
            <div className="grid gap-2 text-sm">
              <label className="flex items-center gap-2 opacity-70">
                <Checkbox checked disabled />
                {t('cookieBanner.necessaryLabel')}
              </label>

              <label className="flex items-center gap-2">
                <Checkbox
                  checked={analytics}
                  onCheckedChange={(checked) => setAnalytics(checked === true)}
                />
                {t('cookieBanner.analyticsLabel')}
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {customizing ? (
            <Button variant="outline" size="sm" onClick={savePreferences}>
              {t('cookieBanner.savePreferences')}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setCustomizing(true)}>
              {t('cookieBanner.customize')}
            </Button>
          )}
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
