import { Controller, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import RentalPartiesFields from '@/pages/Operazioni/Locazioni/components/RentalPartiesFields'
import RentalFinancialFields from '@/pages/Operazioni/Locazioni/components/RentalFinancialFields'
import {
  rentalSituationOptions,
  type RentalContractFormValues,
} from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

type RentalFormFieldsProps = {
  form: UseFormReturn<RentalContractFormValues>
}

function RentalFormFields({ form }: RentalFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label="Numero" required error={errors.number?.message}>
        <Input {...register('number')} placeholder="LOC-0001" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Situazione" required error={errors.situation?.message}>
        <Controller
          control={control}
          name="situation"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={rentalSituationOptions} />
          )}
        />
      </FormFieldWrapper>

      <RentalPartiesFields control={control} errors={errors} />

      <FormFieldWrapper label="Data di inizio" required error={errors.startDate?.message}>
        <Input {...register('startDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Data di fine" error={errors.endDate?.message}>
        <Input {...register('endDate')} type="date" />
      </FormFieldWrapper>

      <RentalFinancialFields form={form} />

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Note" error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={2} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default RentalFormFields
