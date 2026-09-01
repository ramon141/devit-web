import { useState } from 'react'
import { usePropertyCategoryControllerFind, usePersonControllerFind } from '@/api/generated/api'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'
import { usePropertyFacets } from '@/pages/Imoveis/hooks/usePropertyFacets'
import PropertyFiltersCategoryPurposeStatus from '@/pages/Imoveis/components/PropertyFiltersCategoryPurposeStatus'
import PropertyFiltersPriceRangeToggle from '@/pages/Imoveis/components/PropertyFiltersPriceRangeToggle'
import PropertyFiltersOwnerOrderBy from '@/pages/Imoveis/components/PropertyFiltersOwnerOrderBy'
import PropertyFiltersRoomsRange from '@/pages/Imoveis/components/PropertyFiltersRoomsRange'
import PropertyFiltersAreaCity from '@/pages/Imoveis/components/PropertyFiltersAreaCity'
import PropertyFiltersCheckboxes from '@/pages/Imoveis/components/PropertyFiltersCheckboxes'

type PropertyFiltersProps = {
  filters: PropertyFiltersValues
  onChange: (filters: PropertyFiltersValues) => void
}

function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { data: categories } = usePropertyCategoryControllerFind({ filter: { order: ['name ASC'] } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { cities } = usePropertyFacets()

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id ?? '',
    label: category.name,
  }))
  const ownerOptions = (people ?? []).map((person) => ({ value: person.id ?? '', label: person.name }))

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
          <PropertyFiltersOwnerOrderBy filters={filters} ownerOptions={ownerOptions} update={update} />
          <PropertyFiltersRoomsRange filters={filters} update={update} />
          <PropertyFiltersAreaCity filters={filters} cities={cities} update={update} />
          <PropertyFiltersCheckboxes filters={filters} update={update} />
        </div>
      )}
    </div>
  )
}

export default PropertyFilters
