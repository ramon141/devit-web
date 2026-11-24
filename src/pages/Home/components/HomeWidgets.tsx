import type { ReactNode } from 'react'
import { useDashboardReports } from '@/pages/Home/hooks/useDashboardReports'
import type { WidgetId, WidgetLayout } from '@/pages/Home/hooks/useDashboardWidgets'
import DashboardWidget from '@/pages/Home/components/DashboardWidget'
import DormantPropertiesCard from '@/pages/Home/components/DormantPropertiesCard'
import RecentPropertiesCard from '@/pages/Home/components/RecentPropertiesCard'
import TodayAppointmentsCard from '@/pages/Home/components/TodayAppointmentsCard'
import LeadsByStatusCard from '@/pages/Home/components/LeadsByStatusCard'
import LeadsBySourceCard from '@/pages/Home/components/LeadsBySourceCard'
import ConversionFunnelCard from '@/pages/Home/components/ConversionFunnelCard'
import AgentConversionCard from '@/pages/Home/components/AgentConversionCard'
import PropertiesByStatusPurposeCard from '@/pages/Home/components/PropertiesByStatusPurposeCard'
import AvgTimeOnMarketCard from '@/pages/Home/components/AvgTimeOnMarketCard'
import IncompletePropertiesCard from '@/pages/Home/components/IncompletePropertiesCard'
import AgentRankingCard from '@/pages/Home/components/AgentRankingCard'
import AppointmentsStatusCard from '@/pages/Home/components/AppointmentsStatusCard'
import UpcomingRenewalsCard from '@/pages/Home/components/UpcomingRenewalsCard'

type HomeWidgetsProps = {
  layout: WidgetLayout[]
  dormantDays: number
  getWidth: (widget: WidgetLayout) => number
  onResize: (id: WidgetId, percent: number) => void
  onRemove: (id: WidgetId) => void
  onChange: (id: WidgetId, changes: Partial<Omit<WidgetLayout, 'id'>>) => void
}

// Grid do painel: renderiza os widgets na ordem, tamanho e estado salvos do usuário
function HomeWidgets({
  layout,
  dormantDays,
  getWidth,
  onResize,
  onRemove,
  onChange,
}: HomeWidgetsProps) {
  const reports = useDashboardReports(dormantDays)

  const content: Record<WidgetId, ReactNode> = {
    todayAppointments: (
      <TodayAppointmentsCard
        appointments={reports.todayAppointments}
        isLoading={reports.loadingAppointments}
      />
    ),
    recentProperties: (
      <RecentPropertiesCard
        properties={reports.recentProperties}
        isLoading={reports.loadingRecent}
      />
    ),
    dormantProperties: (
      <DormantPropertiesCard
        properties={reports.dormantProperties}
        total={reports.dormantTotal}
        isLoading={reports.loadingDormant}
      />
    ),
    leadsByStatus: <LeadsByStatusCard />,
    leadsBySource: <LeadsBySourceCard />,
    conversionFunnel: <ConversionFunnelCard />,
    agentConversion: <AgentConversionCard />,
    propertiesByStatusPurpose: <PropertiesByStatusPurposeCard />,
    avgTimeOnMarket: <AvgTimeOnMarketCard />,
    incompleteProperties: <IncompletePropertiesCard />,
    agentRanking: <AgentRankingCard />,
    appointmentsStatus: <AppointmentsStatusCard />,
    upcomingRenewals: <UpcomingRenewalsCard />,
  }

  return (
    <div className="flex flex-wrap gap-4 [--widget-gap:1rem]">
      {layout.map((widget) => (
        <DashboardWidget
          key={widget.id}
          widget={widget}
          widthPercent={getWidth(widget)}
          onResize={onResize}
          onRemove={onRemove}
          onChange={onChange}
        >
          {content[widget.id]}
        </DashboardWidget>
      ))}
    </div>
  )
}

export default HomeWidgets
