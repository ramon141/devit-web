import { Badge } from '@/components/ui/badge'
import { formatFeatureLabel } from '@/pages/Site/PropertyDetail/utils/formatters'
import type { PublicPropertyControllerFindById200FeaturesItem } from '@/api/generated/models'

type PropertyFeaturesProps = {
  features: PublicPropertyControllerFindById200FeaturesItem[] | undefined
}

function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (!features || features.length === 0) return null

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">Caratteristiche</h2>

      <div className="mt-2 flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <Badge key={feature.featureKey ?? index} variant="outline">
            {feature.featureKey ? formatFeatureLabel(feature.featureKey) : 'Caratteristica'}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default PropertyFeatures
