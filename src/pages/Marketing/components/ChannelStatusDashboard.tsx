import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import { useChannelStatusReport } from '@/pages/Marketing/hooks/useChannelStatusReport'
import { COMMUNICATION_STATUS_LABELS as statusLabels } from '@/constants/communications'

type ChannelStatusDashboardProps = {
  channel: 'email' | 'whatsapp'
}

function ChannelStatusDashboard({ channel }: ChannelStatusDashboardProps) {
  const { rows, total } = useChannelStatusReport(channel)

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Totale</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{total}</CardContent>
        </Card>

        {rows.map((row) => (
          <Card key={row.status}>
            <CardHeader>
              <CardTitle>{statusLabels[row.status ?? ''] ?? row.status}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{row.total}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuzione per stato</CardTitle>
        </CardHeader>
        <CardContent>
          <DonutChart
            labels={rows.map((row) => statusLabels[row.status ?? ''] ?? row.status ?? '')}
            values={rows.map((row) => row.total ?? 0)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ChannelStatusDashboard
