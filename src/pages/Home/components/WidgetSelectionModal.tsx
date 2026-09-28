import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WIDGET_CATALOG } from '@/pages/Home/components/widgetCatalog'
import type { WidgetId } from '@/pages/Home/hooks/useDashboardWidgets'

type WidgetSelectionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  inactiveWidgets: WidgetId[]
  onAddWidget: (id: WidgetId) => void
}

// Modal "SELEÇÃO DE WIDGETS": grid com os widgets ainda não adicionados ao painel
function WidgetSelectionModal({
  open,
  onOpenChange,
  inactiveWidgets,
  onAddWidget,
}: WidgetSelectionModalProps) {
  const { t } = useTranslation('home')

  const options = WIDGET_CATALOG.filter((entry) => inactiveWidgets.includes(entry.id))

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={t('widgetSelection.title')}
      description={t('widgetSelection.description')}
      wide
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {options.map(({ id, icon: Icon }) => (
          <Card key={id}>
            <CardContent className="flex h-full flex-col gap-2">
              <Icon className="size-5 text-muted-foreground" />

              <p className="font-medium">{t(`tour.${id}.title`)}</p>

              <p className="flex-1 text-sm text-muted-foreground">
                {t(`tour.${id}.content`)}
              </p>

              <Button size="sm" onClick={() => onAddWidget(id)}>
                {t('widgetSelection.add')}
              </Button>
            </CardContent>
          </Card>
        ))}

        {options.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">
            {t('widgetSelection.empty')}
          </p>
        )}
      </div>
    </ModalRegister>
  )
}

export default WidgetSelectionModal
