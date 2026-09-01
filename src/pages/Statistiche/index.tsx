import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import { useStatisticsReports } from '@/pages/Statistiche/hooks/useStatisticsReports'
import { getLeadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'
import { getSaleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
import DashboardWindowSelect from '@/pages/Home/components/DashboardWindowSelect'
import {
  getCommunicationChannelLabels,
  getCommunicationStatusLabels,
} from '@/constants/communications'

const DEFAULT_COMMUNICATIONS_DAYS = 30

function Statistiche() {
  const { t } = useTranslation('statistiche')
  const { t: tClientes } = useTranslation('clientes')
  const { t: tOperazioni } = useTranslation('operazioni')
  const { t: tCommon } = useTranslation('common')
  const channelLabels = getCommunicationChannelLabels(tCommon)
  const COMMUNICATION_STATUS_LABELS = getCommunicationStatusLabels(tCommon)
  const [communicationsDays, setCommunicationsDays] = useState(DEFAULT_COMMUNICATIONS_DAYS)
  const { leadsByStatus, salesByStatus, communicationsByChannel, communicationsSummary } =
    useStatisticsReports(communicationsDays)

  const leadStatusLabels: Record<string, string> = Object.fromEntries(
    getLeadStatusOptions(tClientes).map((option) => [option.value, option.label])
  )

  const saleStatusLabels: Record<string, string> = Object.fromEntries(
    getSaleStatusOptions(tOperazioni).map((option) => [option.value, option.label])
  )

  const summaryMetrics = ['delivered', 'clicked', 'read', 'failed'] as const
  const communicationsSummaryCategories = communicationsSummary.map(
    (row) => channelLabels[row.channel ?? ''] ?? row.channel ?? ''
  )
  const communicationsSummarySeries = summaryMetrics.map((metric) => ({
    name: COMMUNICATION_STATUS_LABELS[metric] ?? metric,
    data: communicationsSummary.map((row) => row[metric] ?? 0),
  }))

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
            <DashboardWindowSelect value={communicationsDays} onChange={setCommunicationsDays} />
          </CardHeader>
          <CardContent>
            <BarChart
              categories={statuses.map((status) => COMMUNICATION_STATUS_LABELS[status] ?? status)}
              series={communicationsSeries}
              stacked
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('communicationsSummary.title')}</CardTitle>
            <CardDescription>{t('communicationsSummary.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              categories={communicationsSummaryCategories}
              series={communicationsSummarySeries}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Statistiche
