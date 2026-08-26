import { Check } from 'lucide-react'
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

      <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3">
        {features.map((feature, index) => (
          <span key={feature.featureKey ?? index} className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-primary" />
            {feature.featureKey ? formatFeatureLabel(feature.featureKey) : 'Caratteristica'}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PropertyFeatures
