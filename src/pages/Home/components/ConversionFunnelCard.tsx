import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FunnelChart from '@/components/charts/FunnelChart'
import ChartSkeleton from '@/pages/Home/components/ChartSkeleton'
import { useLeadsReportControllerFunnel } from '@/api/generated/api'

const STAGE_ORDER = ['lead', 'visit', 'proposal', 'sale'] as const

function ConversionFunnelCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = useLeadsReportControllerFunnel()
  const rows = data ?? []

  const stageLabels: Record<string, string> = {
    lead: t('conversionFunnelCard.stage.lead'),
    visit: t('conversionFunnelCard.stage.visit'),
    proposal: t('conversionFunnelCard.stage.proposal'),
    sale: t('conversionFunnelCard.stage.sale'),
  }

  const categories = STAGE_ORDER.map((stage) => stageLabels[stage] ?? stage)
  const values = STAGE_ORDER.map(
    (stage) => rows.find((row) => row.stage === stage)?.total ?? 0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('conversionFunnelCard.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <ChartSkeleton />
          </div>
        ) : (
          <FunnelChart labels={categories} values={values} height={220} />
        )}
      </CardContent>
    </Card>
  )
}

export default ConversionFunnelCard
