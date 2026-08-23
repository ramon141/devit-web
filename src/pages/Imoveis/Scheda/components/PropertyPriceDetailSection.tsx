import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyPriceDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyPriceDetailForm'

type PropertyPriceDetailSectionProps = {
  propertyId: string
}

const flagFields = [
  { name: 'negotiable', label: 'Prezzo trattabile' },
  { name: 'priceFrom', label: 'Prezzo "a partire da"' },
  { name: 'hiddenOnPrint', label: 'Nascosto su stampati' },
  { name: 'hiddenOnInternet', label: 'Nascosto su internet' },
  { name: 'boxIncludedInPrice', label: 'Box incluso nel prezzo' },
  { name: 'auction', label: 'Immobile all’asta' },
] as const

function PropertyPriceDetailSection({ propertyId }: PropertyPriceDetailSectionProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyPriceDetailForm(propertyId)
  const { register, control } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <Separator className="sm:col-span-2" />
      <p className="text-sm font-medium sm:col-span-2">Opzioni di prezzo</p>

      <FormFieldWrapper label="Valore di stima">
        <Input {...register('estimatedValue')} type="number" />
      </FormFieldWrapper>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        {flagFields.map((flag) => (
          <Controller
            key={flag.name}
            control={control}
            name={flag.name}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                {flag.label}
              </label>
            )}
          />
        ))}
      </div>

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>Salva opzioni di prezzo</Button>
      </div>
    </form>
  )
}

export default PropertyPriceDetailSection
