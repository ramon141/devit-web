import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import ActionsMenu from '@/components/ActionsMenu'
import CollapsibleSection from '@/pages/Home/components/CollapsibleSection'
import { useWidgetMenuItems } from '@/pages/Home/hooks/useWidgetMenuItems'
import { useWidgetResize } from '@/pages/Home/hooks/useWidgetResize'
import type { WidgetId, WidgetLayout } from '@/pages/Home/hooks/useDashboardWidgets'

type DashboardWidgetProps = {
  widget: WidgetLayout
  widthPercent: number
  onResize: (id: WidgetId, percent: number) => void
  onRemove: (id: WidgetId) => void
  onChange: (id: WidgetId, changes: Partial<Omit<WidgetLayout, 'id'>>) => void
  children: ReactNode
}

// pr-12 no cabeçalho dos cards reserva o espaço do menu e não cobre o contador
const WIDGET_CLASS = [
  'relative w-full md:w-(--widget-width)',
  '[&_[data-slot=card-header]]:pr-12',
].join(' ')

const TITLE_BAR_CLASS = [
  'rounded-xl border bg-card px-4 py-3 pr-12 font-medium',
  "before:content-[attr(data-title)]",
].join(' ')

const RESIZE_HANDLE_CLASS = [
  'absolute top-0 right-0 z-10 h-full w-2 touch-none rounded-r-xl',
  'cursor-ew-resize hover:bg-primary/25',
].join(' ')

// Envolve cada widget do painel com o menu de recolher/expandir e remover
function DashboardWidget({
  widget,
  widthPercent,
  onResize,
  onRemove,
  onChange,
  children,
}: DashboardWidgetProps) {
  const { t } = useTranslation('home')
  const { id, collapsed } = widget

  const resize = useWidgetResize(widthPercent, (next) => onResize(id, next))

  const { items, removing } = useWidgetMenuItems(widget, onChange, onRemove)

  const gap = `${1 - resize.percent / 100} * var(--widget-gap)`

  const widthStyle = {
    '--widget-width': `calc(${resize.percent}% - ${gap})`,
  } as CSSProperties

  return (
    <div
      id={`home-card-${id}`}
      className={`${WIDGET_CLASS} ${resize.isResizing ? 'select-none' : ''}`}
      style={widthStyle}
    >
      <div className="absolute top-2 right-2 z-10">
        <ActionsMenu items={items} ariaLabel={t('widgetMenu.label')} />
      </div>

      <CollapsibleSection open={!removing}>
        <CollapsibleSection open={collapsed}>
          {/* título via atributo: evita duplicar o texto do card no DOM */}
          <div
            data-title={t(`tour.${id}.title`)}
            className={TITLE_BAR_CLASS}
          />
        </CollapsibleSection>

        <CollapsibleSection open={!collapsed}>{children}</CollapsibleSection>
      </CollapsibleSection>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={t('widgetMenu.resize')}
        className={RESIZE_HANDLE_CLASS}
        {...resize.handlers}
      />
    </div>
  )
}

export default DashboardWidget
