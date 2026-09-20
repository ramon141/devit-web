import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

const base = 'font-semibold text-sm transition-transform hover:-translate-y-0.5'

function PillButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`${base} rounded-full px-5 py-2.5`}
      style={{ backgroundColor: '#ffcc00', color: '#0b0b0b' }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`${base} rounded-lg px-6 py-3`}
      style={{ backgroundColor: '#0b0b0b', color: '#fbf7ef' }}
    >
      {children}
    </button>
  )
}

function OutlineButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`${base} rounded-lg border px-5 py-2.5`}
      style={{ borderColor: 'rgba(11,11,11,.16)', color: '#0b0b0b' }}
    >
      {children}
    </button>
  )
}

function GhostButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`${base} rounded-lg px-4 py-2.5`}
      style={{ color: '#514b40' }}
    >
      {children}
    </button>
  )
}

function ButtonsSection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section id="buttons" title={t('buttons.title')} description={t('buttons.description')}>
      <div className="flex flex-wrap items-center gap-3">
        <PillButton>{t('buttons.pill')}</PillButton>
        <PrimaryButton>{t('buttons.primary')}</PrimaryButton>
        <OutlineButton>{t('buttons.outline')}</OutlineButton>
        <GhostButton>{t('buttons.ghost')}</GhostButton>
      </div>
    </Section>
  )
}

export default ButtonsSection
