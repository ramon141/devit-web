import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import WidgetOptionCard from '@/pages/Home/components/WidgetOptionCard'
import { WIDGET_CATALOG } from '@/pages/Home/components/widgetCatalog'
import type { WidgetId } from '@/pages/Home/hooks/useDashboardWidgets'

type WidgetSelectionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  inactiveWidgets: WidgetId[]
  onAddWidget: (id: WidgetId) => void
}

const REMOVE_ANIMATION_MS = 350

// Modal "SELEÇÃO DE WIDGETS": grid com os widgets ainda não adicionados ao painel
function WidgetSelectionModal({
  open,
  onOpenChange,
  inactiveWidgets,
  onAddWidget,
}: WidgetSelectionModalProps) {
  const { t } = useTranslation('home')
  const [addingId, setAddingId] = useState<WidgetId | null>(null)

  // Anima o cartão saindo antes de efetivar a adição
  function handleAdd(id: WidgetId) {
    if (addingId) return

    setAddingId(id)

    setTimeout(() => {
      onAddWidget(id)
      setAddingId(null)
    }, REMOVE_ANIMATION_MS)
  }

  const options = WIDGET_CATALOG.filter((entry) => inactiveWidgets.includes(entry.id))

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={t('widgetSelection.title')}
      description={t('widgetSelection.description')}
      widthClassName="w-full sm:max-w-[1000px]"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map(({ id, icon }) => (
          <WidgetOptionCard
            key={id}
            id={id}
            icon={icon}
            isAdding={addingId === id}
            onAdd={handleAdd}
          />
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
