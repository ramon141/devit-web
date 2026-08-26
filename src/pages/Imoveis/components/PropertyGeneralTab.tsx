import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import ControlledInput from '@/components/ControlledInput'
import PropertyCategoryOwnerFields from '@/pages/Imoveis/components/PropertyCategoryOwnerFields'
import PropertyFlagsRow from '@/pages/Imoveis/components/PropertyFlagsRow'
import PropertyOwnersManager from '@/pages/Imoveis/Scheda/components/PropertyOwnersManager'
import { purposeOptions, statusOptions, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyGeneralTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  propertyId?: string
}

function PropertyGeneralTab({ form, onSubmit, isSubmitting, propertyId }: PropertyGeneralTabProps) {
  const { control } = form
  const { errors } = useFormState({ control })

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label="Codice" required error={errors.code?.message}>
        <ControlledInput control={control} name="code" placeholder="AP001" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Titolo" required error={errors.title?.message}>
        <ControlledInput control={control} name="title" placeholder="Appartamento in centro" />
      </FormFieldWrapper>

      <PropertyCategoryOwnerFields control={control} errors={errors} />

      <FormFieldWrapper label="Finalità" required error={errors.purpose?.message}>
        <Controller
          control={control}
          name="purpose"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={purposeOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Stato" required error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={statusOptions} />
          )}
        />
      </FormFieldWrapper>

      <PropertyFlagsRow control={control} />

      {propertyId && <PropertyOwnersManager propertyId={propertyId} />}

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          Salva generale
        </Button>
      </div>
    </form>
  )
}

export default PropertyGeneralTab
