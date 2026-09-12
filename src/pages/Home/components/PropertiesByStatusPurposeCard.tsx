import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/charts/DonutChart'
import ChartSkeleton from '@/pages/Home/components/ChartSkeleton'
import { usePropertiesReportControllerByStatusPurpose } from '@/api/generated/api'
import { getStatusOptions, getPurposeOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { getOptionLabel } from '@/utils/getOptionLabel'

function PropertiesByStatusPurposeCard() {
  const { t } = useTranslation('home')
  const { t: tImoveis } = useTranslation('imoveis')
  const { data, isLoading } = usePropertiesReportControllerByStatusPurpose()
  const byStatus = data?.byStatus ?? []
  const byPurpose = data?.byPurpose ?? []

  const statusOptions = getStatusOptions(tImoveis)
  const purposeOptions = getPurposeOptions(tImoveis)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('propertiesByStatusPurposeCard.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoading ? (
          <div className="col-span-2 flex justify-center">
            <ChartSkeleton />
          </div>
        ) : (
          <>
            <div>
              <p className="mb-2 text-center text-xs text-muted-foreground">
                {t('propertiesByStatusPurposeCard.byStatus')}
              </p>
              <DonutChart
                labels={byStatus.map((row) =>
                  getOptionLabel(statusOptions, row.status, row.status ?? '')
                )}
                values={byStatus.map((row) => row.total ?? 0)}
                height={200}
              />
            </div>

            <div>
              <p className="mb-2 text-center text-xs text-muted-foreground">
                {t('propertiesByStatusPurposeCard.byPurpose')}
              </p>
              <DonutChart
                labels={byPurpose.map((row) =>
                  getOptionLabel(purposeOptions, row.purpose, row.purpose ?? '')
                )}
                values={byPurpose.map((row) => row.total ?? 0)}
                height={200}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default PropertiesByStatusPurposeCard
