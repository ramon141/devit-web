import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyAdditionalForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyAdditionalForm'

type PropertyAdditionalSectionProps = {
  propertyId: string
}

function PropertyAdditionalSection({ propertyId }: PropertyAdditionalSectionProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyAdditionalForm(propertyId)
  const { register } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <p className="text-sm font-medium sm:col-span-2">Caratteristiche aggiuntive</p>

      <FormFieldWrapper label="Numero di locali"><Input {...register('roomsCount')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Qualità"><Input {...register('quality')} /></FormFieldWrapper>
      <FormFieldWrapper label="Abitabilità"><Input {...register('habitability')} /></FormFieldWrapper>
      <FormFieldWrapper label="Infissi"><Input {...register('windowFrames')} /></FormFieldWrapper>

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>Salva caratteristiche</Button>
      </div>
    </form>
  )
}

export default PropertyAdditionalSection
