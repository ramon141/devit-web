import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormEvent } from 'react'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import ControlledInput from '@/components/ControlledInput'
import PropertyCategoryOwnerFields from '@/pages/Imoveis/components/PropertyCategoryOwnerFields'
import PropertyCodeField from '@/pages/Imoveis/components/PropertyCodeField'
import PropertyFlagsRow from '@/pages/Imoveis/components/PropertyFlagsRow'
import PropertyOwnersManager from '@/pages/Imoveis/Scheda/components/PropertyOwnersManager'
import { getPurposeOptions, getStatusOptions, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyGeneralTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  propertyId?: string
}

function PropertyGeneralTab({ form, onSubmit, isSubmitting, propertyId }: PropertyGeneralTabProps) {
  const { t } = useTranslation('imoveis')
  const { control } = form
  const { errors } = useFormState({ control })

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label={t('generalTab.codeLabel')} required error={errors.code?.message}>
        <PropertyCodeField form={form} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('generalTab.titleLabel')} required error={errors.title?.message}>
        <ControlledInput control={control} name="title" placeholder={t('generalTab.titlePlaceholder')} />
      </FormFieldWrapper>

      <PropertyCategoryOwnerFields control={control} errors={errors} />

      <FormFieldWrapper label={t('generalTab.purposeLabel')} required error={errors.purpose?.message}>
        <Controller
          control={control}
          name="purpose"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={getPurposeOptions(t)} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('generalTab.statusLabel')} required error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={getStatusOptions(t)} />
          )}
        />
      </FormFieldWrapper>

      <PropertyFlagsRow control={control} />

      <PropertyOwnersManager propertyId={propertyId ?? ''} />

      <PropertyFormFooter isSubmitting={isSubmitting} />
    </form>
  )
}

export default PropertyGeneralTab
