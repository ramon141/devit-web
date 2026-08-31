import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import RentalPartiesFields from '@/pages/Operazioni/Locazioni/components/RentalPartiesFields'
import RentalFinancialFields from '@/pages/Operazioni/Locazioni/components/RentalFinancialFields'
import {
  getRentalSituationOptions,
  type RentalContractFormValues,
} from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

type RentalFormFieldsProps = {
  form: UseFormReturn<RentalContractFormValues>
}

function RentalFormFields({ form }: RentalFormFieldsProps) {
  const { t } = useTranslation('operazioni')
  const { register, control } = form
  const { errors } = useFormState({ control })
  const situationOptions = getRentalSituationOptions(t)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label={t('locazioni.formFields.numberLabel')} required error={errors.number?.message}>
        <Input {...register('number')} placeholder={t('locazioni.formFields.numberPlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.formFields.situationLabel')} required error={errors.situation?.message}>
        <Controller
          control={control}
          name="situation"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={situationOptions} />
          )}
        />
      </FormFieldWrapper>

      <RentalPartiesFields control={control} errors={errors} />

      <FormFieldWrapper label={t('locazioni.formFields.startDateLabel')} required error={errors.startDate?.message}>
        <Input {...register('startDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.formFields.endDateLabel')} error={errors.endDate?.message}>
        <Input {...register('endDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('locazioni.formFields.stipulaDateLabel')}
        error={errors.stipulaDate?.message}
      >
        <Input {...register('stipulaDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('locazioni.formFields.registeredAtLabel')}
        error={errors.registeredAt?.message}
      >
        <Input {...register('registeredAt')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('locazioni.formFields.renewalDueDateLabel')}
        error={errors.renewalDueDate?.message}
      >
        <Input {...register('renewalDueDate')} type="date" />
      </FormFieldWrapper>

      <RentalFinancialFields form={form} />

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('locazioni.formFields.notesLabel')} error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={2} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default RentalFormFields
