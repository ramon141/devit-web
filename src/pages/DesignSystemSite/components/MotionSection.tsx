import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

function MotionChip({ children, duration }: { children: string; duration: string }) {
  return (
    <span
      className="cursor-default rounded-full border px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
      style={{
        borderColor: 'rgba(11,11,11,.16)',
        transitionDuration: duration,
        transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = '#ffcc00'
        event.currentTarget.style.borderColor = '#ffcc00'
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = 'transparent'
        event.currentTarget.style.borderColor = 'rgba(11,11,11,.16)'
      }}
    >
      {children}
    </span>
  )
}

function MotionSection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section id="motion" title={t('motion.title')} description={t('motion.description')}>
      <div className="flex flex-wrap gap-3">
        <MotionChip duration=".2s">fast · .2s</MotionChip>
        <MotionChip duration=".36s">normal · .36s</MotionChip>
        <MotionChip duration=".7s">slow · .7s</MotionChip>
      </div>
    </Section>
  )
}

export default MotionSection
