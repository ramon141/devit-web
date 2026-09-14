import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import MultiSelectField from '@/components/MultiSelectField'
import { usePropertyCategoryControllerFind } from '@/api/generated/api'
import { getLeadPurposeOptions, type LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'
import { useNeighborhoodOptions } from '@/hooks/useNeighborhoodOptions'
import LeadRangeFields from '@/pages/Clientes/Leads/components/LeadRangeFields'

type LeadCriteriaFieldsProps = {
  form: UseFormReturn<LeadFormValues>
}

// Critérios da richiesta: motivo, tipologia, scadenza, zonas e faixas de busca
function LeadCriteriaFields({ form }: LeadCriteriaFieldsProps) {
  const { t } = useTranslation('clientes')
  const { register, control } = form
  const { errors } = useFormState({ control })
  const neighborhoodOptions = useNeighborhoodOptions()

  const { data: categories } = usePropertyCategoryControllerFind({
    filter: { where: { active: true }, order: ['displayOrder ASC', 'name ASC'] },
  })

  const categoryOptions = (categories ?? []).map((category) => ({
    value: category.id ?? '',
    label: category.name,
  }))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper id="modal-field-purpose" label={t('leadFormFields.purpose')} error={errors.purpose?.message}>
        <Controller
          control={control}
          name="purpose"
          render={({ field }) => (
            <SelectField
              value={field.value ?? undefined}
              onValueChange={field.onChange}
              options={getLeadPurposeOptions(t)}
              placeholder={t('leadFormFields.purposePlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="modal-field-category" label={t('leadFormFields.category')} error={errors.categoryId?.message}>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={categoryOptions}
              placeholder={t('leadFormFields.categoryPlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="modal-field-expiresAt" label={t('leadFormFields.expiresAt')} error={errors.expiresAt?.message}>
        <Input {...register('expiresAt')} type="date" />
      </FormFieldWrapper>

      <div id="modal-field-zones" className="sm:col-span-2">
        <Controller
          control={control}
          name="neighborhoodIds"
          render={({ field }) => (
            <MultiSelectField
              options={neighborhoodOptions}
              values={field.value}
              onChange={field.onChange}
              label={t('leadFormFields.zones')}
              placeholder={t('leadFormFields.zonesPlaceholder')}
              searchPlaceholder={t('leadFormFields.zonesSearchPlaceholder')}
              error={errors.neighborhoodIds?.message}
            />
          )}
        />
      </div>

      <LeadRangeFields id="modal-field-priceRange" form={form} name="Budget" label={t('leadFormFields.priceRange')} />
      <LeadRangeFields id="modal-field-areaRange" form={form} name="AreaSqm" label={t('leadFormFields.areaRange')} />
      <LeadRangeFields id="modal-field-roomsRange" form={form} name="Rooms" label={t('leadFormFields.roomsRange')} />
      <LeadRangeFields id="modal-field-bedroomsRange" form={form} name="Bedrooms" label={t('leadFormFields.bedroomsRange')} />
      <LeadRangeFields id="modal-field-bathroomsRange" form={form} name="Bathrooms" label={t('leadFormFields.bathroomsRange')} />
    </div>
  )
}

export default LeadCriteriaFields
