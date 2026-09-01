import { useTranslation } from 'react-i18next'
import SelectField, { type SelectFieldOption } from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersOwnerOrderByProps = {
  filters: PropertyFiltersValues
  ownerOptions: SelectFieldOption[]
  update: (patch: Partial<PropertyFiltersValues>) => void
}

function PropertyFiltersOwnerOrderBy({ filters, ownerOptions, update }: PropertyFiltersOwnerOrderByProps) {
  const { t } = useTranslation('imoveis')

  const orderByOptions = [
    { value: 'createdAt_desc', label: t('filters.orderBy.createdAtDesc') },
    { value: 'createdAt_asc', label: t('filters.orderBy.createdAtAsc') },
    { value: 'code_asc', label: t('filters.orderBy.codeAsc') },
    { value: 'code_desc', label: t('filters.orderBy.codeDesc') },
    { value: 'salePrice_asc', label: t('filters.orderBy.salePriceAsc') },
    { value: 'salePrice_desc', label: t('filters.orderBy.salePriceDesc') },
  ]

  return (
    <>
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
    </>
  )
}

export default PropertyFiltersOwnerOrderBy
