import { Controller, type Control, type FieldErrors, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import { usePropertyCategoryControllerFind } from '@/api/generated/api'
import { usePersonSearchOptions } from '@/hooks/usePersonSearchOptions'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyCategoryOwnerFieldsProps = {
  control: Control<PropertyFormValues>
  errors: FieldErrors<PropertyFormValues>
}

function PropertyCategoryOwnerFields({ control, errors }: PropertyCategoryOwnerFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { data: categories } = usePropertyCategoryControllerFind({ filter: { order: ['name ASC'] } })
  const ownerId = useWatch({ control, name: 'ownerId' })
  const {
    options: ownerOptions,
    isLoading: isLoadingOwners,
    setSearch: setOwnerSearch,
  } = usePersonSearchOptions(ownerId)

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id ?? '',
    label: category.name,
  }))

  return (
    <>
      <FormFieldWrapper
        id="property-field-categoryId"
        label={t('categoryOwnerFields.categoryLabel')}
        required
        error={errors.categoryId?.message}
      >
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={categoryOptions} />
          )}
        />
      </FormFieldWrapper>

      <div id="property-field-ownerId">
        <Controller
          control={control}
          name="ownerId"
          render={({ field }) => (
            <SearchableSelect
              label={t('categoryOwnerFields.ownerLabel')}
              required
              value={field.value}
              onValueChange={field.onChange}
              options={ownerOptions}
              onSearchChange={setOwnerSearch}
              isLoading={isLoadingOwners}
              placeholder={t('categoryOwnerFields.ownerPlaceholder')}
              searchPlaceholder={t('categoryOwnerFields.searchClientPlaceholder')}
              error={errors.ownerId?.message}
            />
          )}
        />
      </div>
    </>
  )
}

export default PropertyCategoryOwnerFields
