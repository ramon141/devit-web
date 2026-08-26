import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import SaleFinancialFields from '@/pages/Operazioni/Vendite/components/SaleFinancialFields'
import {
  salePaymentMethodOptions,
  saleStatusOptions,
  type SaleFormValues,
} from '@/pages/Operazioni/Vendite/schemas/saleSchema'

type SalePaymentStepFieldsProps = {
  form: UseFormReturn<SaleFormValues>
}

function SalePaymentStepFields({ form }: SalePaymentStepFieldsProps) {
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label="Modalità di pagamento" required error={errors.paymentMethod?.message}>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={salePaymentMethodOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Stato" required error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={saleStatusOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Data di escritura" error={errors.deedDate?.message}>
        <Input {...register('deedDate')} type="date" />
      </FormFieldWrapper>

      <SaleFinancialFields form={form} />

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Motivo di annullamento" error={errors.cancellationReason?.message}>
          <Input {...register('cancellationReason')} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Note" error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={2} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default SalePaymentStepFields
