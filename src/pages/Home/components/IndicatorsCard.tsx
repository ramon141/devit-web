import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GaugeChart from '@/components/charts/GaugeChart'
import ChartSkeleton from '@/pages/Home/components/ChartSkeleton'
import { useDashboardIndicatorsControllerIndicators } from '@/api/generated/api'

function IndicatorsCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = useDashboardIndicatorsControllerIndicators()

  const gauges = [
    { key: 'agency', value: data?.agency ?? 0 },
    { key: 'user', value: data?.user ?? 0 },
    { key: 'workflow', value: data?.workflow ?? 0 },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('indicatorsCard.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('indicatorsCard.description')}</p>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center justify-around gap-4">
        {isLoading && <ChartSkeleton size={120} count={gauges.length} />}

        {!isLoading && gauges.map((gauge, index) => (
          <GaugeChart
            key={gauge.key}
            value={gauge.value}
            label={t(`indicatorsCard.${gauge.key}`)}
            colorIndex={index}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export default IndicatorsCard
