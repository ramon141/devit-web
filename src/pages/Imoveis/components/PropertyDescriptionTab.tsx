import { useFormState, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledInput from '@/components/ControlledInput'
import ControlledTextarea from '@/components/ControlledTextarea'
import PropertyDescrizioneTab from '@/pages/Imoveis/Scheda/components/PropertyDescrizioneTab'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyDescriptionTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  propertyId?: string
}

function PropertyDescriptionTab({ form, onSubmit, isSubmitting, propertyId }: PropertyDescriptionTabProps) {
  const { control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <FormFieldWrapper label="M² totali" error={errors.areaSqm?.message}>
          <ControlledInput control={control} name="areaSqm" type="number" placeholder="90" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Camere da letto" error={errors.bedrooms?.message}>
          <ControlledInput control={control} name="bedrooms" type="number" placeholder="2" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Bagni" error={errors.bathrooms?.message}>
          <ControlledInput control={control} name="bathrooms" type="number" placeholder="1" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Posti auto" error={errors.parkingSpots?.message}>
          <ControlledInput control={control} name="parkingSpots" type="number" placeholder="1" />
        </FormFieldWrapper>

        <div className="sm:col-span-2">
          <FormFieldWrapper label="Descrizione" error={errors.description?.message}>
            <ControlledTextarea control={control} name="description" rows={4} />
          </FormFieldWrapper>
        </div>

        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            Salva descrizione
          </Button>
        </div>
      </form>

      {propertyId && (
        <>
          <Separator className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <PropertyDescrizioneTab propertyId={propertyId} />
          </div>
        </>
      )}
    </div>
  )
}

export default PropertyDescriptionTab
