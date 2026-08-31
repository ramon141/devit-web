import {
  useCommunicationsReportControllerByChannelStatus,
  useCommunicationsReportControllerSummary,
  useLeadsReportControllerByStatus,
  useSalesRentalsReportControllerSalesByStatus,
} from '@/api/generated/api'

export function useStatisticsReports() {
  const { data: leadsByStatus } = useLeadsReportControllerByStatus()
  const { data: salesByStatus } = useSalesRentalsReportControllerSalesByStatus()
  const { data: communicationsByChannel } = useCommunicationsReportControllerByChannelStatus()
  const { data: communicationsSummary } = useCommunicationsReportControllerSummary()

  return {
    leadsByStatus: leadsByStatus ?? [],
    salesByStatus: salesByStatus ?? [],
    communicationsByChannel: communicationsByChannel ?? [],
    communicationsSummary: communicationsSummary ?? [],
  }
}
