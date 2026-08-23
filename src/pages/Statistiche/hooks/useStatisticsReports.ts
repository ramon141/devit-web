import {
  useCommunicationsReportControllerByChannelStatus,
  useLeadsReportControllerByStatus,
  useSalesRentalsReportControllerSalesByStatus,
} from '@/api/generated/api'

export function useStatisticsReports() {
  const { data: leadsByStatus } = useLeadsReportControllerByStatus()
  const { data: salesByStatus } = useSalesRentalsReportControllerSalesByStatus()
  const { data: communicationsByChannel } = useCommunicationsReportControllerByChannelStatus()

  return {
    leadsByStatus: leadsByStatus ?? [],
    salesByStatus: salesByStatus ?? [],
    communicationsByChannel: communicationsByChannel ?? [],
  }
}
