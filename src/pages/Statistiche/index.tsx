import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import { useStatisticsReports } from '@/pages/Statistiche/hooks/useStatisticsReports'
import { leadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'
import { saleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
import {
  COMMUNICATION_CHANNEL_LABELS as channelLabels,
  COMMUNICATION_STATUS_LABELS,
} from '@/constants/communications'

const leadStatusLabels: Record<string, string> = Object.fromEntries(
  leadStatusOptions.map((option) => [option.value, option.label])
)

const saleStatusLabels: Record<string, string> = Object.fromEntries(
  saleStatusOptions.map((option) => [option.value, option.label])
)

function Statistiche() {
  const { leadsByStatus, salesByStatus, communicationsByChannel } = useStatisticsReports()

  const channels = [...new Set(communicationsByChannel.map((row) => row.channel ?? ''))]
  const statuses = [...new Set(communicationsByChannel.map((row) => row.status ?? ''))]
  const communicationsSeries = channels.map((channel) => ({
    name: channelLabels[channel] ?? channel,
    data: statuses.map(
      (status) =>
        communicationsByChannel.find((row) => row.channel === channel && row.status === status)
          ?.total ?? 0
    ),
  }))

  return (
    <AppLayout
      title="Statistiche"
      description="Report e indicatori dell'agenzia"
      breadcrumbItems={[{ label: 'Statistiche' }]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead per stato</CardTitle>
            <CardDescription>Distribuzione dei contatti nella pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              labels={leadsByStatus.map((row) => leadStatusLabels[row.status ?? ''] ?? row.status ?? '')}
              values={leadsByStatus.map((row) => row.total ?? 0)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendite per stato</CardTitle>
            <CardDescription>Numero di vendite raggruppate per stato</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              categories={salesByStatus.map((row) => saleStatusLabels[row.status ?? ''] ?? row.status ?? '')}
              series={[{ name: 'Vendite', data: salesByStatus.map((row) => row.total ?? 0) }]}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comunicazioni per canale e stato</CardTitle>
            <CardDescription>E-mail e WhatsApp inviati, raggruppati per stato</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              categories={statuses.map((status) => COMMUNICATION_STATUS_LABELS[status] ?? status)}
              series={communicationsSeries}
              stacked
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Statistiche
