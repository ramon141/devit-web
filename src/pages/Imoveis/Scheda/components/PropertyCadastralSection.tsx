import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyCadastralForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyCadastralForm'

type PropertyCadastralSectionProps = {
  propertyId: string
}

function PropertyCadastralSection({ propertyId }: PropertyCadastralSectionProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyCadastralForm(propertyId)
  const { register } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
      <p className="text-sm font-medium sm:col-span-3">Dati catastali</p>

      <FormFieldWrapper label="Partita"><Input {...register('partita')} /></FormFieldWrapper>
      <FormFieldWrapper label="Mappali"><Input {...register('mappali')} /></FormFieldWrapper>
      <FormFieldWrapper label="Categoria"><Input {...register('category')} /></FormFieldWrapper>
      <FormFieldWrapper label="Foglio"><Input {...register('foglio')} /></FormFieldWrapper>
      <FormFieldWrapper label="Particella"><Input {...register('particella')} /></FormFieldWrapper>
      <FormFieldWrapper label="Subalterno"><Input {...register('subalterno')} /></FormFieldWrapper>
      <FormFieldWrapper label="Rendita"><Input {...register('rendita')} type="number" /></FormFieldWrapper>

      <div className="flex justify-end sm:col-span-3">
        <Button type="submit" disabled={isSubmitting}>Salva dati catastali</Button>
      </div>
    </form>
  )
}

export default PropertyCadastralSection
