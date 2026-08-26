import { useTranslation } from 'react-i18next'
import BranchList from '@/pages/Site/ChiSiamo/components/BranchList'

function ChiSiamo() {
  const { t } = useTranslation('site')

  return (
    <div className="mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">{t('chiSiamo.title')}</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{t('chiSiamo.origins.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('chiSiamo.origins.body')}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{t('chiSiamo.offices.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('chiSiamo.offices.body')}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{t('chiSiamo.goals.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('chiSiamo.goals.body')}
        </p>
      </section>

      <BranchList />
    </div>
  )
}

export default ChiSiamo
