import { useFormState, useWatch, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import InputMoney from '@/components/InputMoney'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { RentalContractFormValues } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

type RentalFinancialFieldsProps = {
  form: UseFormReturn<RentalContractFormValues>
}

function RentalFinancialFields({ form }: RentalFinancialFieldsProps) {
  const { register, control, setValue } = form
  const { errors } = useFormState({ control })
  const rentAmount = useWatch({ control, name: 'rentAmount' })
  const condoFee = useWatch({ control, name: 'condoFee' })
  const depositAmount = useWatch({ control, name: 'depositAmount' })

  return (
    <>
      <InputMoney
        name="rentAmount"
        label="Valore dell'affitto"
        required
        value={rentAmount}
        setValue={(value) => setValue('rentAmount', value ?? '')}
        error={errors.rentAmount?.message}
      />

      <InputMoney
        name="condoFee"
        label="Spese condominiali"
        value={condoFee}
        setValue={(value) => setValue('condoFee', value)}
      />

      <InputMoney
        name="depositAmount"
        label="Deposito cauzionale"
        value={depositAmount}
        setValue={(value) => setValue('depositAmount', value)}
      />

      <FormFieldWrapper label="Giorno di scadenza" required error={errors.dueDay?.message}>
        <Input {...register('dueDay')} type="number" placeholder="5" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Indice di adeguamento" error={errors.adjustmentIndex?.message}>
        <Input {...register('adjustmentIndex')} placeholder="ISTAT" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Preavviso (giorni)" error={errors.noticeDays?.message}>
        <Input {...register('noticeDays')} type="number" placeholder="30" />
      </FormFieldWrapper>
    </>
  )
}

export default RentalFinancialFields
