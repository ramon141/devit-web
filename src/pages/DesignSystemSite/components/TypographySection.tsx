import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

function TypographySection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section
      id="typography"
      title={t('typography.title')}
      description={t('typography.description')}
    >
      <div className="flex flex-col divide-y">
        <div className="flex flex-wrap items-baseline gap-4 pb-4">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
            Fraunces
          </span>
          <span className="text-3xl" style={{ letterSpacing: '-1px' }}>
            {t('typography.displaySample')}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-4 py-4">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
            Manrope
          </span>
          <span className="max-w-prose text-base" style={{ color: '#514b40' }}>
            {t('typography.sansSample')}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-4 pt-4">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
            JetBrains Mono
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t('typography.monoSample')}
          </span>
        </div>
      </div>
    </Section>
  )
}

export default TypographySection
