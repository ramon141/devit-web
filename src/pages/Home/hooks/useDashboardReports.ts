import {
  usePropertiesReportControllerDormant,
  usePropertiesReportControllerRecent,
  useLeadsReportControllerTodayAppointments,
} from '@/api/generated/api'

const DEFAULT_DORMANT_DAYS = 180

export function useDashboardReports(dormantDays: number = DEFAULT_DORMANT_DAYS) {
  const { data: dormantProperties, isLoading: loadingDormant } =
    usePropertiesReportControllerDormant({ days: dormantDays })
  const { data: recentProperties, isLoading: loadingRecent } =
    usePropertiesReportControllerRecent({ limit: 10 })
  const { data: todayAppointments, isLoading: loadingAppointments } =
    useLeadsReportControllerTodayAppointments({})

  return {
    dormantProperties: dormantProperties ?? [],
    loadingDormant,
    recentProperties: recentProperties ?? [],
    loadingRecent,
    todayAppointments: todayAppointments ?? [],
    loadingAppointments,
  }
}
