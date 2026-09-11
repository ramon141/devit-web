import type { PropertyWithRelations } from '@/api/generated/models'
import PropertyCardHeader from '@/pages/Imoveis/components/PropertyCardHeader'
import PropertyCardBody from '@/pages/Imoveis/components/PropertyCardBody'
import PropertyCardFooter from '@/pages/Imoveis/components/PropertyCardFooter'

type PropertyCardProps = {
  property: PropertyWithRelations
}

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-card ring-1 ring-border">
      <PropertyCardHeader property={property} />
      <PropertyCardBody property={property} />
      <PropertyCardFooter property={property} />
    </div>
  )
}

export default PropertyCard
