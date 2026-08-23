import AppLayout from '@/components/layout/AppLayout'
import { useDashboardReports } from '@/pages/Home/hooks/useDashboardReports'
import DormantPropertiesCard from '@/pages/Home/components/DormantPropertiesCard'
import RecentPropertiesCard from '@/pages/Home/components/RecentPropertiesCard'
import TodayAppointmentsCard from '@/pages/Home/components/TodayAppointmentsCard'
import LeadsByStatusCard from '@/pages/Home/components/LeadsByStatusCard'

function Home() {
  const { dormantProperties, recentProperties, todayAppointments } = useDashboardReports()

  return (
    <AppLayout
      title="Bacheca"
      description="Panoramica dell'attività dell'agenzia"
      breadcrumbItems={[{ label: 'Bacheca' }]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TodayAppointmentsCard appointments={todayAppointments} />
        <RecentPropertiesCard properties={recentProperties} />
        <DormantPropertiesCard properties={dormantProperties} />
        <LeadsByStatusCard />
      </div>
    </AppLayout>
  )
}

export default Home
