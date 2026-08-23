import { Checkbox } from '@/components/ui/checkbox'
import type { PropertyFeatureCategory } from '@/api/generated/models'
import { usePropertyFeatures } from '@/pages/Imoveis/Scheda/hooks/usePropertyFeatures'

type FeatureOption = { key: string; label: string }

type PropertyFeaturesSectionProps = {
  propertyId: string
  category: PropertyFeatureCategory
  title: string
  options: FeatureOption[]
}

function PropertyFeaturesSection({ propertyId, category, title, options }: PropertyFeaturesSectionProps) {
  const { activeKeys, toggle } = usePropertyFeatures(propertyId, category)

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option.key} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={activeKeys.has(option.key)}
              onCheckedChange={() => toggle(option.key)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export default PropertyFeaturesSection
