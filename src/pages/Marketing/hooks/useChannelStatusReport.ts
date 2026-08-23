import { useCommunicationsReportControllerByChannelStatus } from '@/api/generated/api'

export function useChannelStatusReport(channel: 'email' | 'whatsapp') {
  const { data, isLoading } = useCommunicationsReportControllerByChannelStatus()

  const rows = (data ?? []).filter((row) => row.channel === channel)
  const total = rows.reduce((sum, row) => sum + (row.total ?? 0), 0)

  return { rows, total, isLoading }
}
