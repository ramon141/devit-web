import { useState } from 'react'
import { ChevronsDownUp, ChevronsUpDown, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ActionsMenuItem } from '@/components/ActionsMenu'
import type { WidgetId, WidgetLayout } from '@/pages/Home/hooks/useDashboardWidgets'

const REMOVE_ANIMATION_MS = 300

type Changes = Partial<Omit<WidgetLayout, 'id'>>

// Itens do menu do widget; remover espera a animação de saída antes de tirar do painel
export function useWidgetMenuItems(
  widget: WidgetLayout,
  onChange: (id: WidgetId, changes: Changes) => void,
  onRemove: (id: WidgetId) => void,
) {
  const { t } = useTranslation('home')
  const [removing, setRemoving] = useState(false)
  const { id, collapsed } = widget

  function handleRemove() {
    setRemoving(true)
    setTimeout(() => onRemove(id), REMOVE_ANIMATION_MS)
  }

  const CollapseIcon = collapsed ? ChevronsUpDown : ChevronsDownUp

  const items: ActionsMenuItem[] = [
    {
      label: collapsed ? t('widgetMenu.expand') : t('widgetMenu.collapse'),
      icon: <CollapseIcon className="size-4" />,
      onClick: () => onChange(id, { collapsed: !collapsed }),
    },
    {
      label: t('widgetSelection.remove'),
      icon: <Trash2 className="size-4" />,
      onClick: handleRemove,
      destructive: true,
    },
  ]

  return { items, removing }
}
