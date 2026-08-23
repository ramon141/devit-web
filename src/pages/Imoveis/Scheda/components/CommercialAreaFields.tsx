import { Controller, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { CommercialFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyCommercialForm'

type CommercialAreaFieldsProps = {
  form: UseFormReturn<CommercialFormValues>
}

function CommercialAreaFields({ form }: CommercialAreaFieldsProps) {
  const { register, control } = form

  return (
    <>
      <FormFieldWrapper label="Numero di vetrine"><Input {...register('showcaseCount')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Esposizione vetrine"><Input {...register('showcaseExposure')} /></FormFieldWrapper>
      <FormFieldWrapper label="M² coperti"><Input {...register('coveredAreaSqm')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="M² scoperti"><Input {...register('uncoveredAreaSqm')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="M² copribili"><Input {...register('coverableAreaSqm')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Separazione ambienti"><Input {...register('roomSeparation')} /></FormFieldWrapper>
      <FormFieldWrapper label="Contesto"><Input {...register('context')} /></FormFieldWrapper>

      <Controller control={control} name="manageable" render={({ field }) => (
        <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
          <Switch checked={field.value} onCheckedChange={field.onChange} />
          Gestibile in affitto
        </label>
      )} />
    </>
  )
}

export default CommercialAreaFields
