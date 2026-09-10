import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import DashboardCard from '@/pages/Home/components/DashboardCard'
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
          <div
            key={property.id}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-accent hover:text-accent-foreground"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {property.title ?? property.code}
              </p>
              <p className="truncate text-xs text-muted-foreground">{property.code}</p>
            </div>

            {property.status && (
              <Badge variant="secondary">
                {getOptionLabel(statusOptions, property.status)}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

export default RecentPropertiesCard
