import { useFormState, useWatch, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import InputMoney from '@/components/InputMoney'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { SaleFormValues } from '@/pages/Operazioni/Vendite/schemas/saleSchema'

type SaleFinancialFieldsProps = {
  form: UseFormReturn<SaleFormValues>
}

function SaleFinancialFields({ form }: SaleFinancialFieldsProps) {
  const { register, control, setValue } = form
  const { errors } = useFormState({ control })
  const finalAmount = useWatch({ control, name: 'finalAmount' })
  const downPayment = useWatch({ control, name: 'downPayment' })
  const commissionAmount = useWatch({ control, name: 'commissionAmount' })

  return (
    <>
      <InputMoney
        name="finalAmount"
        label="Valore finale"
        required
        value={finalAmount}
        setValue={(value) => setValue('finalAmount', value ?? '')}
        error={errors.finalAmount?.message}
      />

      <InputMoney
        name="downPayment"
        label="Entrata"
        value={downPayment}
        setValue={(value) => setValue('downPayment', value)}
      />

      <InputMoney
        name="commissionAmount"
        label="Valore della commissione"
        value={commissionAmount}
        setValue={(value) => setValue('commissionAmount', value)}
      />

      <FormFieldWrapper label="Numero di rate" error={errors.installmentsCount?.message}>
        <Input {...register('installmentsCount')} type="number" placeholder="12" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Istituto finanziario" error={errors.financialInstitution?.message}>
        <Input {...register('financialInstitution')} />
      </FormFieldWrapper>
    </>
  )
}

export default SaleFinancialFields
