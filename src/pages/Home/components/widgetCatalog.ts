import type { ComponentType } from 'react'
import {
  BarChart3,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Clock3,
  FileWarning,
  PieChart,
  Timer,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import type { WidgetId } from '@/pages/Home/hooks/useDashboardWidgets'

type WidgetCatalogEntry = {
  id: WidgetId
  icon: ComponentType<{ className?: string }>
}

// Ícone de cada widget no modal de seleção; título/descrição vêm de home.json (tour.<id>)
export const WIDGET_CATALOG: WidgetCatalogEntry[] = [
  { id: 'todayAppointments', icon: CalendarCheck },
  { id: 'recentProperties', icon: Building2 },
  { id: 'dormantProperties', icon: Clock3 },
  { id: 'leadsByStatus', icon: PieChart },
  { id: 'leadsBySource', icon: Users },
  { id: 'conversionFunnel', icon: TrendingUp },
  { id: 'agentConversion', icon: BarChart3 },
  { id: 'propertiesByStatusPurpose', icon: Building2 },
  { id: 'avgTimeOnMarket', icon: Timer },
  { id: 'incompleteProperties', icon: FileWarning },
  { id: 'agentRanking', icon: Trophy },
  { id: 'appointmentsStatus', icon: Calendar },
  { id: 'upcomingRenewals', icon: CalendarClock },
]
