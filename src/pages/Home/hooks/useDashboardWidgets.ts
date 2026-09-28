import { useState } from 'react'

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

const DEFAULT_ACTIVE_WIDGETS: WidgetId[] = [
  'todayAppointments',
  'recentProperties',
  'dormantProperties',
  'leadsBySource',
]

const ACTIVE_WIDGETS_KEY = 'dashboard.activeWidgets'

function isWidgetId(value: string): value is WidgetId {
  return (WIDGET_IDS as readonly string[]).includes(value)
}

function readActiveWidgets(): WidgetId[] {
  try {
    const raw = localStorage.getItem(ACTIVE_WIDGETS_KEY)
    if (!raw) return DEFAULT_ACTIVE_WIDGETS

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULT_ACTIVE_WIDGETS

    return parsed.filter((id): id is WidgetId => typeof id === 'string' && isWidgetId(id))
  } catch {
    return DEFAULT_ACTIVE_WIDGETS
  }
}

function writeActiveWidgets(ids: WidgetId[]) {
  try {
    localStorage.setItem(ACTIVE_WIDGETS_KEY, JSON.stringify(ids))
  } catch {
    // localStorage indisponível — mantém só em memória
  }
}

// Controla quais widgets do painel estão ativos, persistindo a escolha do usuário
export function useDashboardWidgets() {
  const [activeWidgets, setActiveWidgets] = useState<WidgetId[]>(readActiveWidgets)

  function addWidget(id: WidgetId) {
    setActiveWidgets((prev) => {
      if (prev.includes(id)) return prev

      const next = [...prev, id]
      writeActiveWidgets(next)
      return next
    })
  }

  function removeWidget(id: WidgetId) {
    setActiveWidgets((prev) => {
      const next = prev.filter((widgetId) => widgetId !== id)
      writeActiveWidgets(next)
      return next
    })
  }

  const inactiveWidgets = WIDGET_IDS.filter((id) => !activeWidgets.includes(id))

  return { activeWidgets, inactiveWidgets, addWidget, removeWidget }
}
