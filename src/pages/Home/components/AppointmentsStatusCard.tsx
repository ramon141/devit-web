import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import ChartSkeleton from '@/pages/Home/components/ChartSkeleton'
import { useAgendaReportControllerStatusSummary } from '@/api/generated/api'

const STATUS_ORDER = ['scheduled', 'completed', 'cancelled'] as const

function AppointmentsStatusCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = useAgendaReportControllerStatusSummary()
  const rows = data ?? []

  const statusLabels: Record<string, string> = {
    scheduled: t('appointmentsStatusCard.status.scheduled'),
    completed: t('appointmentsStatusCard.status.completed'),
    cancelled: t('appointmentsStatusCard.status.cancelled'),
  }

  const present = STATUS_ORDER.filter((status) =>
    rows.some((row) => row.status === status)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('appointmentsStatusCard.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <ChartSkeleton />
          </div>
        ) : (
          <DonutChart
            labels={present.map((status) => statusLabels[status] ?? status)}
            values={present.map(
              (status) => rows.find((row) => row.status === status)?.total ?? 0
            )}
            height={220}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default AppointmentsStatusCard
