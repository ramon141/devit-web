import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

function SiteTag({ children }: { children: string }) {
  return (
    <span
      className="rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest"
      style={{ backgroundColor: 'rgba(255,204,0,.35)', color: '#6b5400' }}
    >
      {children}
    </span>
  )
}

function PropertyCardSection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section
      id="property-card"
      title={t('propertyCard.title')}
      description={t('propertyCard.description')}
    >
      <div className="relative w-64 rounded-xl border bg-white pt-3">
        <div
          className="relative mx-2.5 h-36 rounded-lg"
          style={{ background: 'linear-gradient(135deg,#d8d2c4,#c7c0af)' }}
        >
          <div className="absolute left-2.5 top-2.5">
            <SiteTag>{t('propertyCard.sale')}</SiteTag>
          </div>
        </div>
        <div className="px-4 pb-4 pt-3.5">
          <p
            className="mb-2 inline-block rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
            style={{ backgroundColor: '#f4efe6', color: '#8b8478' }}
          >
            {t('propertyCard.reference')}
          </p>
          <p className="text-[17px] leading-snug">{t('propertyCard.propertyTitle')}</p>
          <p className="mt-2 text-xl font-semibold">{t('propertyCard.propertyPrice')}</p>
        </div>
      </div>
    </Section>
  )
}

export default PropertyCardSection
