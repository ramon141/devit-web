import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import { useStatisticsReports } from '@/pages/Statistiche/hooks/useStatisticsReports'
import { getLeadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'
import { getSaleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
import {
  COMMUNICATION_CHANNEL_LABELS as channelLabels,
  COMMUNICATION_STATUS_LABELS,
} from '@/constants/communications'

function Statistiche() {
  const { t } = useTranslation('statistiche')
  const { t: tClientes } = useTranslation('clientes')
  const { t: tOperazioni } = useTranslation('operazioni')
  const { leadsByStatus, salesByStatus, communicationsByChannel } = useStatisticsReports()

  const leadStatusLabels: Record<string, string> = Object.fromEntries(
    getLeadStatusOptions(tClientes).map((option) => [option.value, option.label])
  )

  const saleStatusLabels: Record<string, string> = Object.fromEntries(
    getSaleStatusOptions(tOperazioni).map((option) => [option.value, option.label])
  )

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
      title={t('page.title')}
      description={t('page.description')}
      breadcrumbItems={[{ label: t('page.breadcrumb') }]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('leadsByStatus.title')}</CardTitle>
            <CardDescription>{t('leadsByStatus.description')}</CardDescription>
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
            <CardTitle>{t('salesByStatus.title')}</CardTitle>
            <CardDescription>{t('salesByStatus.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              categories={salesByStatus.map((row) => saleStatusLabels[row.status ?? ''] ?? row.status ?? '')}
              series={[{ name: t('salesByStatus.seriesName'), data: salesByStatus.map((row) => row.total ?? 0) }]}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('communicationsByChannel.title')}</CardTitle>
            <CardDescription>{t('communicationsByChannel.description')}</CardDescription>
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
