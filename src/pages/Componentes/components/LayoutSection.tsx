import { useTranslation } from 'react-i18next'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function LayoutSection() {
  const { t } = useTranslation('componentes')

  return (
    <ComponentSection
      id="layout"
      title={t('layout.title')}
      description={t('layout.description')}
    >
      <div className="flex h-40 w-full max-w-md overflow-hidden rounded-lg border border-border">
        <div className="flex w-16 flex-col gap-2 bg-sidebar p-2">
          <div className="h-3 w-8 rounded-sm bg-sidebar-primary" />
          <div className="h-2 w-10 rounded-sm bg-sidebar-foreground/20" />
          <div className="h-2 w-10 rounded-sm bg-sidebar-foreground/20" />
          <div className="h-2 w-10 rounded-sm bg-sidebar-foreground/20" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex h-8 items-center border-b border-border px-3">
            <div className="h-2 w-16 rounded-sm bg-foreground/20" />
          </div>
          <div className="flex-1 space-y-2 p-3">
            <div className="h-2 w-full rounded-sm bg-muted" />
            <div className="h-2 w-4/5 rounded-sm bg-muted" />
            <div className="h-10 w-full rounded-sm bg-muted" />
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{t('layout.note')}</p>
    </ComponentSection>
  )
}

export default LayoutSection
