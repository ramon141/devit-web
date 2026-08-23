import { Controller, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import type { CommercialFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyCommercialForm'

const scopeOptions = [
  { value: 'property', label: 'Solo immobile' },
  { value: 'activity', label: 'Solo attività' },
  { value: 'property_and_activity', label: 'Immobile e attività' },
]

type CommercialActivityFieldsProps = {
  form: UseFormReturn<CommercialFormValues>
}

function CommercialActivityFields({ form }: CommercialActivityFieldsProps) {
  const { register, control } = form

  return (
    <>
      <FormFieldWrapper label="Ambito">
        <Controller control={control} name="scope" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={scopeOptions} placeholder="Nessuno" />
        )} />
      </FormFieldWrapper>
      <FormFieldWrapper label="Attività principale"><Input {...register('mainActivity')} /></FormFieldWrapper>
      <FormFieldWrapper label="Attività alternative"><Input {...register('alternativeActivities')} placeholder="separate da virgola" /></FormFieldWrapper>
      <FormFieldWrapper label="Valore dell'attività"><Input {...register('activityValue')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Fatturato medio da"><Input {...register('averageRevenueFrom')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Fatturato medio a"><Input {...register('averageRevenueTo')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Affitto mensile"><Input {...register('monthlyRent')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Giorno di riposo settimanale"><Input {...register('weeklyRestDay')} /></FormFieldWrapper>
    </>
  )
}

export default CommercialActivityFields
