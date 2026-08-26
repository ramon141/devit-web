import { useTranslation } from 'react-i18next'

function PrivacyCookies() {
  const { t } = useTranslation('site')

  return (
    <div className="mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">{t('privacyCookies.title')}</h1>

      <p className="mt-4 text-sm text-muted-foreground">
        {t('privacyCookies.intro')}
      </p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">{t('privacyCookies.purpose.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('privacyCookies.purpose.body')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">{t('privacyCookies.rights.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('privacyCookies.rights.body')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">{t('privacyCookies.retention.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('privacyCookies.retention.body')}
        </p>
      </section>
    </div>
  )
}

export default PrivacyCookies
