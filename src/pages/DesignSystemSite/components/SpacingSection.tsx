import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

const scale = [
  { label: '1× — 4px', width: 4 },
  { label: '4× — 16px', width: 16 },
  { label: '8× — 32px', width: 32 },
  { label: '16× — 64px', width: 64 },
  { label: 'gutter — clamp(20,5vw,64)', width: 96 },
]

const breakpoints = ['sm 40rem', 'md 48rem', 'lg 64rem', 'xl 80rem', '2xl 96rem']

function SpacingSection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section id="spacing" title={t('spacing.title')} description={t('spacing.description')}>
      <div className="flex flex-col gap-2.5">
        {scale.map((row) => (
          <div key={row.label} className="flex items-center gap-3.5">
            <span className="w-52 shrink-0 font-mono text-[11px]" style={{ color: '#514b40' }}>
              {row.label}
            </span>
            <span
              className="h-2.5 rounded-sm"
              style={{ width: row.width, backgroundColor: '#ffcc00' }}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {breakpoints.map((bp) => (
          <span
            key={bp}
            className="rounded-md px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider"
            style={{ backgroundColor: '#f4efe6', color: '#8b8478' }}
          >
            {bp}
          </span>
        ))}
      </div>
    </Section>
  )
}

export default SpacingSection
