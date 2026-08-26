import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import { usePropertyCategoryControllerFind, usePersonControllerFind } from '@/api/generated/api'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyCategoryOwnerFieldsProps = {
  control: Control<PropertyFormValues>
  errors: FieldErrors<PropertyFormValues>
}

function PropertyCategoryOwnerFields({ control, errors }: PropertyCategoryOwnerFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { data: categories } = usePropertyCategoryControllerFind({ filter: { order: ['name ASC'] } })
  const { data: owners } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id ?? '',
    label: category.name,
  }))
  const ownerOptions = (owners ?? []).map((person) => ({
    value: person.id ?? '',
    label: person.name,
  }))

  return (
    <>
      <FormFieldWrapper label={t('categoryOwnerFields.categoryLabel')} required error={errors.categoryId?.message}>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={categoryOptions} />
          )}
        />
      </FormFieldWrapper>

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
            placeholder={t('categoryOwnerFields.ownerPlaceholder')}
            searchPlaceholder={t('categoryOwnerFields.searchClientPlaceholder')}
            error={errors.ownerId?.message}
          />
        )}
      />
    </>
  )
}

export default PropertyCategoryOwnerFields
