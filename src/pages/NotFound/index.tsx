import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

function NotFound() {
  const { t } = useTranslation('common')

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">{t('notFound.message')}</p>
      <Link to="/" className="text-primary underline">
        {t('notFound.backHome')}
      </Link>
    </section>
  )
}

export default NotFound
