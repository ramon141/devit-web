import DashboardCard from '@/pages/Home/components/DashboardCard'
import type { PropertiesReportControllerRecent200Item } from '@/api/generated/models'

type RecentPropertiesCardProps = {
  properties: PropertiesReportControllerRecent200Item[]
}

function RecentPropertiesCard({ properties }: RecentPropertiesCardProps) {
  return (
    <DashboardCard title="Ultimi immobili modificati" count={properties.length}>
      {properties.length === 0 && (
        <p className="text-sm text-muted-foreground">Nessun immobile modificato di recente.</p>
      )}

      {properties.map((property) => (
        <div key={property.id} className="rounded-lg px-2 py-1.5 hover:bg-muted/50">
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
