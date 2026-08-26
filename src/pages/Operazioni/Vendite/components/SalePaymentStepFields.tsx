import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import SaleFinancialFields from '@/pages/Operazioni/Vendite/components/SaleFinancialFields'
import {
  getSalePaymentMethodOptions,
  getSaleStatusOptions,
  type SaleFormValues,
} from '@/pages/Operazioni/Vendite/schemas/saleSchema'

type SalePaymentStepFieldsProps = {
  form: UseFormReturn<SaleFormValues>
}

function SalePaymentStepFields({ form }: SalePaymentStepFieldsProps) {
  const { t } = useTranslation('operazioni')
  const { register, control } = form
  const { errors } = useFormState({ control })
  const paymentMethodOptions = getSalePaymentMethodOptions(t)
  const statusOptions = getSaleStatusOptions(t)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper
        label={t('vendite.paymentStepFields.paymentMethodLabel')}
        required
        error={errors.paymentMethod?.message}
      >
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={paymentMethodOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.paymentStepFields.statusLabel')} required error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={statusOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.paymentStepFields.deedDateLabel')} error={errors.deedDate?.message}>
        <Input {...register('deedDate')} type="date" />
      </FormFieldWrapper>

      <SaleFinancialFields form={form} />

      <div className="sm:col-span-2">
        <FormFieldWrapper
          label={t('vendite.paymentStepFields.cancellationReasonLabel')}
          error={errors.cancellationReason?.message}
        >
          <Input {...register('cancellationReason')} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('vendite.paymentStepFields.notesLabel')} error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={2} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default SalePaymentStepFields
