import {
  useCommunicationsReportControllerByChannelStatus,
  useCommunicationsReportControllerSummary,
  useLeadsReportControllerByStatus,
  useSalesRentalsReportControllerSalesByStatus,
} from '@/api/generated/api'

export function useStatisticsReports(communicationsDays: number) {
  const { data: leadsByStatus } = useLeadsReportControllerByStatus()
  const { data: salesByStatus } = useSalesRentalsReportControllerSalesByStatus()
  const { data: communicationsByChannel } = useCommunicationsReportControllerByChannelStatus({
    days: communicationsDays,
  })
  const { data: communicationsSummary } = useCommunicationsReportControllerSummary({
    days: communicationsDays,
  })

  return {
    leadsByStatus: leadsByStatus ?? [],
    salesByStatus: salesByStatus ?? [],
    communicationsByChannel: communicationsByChannel ?? [],
    communicationsSummary: communicationsSummary ?? [],
  }
}
