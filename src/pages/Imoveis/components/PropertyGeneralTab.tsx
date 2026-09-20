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
  onBack?: () => void
}

function PropertyGeneralTab({ form, onSubmit, isSubmitting, propertyId, onBack }: PropertyGeneralTabProps) {
  const { t } = useTranslation('imoveis')
  const { control } = form
  const { errors } = useFormState({ control })

  return (
    <form onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <FormFieldWrapper id="property-field-code" label={t('generalTab.codeLabel')} required error={errors.code?.message}>
          <PropertyCodeField form={form} />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-title" label={t('generalTab.titleLabel')} required error={errors.title?.message}>
          <ControlledInput control={control} name="title" placeholder={t('generalTab.titlePlaceholder')} />
        </FormFieldWrapper>

        <PropertyCategoryOwnerFields control={control} errors={errors} />

        <FormFieldWrapper id="property-field-purpose" label={t('generalTab.purposeLabel')} required error={errors.purpose?.message}>
          <Controller
            control={control}
            name="purpose"
            render={({ field }) => (
              <SelectField value={field.value} onValueChange={field.onChange} options={getPurposeOptions(t)} />
            )}
          />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-status" label={t('generalTab.statusLabel')} required error={errors.status?.message}>
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
      </div>

      <PropertyFormFooter id="property-tab-generale-actions" isSubmitting={isSubmitting} onBack={onBack} />
    </form>
  )
}

export default PropertyGeneralTab
