import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import PropertySummaryItem from '@/pages/Home/components/PropertySummaryItem'
import { getShortStatusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { getOptionLabel } from '@/utils/getOptionLabel'
import type { PropertiesReportControllerRecent200Item } from '@/api/generated/models'

type RecentPropertiesCardProps = {
  properties: PropertiesReportControllerRecent200Item[]
}

function RecentPropertiesCard({ properties }: RecentPropertiesCardProps) {
  const { t } = useTranslation('home')
  const { t: tImoveis } = useTranslation('imoveis')
  const statusOptions = getShortStatusOptions(tImoveis)

  return (
    <DashboardCard title={t('recentPropertiesCard.title')} count={properties.length}>
      {properties.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('recentPropertiesCard.empty')}</p>
      )}

      <div className="divide-y divide-border">
        {properties.map((property) => (
          <PropertySummaryItem
            key={property.id}
            property={property}
            date={property.updatedAt}
            action={
              property.status && (
                <Badge variant="secondary">
                  {getOptionLabel(statusOptions, property.status)}
                </Badge>
              )
            }
          />
        ))}
      </div>
    </DashboardCard>
  )
}

export default RecentPropertiesCard
