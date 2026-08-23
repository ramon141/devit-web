import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import { useLeadsReportControllerByStatus } from '@/api/generated/api'
import { leadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'

const leadStatusLabels: Record<string, string> = Object.fromEntries(
  leadStatusOptions.map((option) => [option.value, option.label])
)

function LeadsByStatusCard() {
  const { data } = useLeadsReportControllerByStatus()
  const rows = data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead per stato</CardTitle>
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
