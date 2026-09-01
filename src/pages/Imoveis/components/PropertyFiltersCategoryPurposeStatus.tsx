import { useTranslation } from 'react-i18next'
import SelectField, { type SelectFieldOption } from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { getPurposeOptions, getStatusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersCategoryPurposeStatusProps = {
  filters: PropertyFiltersValues
  categoryOptions: SelectFieldOption[]
  update: (patch: Partial<PropertyFiltersValues>) => void
}

function PropertyFiltersCategoryPurposeStatus({
  filters,
  categoryOptions,
  update,
}: PropertyFiltersCategoryPurposeStatusProps) {
  const { t } = useTranslation('imoveis')

  return (
    <>
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
    </>
  )
}

export default PropertyFiltersCategoryPurposeStatus
