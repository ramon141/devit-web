import {
  usePropertiesReportControllerDormant,
  usePropertiesReportControllerRecent,
  useLeadsReportControllerTodayAppointments,
} from '@/api/generated/api'

export function useDashboardReports() {
  const { data: dormantProperties, isLoading: loadingDormant } =
    usePropertiesReportControllerDormant({ days: 180 })
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
