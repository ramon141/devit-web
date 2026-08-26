import { useState } from 'react'
import { SlidersHorizontalIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import { usePropertyCategoryControllerFind, usePersonControllerFind } from '@/api/generated/api'
import { purposeOptions, statusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

const orderByOptions = [
  { value: 'createdAt_desc', label: 'Più recenti' },
  { value: 'createdAt_asc', label: 'Meno recenti' },
  { value: 'code_asc', label: 'Codice crescente' },
  { value: 'code_desc', label: 'Codice decrescente' },
  { value: 'salePrice_asc', label: 'Prezzo crescente' },
  { value: 'salePrice_desc', label: 'Prezzo decrescente' },
]

type PropertyFiltersProps = {
  filters: PropertyFiltersValues
  onChange: (filters: PropertyFiltersValues) => void
}

function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { data: categories } = usePropertyCategoryControllerFind({ filter: { order: ['name ASC'] } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })

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
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
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
        <Button type="button" variant="outline" className="gap-1.5" onClick={() => setShowAdvanced((v) => !v)}>
          <SlidersHorizontalIcon className="size-4" />
          Filtri avanzati
        </Button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-2 rounded-lg p-3 ring-1 ring-border sm:grid-cols-6">
          <div className="sm:col-span-2">
            <SearchableSelect
              value={filters.ownerId}
              onValueChange={(value) => update({ ownerId: value })}
              options={ownerOptions}
              placeholder="Proprietario"
              searchPlaceholder="Cerca un cliente..."
            />
          </div>
          <SelectField
            value={filters.orderBy}
            onValueChange={(value) => update({ orderBy: value as PropertyFiltersValues['orderBy'] })}
            options={orderByOptions}
            placeholder="Ordina per"
          />
          <Input
            value={filters.bedroomsMin}
            onChange={(event) => update({ bedroomsMin: event.target.value })}
            type="number"
            placeholder="Camere da"
          />
          <Input
            value={filters.bedroomsMax}
            onChange={(event) => update({ bedroomsMax: event.target.value })}
            type="number"
            placeholder="Camere a"
          />
          <Input
            value={filters.bathroomsMin}
            onChange={(event) => update({ bathroomsMin: event.target.value })}
            type="number"
            placeholder="Bagni da"
          />
          <Input
            value={filters.bathroomsMax}
            onChange={(event) => update({ bathroomsMax: event.target.value })}
            type="number"
            placeholder="Bagni a"
          />
          <Input
            value={filters.areaMin}
            onChange={(event) => update({ areaMin: event.target.value })}
            type="number"
            placeholder="m² da"
          />
          <Input
            value={filters.areaMax}
            onChange={(event) => update({ areaMax: event.target.value })}
            type="number"
            placeholder="m² a"
          />
        </div>
      )}
    </div>
  )
}

export default PropertyFilters
