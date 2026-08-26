import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import { useLeadsReportControllerByStatus } from '@/api/generated/api'
import { getLeadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'

function LeadsByStatusCard() {
  const { t } = useTranslation('home')
  const { t: tClientes } = useTranslation('clientes')
  const { data } = useLeadsReportControllerByStatus()
  const rows = data ?? []

  const leadStatusLabels: Record<string, string> = Object.fromEntries(
    getLeadStatusOptions(tClientes).map((option) => [option.value, option.label])
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('leadsByStatusCard.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          labels={rows.map((row) => leadStatusLabels[row.status ?? ''] ?? row.status ?? '')}
          values={rows.map((row) => row.total ?? 0)}
          height={220}
        />
      </CardContent>
    </Card>
  )
}

export default LeadsByStatusCard
