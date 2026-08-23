import { Input } from '@/components/ui/input'
import SelectField from '@/components/SelectField'
import { usePropertyCategoryControllerFind } from '@/api/generated/api'
import { purposeOptions, statusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersProps = {
  filters: PropertyFiltersValues
  onChange: (filters: PropertyFiltersValues) => void
}

function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const { data: categories } = usePropertyCategoryControllerFind({ filter: { order: ['name ASC'] } })
  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id ?? '',
    label: category.name,
  }))

  function update(patch: Partial<PropertyFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
      <SelectField
        value={filters.categoryId}
        onValueChange={(value) => update({ categoryId: value })}
        options={categoryOptions}
        placeholder="Categoria"
      />
      <SelectField
        value={filters.purpose}
        onValueChange={(value) => update({ purpose: value })}
        options={purposeOptions}
        placeholder="Finalità"
      />
      <SelectField
        value={filters.status}
        onValueChange={(value) => update({ status: value })}
        options={statusOptions}
        placeholder="Stato"
      />
      <Input
        value={filters.priceMin}
        onChange={(event) => update({ priceMin: event.target.value })}
        type="number"
        placeholder="Prezzo da"
      />
      <Input
        value={filters.priceMax}
        onChange={(event) => update({ priceMax: event.target.value })}
        type="number"
        placeholder="Prezzo a"
      />
    </div>
  )
}

export default PropertyFilters
