import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

function Tag({
  children,
  bg,
  color,
}: {
  children: string
  bg: string
  color: string
}) {
  return (
    <span
      className="rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest"
      style={{ backgroundColor: bg, color }}
    >
      {children}
    </span>
  )
}

function BadgesSection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section id="badges" title={t('badges.title')} description={t('badges.description')}>
      <div className="flex flex-wrap items-center gap-3">
        <Tag bg="rgba(255,204,0,.22)" color="#8a6c00">
          {t('badges.sale')}
        </Tag>
        <Tag bg="rgba(255,204,0,.4)" color="#6b5400">
          {t('badges.rent')}
        </Tag>
        <span
          className="rounded-md px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider"
          style={{ backgroundColor: '#f4efe6', color: '#8b8478' }}
        >
          {t('badges.reference')}
        </span>
      </div>

      <p
        className="font-mono text-[11px] uppercase tracking-wider"
        style={{ color: '#8b8478' }}
      >
        {t('badges.breadcrumbHome')} / {t('badges.breadcrumbList')} /{' '}
        <span style={{ color: '#0b0b0b', fontWeight: 600 }}>
          {t('badges.breadcrumbCurrent')}
        </span>
      </p>
    </Section>
  )
}

export default BadgesSection
