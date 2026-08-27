import { useTranslation } from 'react-i18next'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import type { PropertiesReportControllerRecent200Item } from '@/api/generated/models'

type RecentPropertiesCardProps = {
  properties: PropertiesReportControllerRecent200Item[]
}

function RecentPropertiesCard({ properties }: RecentPropertiesCardProps) {
  const { t } = useTranslation('home')

  return (
    <DashboardCard title={t('recentPropertiesCard.title')} count={properties.length}>
      {properties.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('recentPropertiesCard.empty')}</p>
      )}

      {properties.map((property) => (
        <div key={property.id} className="rounded-lg px-2 py-1.5 hover:bg-accent hover:text-accent-foreground">
          <p className="truncate text-sm font-medium">{property.title ?? property.code}</p>
          <p className="text-xs text-muted-foreground">
            {property.code} · {property.status}
          </p>
        </div>
      ))}
    </DashboardCard>
  )
}

export default RecentPropertiesCard
