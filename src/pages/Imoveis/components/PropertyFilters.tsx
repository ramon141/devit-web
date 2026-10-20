import { useState } from 'react'
import { usePropertyCategoryControllerFind } from '@/api/generated/api'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'
import { usePropertyFacets } from '@/pages/Imoveis/hooks/usePropertyFacets'
import PropertyFiltersCategoryPurposeStatus from '@/pages/Imoveis/components/PropertyFiltersCategoryPurposeStatus'
import PropertyFiltersPriceRangeToggle from '@/pages/Imoveis/components/PropertyFiltersPriceRangeToggle'
import PropertyFiltersOwnerOrderBy from '@/pages/Imoveis/components/PropertyFiltersOwnerOrderBy'
import PropertyFiltersRoomsRange from '@/pages/Imoveis/components/PropertyFiltersRoomsRange'
import PropertyFiltersAreaCity from '@/pages/Imoveis/components/PropertyFiltersAreaCity'
import PropertyFiltersBroker from '@/pages/Imoveis/components/PropertyFiltersBroker'
import PropertyFiltersCheckboxes from '@/pages/Imoveis/components/PropertyFiltersCheckboxes'
import { STABLE_DATA } from '@/constants/queryOptions'

type PropertyFiltersProps = {
  filters: PropertyFiltersValues
  onChange: (filters: PropertyFiltersValues) => void
}

function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { data: categories } = usePropertyCategoryControllerFind({ filter: { order: ['name ASC'] } }, STABLE_DATA)
  const { cities } = usePropertyFacets()

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id ?? '',
    label: category.name,
  }))

  function update(patch: Partial<PropertyFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="mb-4 grid gap-2">
      <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-6">
        <PropertyFiltersCategoryPurposeStatus filters={filters} categoryOptions={categoryOptions} update={update} />
        <PropertyFiltersPriceRangeToggle
          filters={filters}
          update={update}
          onToggleAdvanced={() => setShowAdvanced((v) => !v)}
        />
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 items-end gap-2 rounded-lg p-3 ring-1 ring-border sm:grid-cols-6">
          <PropertyFiltersOwnerOrderBy filters={filters} update={update} />
          <PropertyFiltersRoomsRange filters={filters} update={update} />
          <PropertyFiltersAreaCity filters={filters} cities={cities} update={update} />
          <PropertyFiltersBroker filters={filters} update={update} />
          <PropertyFiltersCheckboxes filters={filters} update={update} />
        </div>
      )}
    </div>
  )
}

export default PropertyFilters
