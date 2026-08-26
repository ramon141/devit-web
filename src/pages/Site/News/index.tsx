import { useTranslation } from 'react-i18next'

function News() {
  const { t } = useTranslation('site')

  return (
    <div className="mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">{t('news.title')}</h1>

      <p className="mt-4 text-sm text-muted-foreground">
        {t('news.body')}
      </p>
    </div>
  )
}

export default News
