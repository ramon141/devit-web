import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useHomeTour } from '@/pages/Home/hooks/useHomeTour'
import { useDashboardReports } from '@/pages/Home/hooks/useDashboardReports'
import { useDashboardWidgets } from '@/pages/Home/hooks/useDashboardWidgets'
import DashboardWidget from '@/pages/Home/components/DashboardWidget'
import WidgetSelectionFab from '@/pages/Home/components/WidgetSelectionFab'
import WidgetSelectionModal from '@/pages/Home/components/WidgetSelectionModal'
import DormantPropertiesCard from '@/pages/Home/components/DormantPropertiesCard'
import RecentPropertiesCard from '@/pages/Home/components/RecentPropertiesCard'
import TodayAppointmentsCard from '@/pages/Home/components/TodayAppointmentsCard'
import LeadsByStatusCard from '@/pages/Home/components/LeadsByStatusCard'
import LeadsBySourceCard from '@/pages/Home/components/LeadsBySourceCard'
import DashboardWindowSelect from '@/pages/Home/components/DashboardWindowSelect'
import ConversionFunnelCard from '@/pages/Home/components/ConversionFunnelCard'
import AgentConversionCard from '@/pages/Home/components/AgentConversionCard'
import PropertiesByStatusPurposeCard from '@/pages/Home/components/PropertiesByStatusPurposeCard'
import AvgTimeOnMarketCard from '@/pages/Home/components/AvgTimeOnMarketCard'
import IncompletePropertiesCard from '@/pages/Home/components/IncompletePropertiesCard'
import AgentRankingCard from '@/pages/Home/components/AgentRankingCard'
import AppointmentsStatusCard from '@/pages/Home/components/AppointmentsStatusCard'
import UpcomingRenewalsCard from '@/pages/Home/components/UpcomingRenewalsCard'

const DORMANT_DAYS_KEY = 'dashboard.dormantDays'
const DEFAULT_DORMANT_DAYS = 180

function readDormantDays(): number {
  try {
    return Number(localStorage.getItem(DORMANT_DAYS_KEY)) || DEFAULT_DORMANT_DAYS
  } catch {
    return DEFAULT_DORMANT_DAYS
  }
}

function Home() {
  const { t } = useTranslation('home')
  const [dormantDays, setDormantDays] = useState(readDormantDays)
  const {
    dormantProperties,
    loadingDormant,
    recentProperties,
    loadingRecent,
    todayAppointments,
    loadingAppointments,
  } = useDashboardReports(dormantDays)
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useHomeTour()
  const { activeWidgets, inactiveWidgets, addWidget, removeWidget } = useDashboardWidgets()
  const [widgetModalOpen, setWidgetModalOpen] = useState(false)

  function handleWindowChange(days: number) {
    setDormantDays(days)
    try {
      localStorage.setItem(DORMANT_DAYS_KEY, String(days))
    } catch {
      // localStorage indisponível — mantém só em memória
    }
  }

  return (
    <AppLayout
      title={t('page.title')}
      description={t('page.description')}
      breadcrumbItems={[{ label: t('page.breadcrumb') }]}
    >
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />
      <WidgetSelectionFab onClick={() => setWidgetModalOpen(true)} />

      <WidgetSelectionModal
        open={widgetModalOpen}
        onOpenChange={setWidgetModalOpen}
        inactiveWidgets={inactiveWidgets}
        onAddWidget={addWidget}
      />

      <div id="home-window-select" className="mb-4 flex justify-end">
        <DashboardWindowSelect value={dormantDays} onChange={handleWindowChange} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activeWidgets.includes('todayAppointments') && (
          <DashboardWidget id="todayAppointments" onRemove={removeWidget}>
            <TodayAppointmentsCard
              appointments={todayAppointments}
              isLoading={loadingAppointments}
            />
          </DashboardWidget>
        )}

        {activeWidgets.includes('recentProperties') && (
          <DashboardWidget id="recentProperties" onRemove={removeWidget}>
            <RecentPropertiesCard properties={recentProperties} isLoading={loadingRecent} />
          </DashboardWidget>
        )}

        {activeWidgets.includes('dormantProperties') && (
          <DashboardWidget id="dormantProperties" onRemove={removeWidget}>
            <DormantPropertiesCard properties={dormantProperties} isLoading={loadingDormant} />
          </DashboardWidget>
        )}

        {activeWidgets.includes('leadsByStatus') && (
          <DashboardWidget id="leadsByStatus" onRemove={removeWidget}>
            <LeadsByStatusCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('leadsBySource') && (
          <DashboardWidget id="leadsBySource" onRemove={removeWidget}>
            <LeadsBySourceCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('conversionFunnel') && (
          <DashboardWidget id="conversionFunnel" onRemove={removeWidget}>
            <ConversionFunnelCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('agentConversion') && (
          <DashboardWidget id="agentConversion" onRemove={removeWidget}>
            <AgentConversionCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('propertiesByStatusPurpose') && (
          <DashboardWidget id="propertiesByStatusPurpose" onRemove={removeWidget}>
            <PropertiesByStatusPurposeCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('avgTimeOnMarket') && (
          <DashboardWidget id="avgTimeOnMarket" onRemove={removeWidget}>
            <AvgTimeOnMarketCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('incompleteProperties') && (
          <DashboardWidget id="incompleteProperties" onRemove={removeWidget}>
            <IncompletePropertiesCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('agentRanking') && (
          <DashboardWidget id="agentRanking" onRemove={removeWidget}>
            <AgentRankingCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('appointmentsStatus') && (
          <DashboardWidget id="appointmentsStatus" onRemove={removeWidget}>
            <AppointmentsStatusCard />
          </DashboardWidget>
        )}

        {activeWidgets.includes('upcomingRenewals') && (
          <DashboardWidget id="upcomingRenewals" onRemove={removeWidget}>
            <UpcomingRenewalsCard />
          </DashboardWidget>
        )}
      </div>
    </AppLayout>
  )
}

export default Home
