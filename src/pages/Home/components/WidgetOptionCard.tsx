import { CheckIcon, PlusIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { WidgetId } from '@/pages/Home/hooks/useDashboardWidgets'

type WidgetOptionCardProps = {
  id: WidgetId
  icon: ComponentType<{ className?: string }>
  isAdding: boolean
  onAdd: (id: WidgetId) => void
}

// Cartão de um widget no modal de seleção; some com animação ao ser adicionado
function WidgetOptionCard({ id, icon: Icon, isAdding, onAdd }: WidgetOptionCardProps) {
  const { t } = useTranslation('home')

  const stateClass = isAdding
    ? 'scale-90 border-primary bg-accent opacity-0'
    : 'hover:border-primary hover:bg-accent/40'

  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border bg-card p-4 transition-all duration-300 ${stateClass}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-foreground">
          <Icon className="size-5" />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-semibold">{t(`tour.${id}.title`)}</p>

          <p className="text-xs text-muted-foreground">{t(`tour.${id}.content`)}</p>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="mt-auto self-end"
        onClick={() => onAdd(id)}
      >
        {isAdding ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <PlusIcon data-icon="inline-start" />
        )}
        {t('widgetSelection.add')}
      </Button>
    </div>
  )
}

export default WidgetOptionCard
