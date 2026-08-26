import { useFormState, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledInput from '@/components/ControlledInput'
import PropertyLocationDetailSection from '@/pages/Imoveis/Scheda/components/PropertyLocationDetailSection'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyLocationTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  propertyId?: string
}

function PropertyLocationTab({ form, onSubmit, isSubmitting, propertyId }: PropertyLocationTabProps) {
  const { control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <FormFieldWrapper label="Paese" error={errors.country?.message}>
          <ControlledInput control={control} name="country" placeholder="Italia" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Città" required error={errors.city?.message}>
          <ControlledInput control={control} name="city" placeholder="Milano" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Regione" error={errors.region?.message}>
          <ControlledInput control={control} name="region" placeholder="Lombardia" />
        </FormFieldWrapper>

        <FormFieldWrapper label="CAP" error={errors.postalCode?.message}>
          <ControlledInput control={control} name="postalCode" placeholder="20121" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Via" error={errors.street?.message}>
          <ControlledInput control={control} name="street" placeholder="Via Roma" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Numero civico" error={errors.number?.message}>
          <ControlledInput control={control} name="number" placeholder="12" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Quartiere" error={errors.neighborhood?.message}>
          <ControlledInput control={control} name="neighborhood" placeholder="Centro" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Complemento" error={errors.complement?.message}>
          <ControlledInput control={control} name="complement" placeholder="Piano 3, interno 2" />
        </FormFieldWrapper>

        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            Salva localizzazione
          </Button>
        </div>
      </form>

      {propertyId && <PropertyLocationDetailSection propertyId={propertyId} />}
    </div>
  )
}

export default PropertyLocationTab
