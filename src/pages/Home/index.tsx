import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { useDashboardReports } from '@/pages/Home/hooks/useDashboardReports'
import DormantPropertiesCard from '@/pages/Home/components/DormantPropertiesCard'
import RecentPropertiesCard from '@/pages/Home/components/RecentPropertiesCard'
import TodayAppointmentsCard from '@/pages/Home/components/TodayAppointmentsCard'
import LeadsByStatusCard from '@/pages/Home/components/LeadsByStatusCard'
import LeadsBySourceCard from '@/pages/Home/components/LeadsBySourceCard'
import DashboardWindowSelect from '@/pages/Home/components/DashboardWindowSelect'

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
  const { dormantProperties, recentProperties, todayAppointments } =
    useDashboardReports(dormantDays)

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
      <div className="mb-4 flex justify-end">
        <DashboardWindowSelect value={dormantDays} onChange={handleWindowChange} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TodayAppointmentsCard appointments={todayAppointments} />
        <RecentPropertiesCard properties={recentProperties} />
        <DormantPropertiesCard properties={dormantProperties} />
        <LeadsByStatusCard />
        <LeadsBySourceCard />
      </div>
    </AppLayout>
  )
}

export default Home
