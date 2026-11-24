import { cn } from '@/lib/utils'
import { toggleBoxClass } from '@/lib/toggleBox'
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

// A última linha da grade nunca fica com buraco: o último item ocupa as colunas que sobram
function getLastItemSpan(total: number) {
  const mobile = total % 2 === 1 ? 'col-span-2' : 'col-span-1'
  const desktop = ['sm:col-span-1', 'sm:col-span-3', 'sm:col-span-2'][total % 3]

  return `${mobile} ${desktop}`
}

function PropertyFeaturesSection({ propertyId, category, title, options }: PropertyFeaturesSectionProps) {
  const { activeKeys, toggle } = usePropertyFeatures(propertyId, category)

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option, index) => (
          <label
            key={option.key}
            className={cn(toggleBoxClass, index === options.length - 1 && getLastItemSpan(options.length))}
          >
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
