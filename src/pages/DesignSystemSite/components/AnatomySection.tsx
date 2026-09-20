import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

function AnatomySection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section id="anatomy" title={t('anatomy.title')} description={t('anatomy.description')}>
      <div className="max-w-lg overflow-hidden rounded-lg border">
        <div
          className="px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider"
          style={{ backgroundColor: '#fbf7ef', color: '#8b8478', borderBottom: '1px solid rgba(11,11,11,.12)' }}
        >
          {t('anatomy.header')}
        </div>

        <div className="px-4 py-6" style={{ background: 'linear-gradient(135deg,#2b2620,#0b0b0b)' }}>
          <p className="font-mono text-[10.5px] uppercase tracking-widest" style={{ color: '#ffcc00' }}>
            {t('anatomy.eyebrow')}
          </p>
          <p className="mt-1.5 text-xl" style={{ color: '#f4efe6' }}>
            {t('anatomy.headline')}
          </p>
        </div>

        <div className="px-4 py-3.5 text-xs" style={{ backgroundColor: '#fbf7ef', color: '#514b40' }}>
          {t('anatomy.body')}
        </div>

        <div
          className="px-4 py-3.5 font-mono text-[10.5px] uppercase tracking-wider"
          style={{ backgroundColor: '#0b0b0b', color: '#f4efe6' }}
        >
          {t('anatomy.footer')}
        </div>
      </div>
    </Section>
  )
}

export default AnatomySection
