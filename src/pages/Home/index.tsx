import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { useDashboardReports } from '@/pages/Home/hooks/useDashboardReports'
import DormantPropertiesCard from '@/pages/Home/components/DormantPropertiesCard'
import RecentPropertiesCard from '@/pages/Home/components/RecentPropertiesCard'
import TodayAppointmentsCard from '@/pages/Home/components/TodayAppointmentsCard'
import LeadsByStatusCard from '@/pages/Home/components/LeadsByStatusCard'

function Home() {
  const { t } = useTranslation('home')
  const { dormantProperties, recentProperties, todayAppointments } = useDashboardReports()

  return (
    <AppLayout
      title={t('page.title')}
      description={t('page.description')}
      breadcrumbItems={[{ label: t('page.breadcrumb') }]}
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
