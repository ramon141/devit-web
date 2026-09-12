import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePropertiesReportControllerAvgTimeOnMarket } from '@/api/generated/api'

function formatDays(value?: number | null) {
  return value == null ? '—' : `${Math.round(value)}`
}

function AvgTimeOnMarketCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = usePropertiesReportControllerAvgTimeOnMarket()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('avgTimeOnMarketCard.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-1 py-4">
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <span className="text-3xl font-semibold">{formatDays(data?.avgDaysToSale)}</span>
          )}

          <span className="text-sm text-muted-foreground">
            {t('avgTimeOnMarketCard.toSale', { count: data?.salesCount ?? 0 })}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 py-4">
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <span className="text-3xl font-semibold">{formatDays(data?.avgDaysToRent)}</span>
          )}

          <span className="text-sm text-muted-foreground">
            {t('avgTimeOnMarketCard.toRent', { count: data?.rentalsCount ?? 0 })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default AvgTimeOnMarketCard
