import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import { useLeadsReportControllerBySource } from '@/api/generated/api'
import { getLeadSourceOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'

function LeadsBySourceCard() {
  const { t } = useTranslation('home')
  const { t: tClientes } = useTranslation('clientes')
  const { data } = useLeadsReportControllerBySource()
  const rows = data ?? []

  const sourceLabels: Record<string, string> = Object.fromEntries(
    getLeadSourceOptions(tClientes).map((option) => [option.value, option.label])
  )

  const total = rows.reduce((sum, row) => sum + (row.total ?? 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('leadsBySourceCard.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('leadsBySourceCard.total', { count: total })}
        </p>
      </CardHeader>
      <CardContent>
        <DonutChart
          labels={rows.map((row) => sourceLabels[row.source ?? ''] ?? row.source ?? '')}
          values={rows.map((row) => row.total ?? 0)}
          height={220}
        />
      </CardContent>
    </Card>
  )
}

export default LeadsBySourceCard
