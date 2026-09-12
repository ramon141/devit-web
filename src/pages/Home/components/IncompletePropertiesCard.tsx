import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import { usePropertiesReportControllerIncomplete } from '@/api/generated/api'

function IncompletePropertiesCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = usePropertiesReportControllerIncomplete()
  const properties = data ?? []

  return (
    <DashboardCard
      title={t('incompletePropertiesCard.title')}
      count={properties.length}
      isLoading={isLoading}
    >
      {properties.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('incompletePropertiesCard.empty')}</p>
      )}

      {properties.map((property) => (
        <div
          key={property.id}
          className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{property.code}</p>
            <p className="truncate text-xs text-muted-foreground">{property.title}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {property.missingDescription && (
              <Badge variant="destructive">
                {t('incompletePropertiesCard.missingDescription')}
              </Badge>
            )}

            {property.missingPhotos && (
              <Badge variant="destructive">{t('incompletePropertiesCard.missingPhotos')}</Badge>
            )}
          </div>
        </div>
      ))}
    </DashboardCard>
  )
}

export default IncompletePropertiesCard
