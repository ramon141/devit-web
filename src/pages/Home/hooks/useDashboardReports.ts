import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/mutator'
import {
  usePropertiesReportControllerDormant,
  usePropertiesReportControllerRecent,
  useLeadsReportControllerTodayAppointments,
} from '@/api/generated/api'

const DEFAULT_DORMANT_DAYS = 180

export function useDashboardReports(dormantDays: number = DEFAULT_DORMANT_DAYS) {
  const { data: dormantProperties, isLoading: loadingDormant } =
    usePropertiesReportControllerDormant({ days: dormantDays })
  const { data: dormantTotal } = useQuery({
    queryKey: ['reports', 'properties', 'dormant-count', dormantDays],
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/reports/properties/dormant/count', {
        params: { days: dormantDays },
      })
      return data.count
    },
  })
  const { data: recentProperties, isLoading: loadingRecent } =
    usePropertiesReportControllerRecent({ limit: 10 })
  const { data: todayAppointments, isLoading: loadingAppointments } =
    useLeadsReportControllerTodayAppointments({})

  return {
    dormantProperties: dormantProperties ?? [],
    dormantTotal: dormantTotal ?? 0,
    loadingDormant,
    recentProperties: recentProperties ?? [],
    loadingRecent,
    todayAppointments: todayAppointments ?? [],
    loadingAppointments,
  }
}
