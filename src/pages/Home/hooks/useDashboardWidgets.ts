import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest } from '@/utils/getErrorMessageFromRequest'
import {
  useUserHomeWidgetControllerList,
  useUserHomeWidgetControllerReplace,
} from '@/api/generated/api'

export const WIDGET_IDS = [
  'todayAppointments',
  'recentProperties',
  'dormantProperties',
  'leadsByStatus',
  'leadsBySource',
  'conversionFunnel',
  'agentConversion',
  'propertiesByStatusPurpose',
  'avgTimeOnMarket',
  'incompleteProperties',
  'agentRanking',
  'appointmentsStatus',
  'upcomingRenewals',
] as const

export type WidgetId = (typeof WIDGET_IDS)[number]
export type WidgetSize = 'small' | 'medium' | 'large'

export const MIN_WIDTH_PERCENT = 20
export const MAX_WIDTH_PERCENT = 100

export const SIZE_PERCENT: Record<WidgetSize, number> = {
  small: 33.33,
  medium: 66.67,
  large: 100,
}

const WIDTHS_KEY = 'dashboard.widgetWidths'

export type WidgetLayout = {
  id: WidgetId
  size: WidgetSize
  collapsed: boolean
}

const DEFAULT_WIDGETS: WidgetLayout[] = [
  'todayAppointments',
  'recentProperties',
  'dormantProperties',
  'leadsBySource',
].map((id) => ({ id: id as WidgetId, size: 'small', collapsed: false }))

function isWidgetId(value: string): value is WidgetId {
  return (WIDGET_IDS as readonly string[]).includes(value)
}

function sizeFromPercent(percent: number): WidgetSize {
  if (percent < 50) return 'small'
  if (percent < 83) return 'medium'

  return 'large'
}

function readWidths(): Partial<Record<WidgetId, number>> {
  try {
    return JSON.parse(localStorage.getItem(WIDTHS_KEY) ?? '{}') as Partial<Record<WidgetId, number>>
  } catch {
    return {}
  }
}

// Controla quais widgets do painel estão ativos, o tamanho e se estão recolhidos.
// A disposição é salva por usuário no servidor.
export function useDashboardWidgets() {
  const { data, isPending } = useUserHomeWidgetControllerList()
  const { mutateAsync } = useUserHomeWidgetControllerReplace()
  const { toastPromise } = useToast()
  const [widths, setWidths] = useState(readWidths)
  const [localLayout, setLocalLayout] = useState<WidgetLayout[] | null>(null)

  const saved: WidgetLayout[] = (data?.widgets ?? []).flatMap((item) =>
    isWidgetId(item.widgetKey)
      ? [{ id: item.widgetKey, size: item.size ?? 'small', collapsed: item.collapsed ?? false }]
      : [],
  )

  // Enquanto a disposição salva carrega, não mostra o padrão para evitar "pisca"
  const layout = localLayout ?? (isPending ? [] : saved.length > 0 ? saved : DEFAULT_WIDGETS)

  function persist(next: WidgetLayout[]) {
    setLocalLayout(next)
    const widgets = next.map((w) => ({
      widgetKey: w.id,
      size: w.size,
      collapsed: w.collapsed,
    }))

    toastPromise(mutateAsync({ data: { widgets } }), {
      pending: '',
      success: '',
      error: (error) => getErrorMessageFromRequest(error),
    })
  }

  function addWidget(id: WidgetId) {
    if (layout.some((w) => w.id === id)) return

    persist([...layout, { id, size: 'small', collapsed: false }])
  }

  function removeWidget(id: WidgetId) {
    persist(layout.filter((w) => w.id !== id))
  }

  function updateWidget(id: WidgetId, changes: Partial<Omit<WidgetLayout, 'id'>>) {
    persist(layout.map((w) => (w.id === id ? { ...w, ...changes } : w)))
  }

  // Largura livre (em % do painel): guardada no navegador; o servidor recebe o tamanho mais próximo
  function resizeWidget(id: WidgetId, percent: number) {
    const next = { ...widths, [id]: percent }
    setWidths(next)

    try {
      localStorage.setItem(WIDTHS_KEY, JSON.stringify(next))
    } catch {
      // localStorage indisponível — mantém só em memória
    }

    updateWidget(id, { size: sizeFromPercent(percent) })
  }

  function getWidth(widget: WidgetLayout): number {
    return widths[widget.id] ?? SIZE_PERCENT[widget.size]
  }

  const inactiveWidgets = WIDGET_IDS.filter((id) => !layout.some((w) => w.id === id))

  return {
    layout,
    inactiveWidgets,
    addWidget,
    removeWidget,
    updateWidget,
    resizeWidget,
    getWidth,
  }
}
