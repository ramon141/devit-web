import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { WidgetId } from '@/pages/Home/hooks/useDashboardWidgets'

type DashboardWidgetProps = {
  id: WidgetId
  onRemove: (id: WidgetId) => void
  children: ReactNode
}

// Envolve cada widget do painel com o "x" que remove ele do dashboard
function DashboardWidget({ id, onRemove, children }: DashboardWidgetProps) {
  const { t } = useTranslation('home')

  return (
    <div id={`home-card-${id}`} className="relative">
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute -top-2 -right-2 z-10 rounded-full bg-background shadow"
        aria-label={t('widgetSelection.remove')}
        onClick={() => onRemove(id)}
      >
        <X className="size-4" />
      </Button>

      {children}
    </div>
  )
}

export default DashboardWidget
