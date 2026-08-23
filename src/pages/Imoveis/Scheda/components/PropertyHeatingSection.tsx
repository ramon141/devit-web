import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { usePropertyHeatingForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyHeatingForm'

const heatingTypeOptions = [
  { value: 'autonomous', label: 'Autonomo' },
  { value: 'centralized', label: 'Centralizzato' },
  { value: 'none', label: 'Nessuno' },
]

type PropertyHeatingSectionProps = {
  propertyId: string
}

function PropertyHeatingSection({ propertyId }: PropertyHeatingSectionProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyHeatingForm(propertyId)
  const { register, control } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <p className="text-sm font-medium sm:col-span-2">Riscaldamento</p>

      <FormFieldWrapper label="Tipo">
        <Controller control={control} name="heatingType" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={heatingTypeOptions} placeholder="Nessuno" />
        )} />
      </FormFieldWrapper>
      <FormFieldWrapper label="Combustibile"><Input {...register('fuel')} placeholder="Metano" /></FormFieldWrapper>
      <FormFieldWrapper label="Sistema"><Input {...register('system')} placeholder="A pavimento" /></FormFieldWrapper>
      <FormFieldWrapper label="Costo mensile"><Input {...register('monthlyCost')} type="number" /></FormFieldWrapper>

      <Controller control={control} name="hasRadiators" render={({ field }) => (
        <label className="flex items-center gap-2 self-end pb-1.5 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Con radiatori</label>
      )} />

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>Salva riscaldamento</Button>
      </div>
    </form>
  )
}

export default PropertyHeatingSection
