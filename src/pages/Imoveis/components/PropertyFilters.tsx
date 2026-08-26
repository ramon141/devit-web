import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontalIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyCategoryControllerFind, usePersonControllerFind } from '@/api/generated/api'
import { getPurposeOptions, getStatusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersProps = {
  filters: PropertyFiltersValues
  onChange: (filters: PropertyFiltersValues) => void
}

function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const { t } = useTranslation('imoveis')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { data: categories } = usePropertyCategoryControllerFind({ filter: { order: ['name ASC'] } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })

  const orderByOptions = [
    { value: 'createdAt_desc', label: t('filters.orderBy.createdAtDesc') },
    { value: 'createdAt_asc', label: t('filters.orderBy.createdAtAsc') },
    { value: 'code_asc', label: t('filters.orderBy.codeAsc') },
    { value: 'code_desc', label: t('filters.orderBy.codeDesc') },
    { value: 'salePrice_asc', label: t('filters.orderBy.salePriceAsc') },
    { value: 'salePrice_desc', label: t('filters.orderBy.salePriceDesc') },
  ]

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
        <FormFieldWrapper label={t('filters.categoryLabel')}>
          <SelectField
            value={filters.categoryId}
            onValueChange={(value) => update({ categoryId: value })}
            options={categoryOptions}
            placeholder={t('filters.categoryPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('filters.purposeLabel')}>
          <SelectField
            value={filters.purpose}
            onValueChange={(value) => update({ purpose: value })}
            options={getPurposeOptions(t)}
            placeholder={t('filters.purposePlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('filters.statusLabel')}>
          <SelectField
            value={filters.status}
            onValueChange={(value) => update({ status: value })}
            options={getStatusOptions(t)}
            placeholder={t('filters.statusPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('filters.priceFromLabel')}>
          <Input
            value={filters.priceMin}
            onChange={(event) => update({ priceMin: event.target.value })}
            type="number"
            placeholder={t('filters.priceFromPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('filters.priceToLabel')}>
          <Input
            value={filters.priceMax}
            onChange={(event) => update({ priceMax: event.target.value })}
            type="number"
            placeholder={t('filters.priceToPlaceholder')}
          />
        </FormFieldWrapper>

        <Button type="button" variant="outline" className="gap-1.5" onClick={() => setShowAdvanced((v) => !v)}>
          <SlidersHorizontalIcon className="size-4" />
          {t('filters.advancedFilters')}
        </Button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 items-end gap-2 rounded-lg p-3 ring-1 ring-border sm:grid-cols-6">
          <div className="sm:col-span-2">
            <FormFieldWrapper label={t('filters.ownerLabel')}>
              <SearchableSelect
                value={filters.ownerId}
                onValueChange={(value) => update({ ownerId: value })}
                options={ownerOptions}
                placeholder={t('filters.ownerPlaceholder')}
                searchPlaceholder={t('filters.searchClientPlaceholder')}
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper label={t('filters.orderByLabel')}>
            <SelectField
              value={filters.orderBy}
              onValueChange={(value) => update({ orderBy: value as PropertyFiltersValues['orderBy'] })}
              options={orderByOptions}
              placeholder={t('filters.orderByPlaceholder')}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('filters.bedroomsFromLabel')}>
            <Input
              value={filters.bedroomsMin}
              onChange={(event) => update({ bedroomsMin: event.target.value })}
              type="number"
              placeholder={t('filters.bedroomsFromPlaceholder')}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('filters.bedroomsToLabel')}>
            <Input
              value={filters.bedroomsMax}
              onChange={(event) => update({ bedroomsMax: event.target.value })}
              type="number"
              placeholder={t('filters.bedroomsToPlaceholder')}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('filters.bathroomsFromLabel')}>
            <Input
              value={filters.bathroomsMin}
              onChange={(event) => update({ bathroomsMin: event.target.value })}
              type="number"
              placeholder={t('filters.bathroomsFromPlaceholder')}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('filters.bathroomsToLabel')}>
            <Input
              value={filters.bathroomsMax}
              onChange={(event) => update({ bathroomsMax: event.target.value })}
              type="number"
              placeholder={t('filters.bathroomsToPlaceholder')}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('filters.areaFromLabel')}>
            <Input
              value={filters.areaMin}
              onChange={(event) => update({ areaMin: event.target.value })}
              type="number"
              placeholder={t('filters.areaFromPlaceholder')}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('filters.areaToLabel')}>
            <Input
              value={filters.areaMax}
              onChange={(event) => update({ areaMax: event.target.value })}
              type="number"
              placeholder={t('filters.areaToPlaceholder')}
            />
          </FormFieldWrapper>
        </div>
      )}
    </div>
  )
}

export default PropertyFilters
