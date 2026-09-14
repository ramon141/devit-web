import { useFormState, useWatch, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import InputMoney from '@/components/InputMoney'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { RentalContractFormValues } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

type RentalFinancialFieldsProps = {
  form: UseFormReturn<RentalContractFormValues>
}

function RentalFinancialFields({ form }: RentalFinancialFieldsProps) {
  const { t } = useTranslation('operazioni')
  const { register, control, setValue } = form
  const { errors } = useFormState({ control })
  const rentAmount = useWatch({ control, name: 'rentAmount' })
  const condoFee = useWatch({ control, name: 'condoFee' })
  const depositAmount = useWatch({ control, name: 'depositAmount' })

  return (
    <>
      <div id="modal-field-rentAmount">
        <InputMoney
          name="rentAmount"
          label={t('locazioni.financialFields.rentAmountLabel')}
          required
          value={rentAmount}
          setValue={(value) => setValue('rentAmount', value ?? '')}
          error={errors.rentAmount?.message}
        />
      </div>

      <div id="modal-field-condoFee">
        <InputMoney
          name="condoFee"
          label={t('locazioni.financialFields.condoFeeLabel')}
          value={condoFee}
          setValue={(value) => setValue('condoFee', value)}
        />
      </div>

      <div id="modal-field-depositAmount">
        <InputMoney
          name="depositAmount"
          label={t('locazioni.financialFields.depositAmountLabel')}
          value={depositAmount}
          setValue={(value) => setValue('depositAmount', value)}
        />
      </div>

      <FormFieldWrapper
        id="modal-field-dueDay"
        label={t('locazioni.financialFields.dueDayLabel')}
        required
        error={errors.dueDay?.message}
      >
        <Input {...register('dueDay')} type="number" placeholder={t('locazioni.financialFields.dueDayPlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="modal-field-adjustmentIndex"
        label={t('locazioni.financialFields.adjustmentIndexLabel')}
        error={errors.adjustmentIndex?.message}
      >
        <Input
          {...register('adjustmentIndex')}
          placeholder={t('locazioni.financialFields.adjustmentIndexPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="modal-field-noticeDays"
        label={t('locazioni.financialFields.noticeDaysLabel')}
        error={errors.noticeDays?.message}
      >
        <Input
          {...register('noticeDays')}
          type="number"
          placeholder={t('locazioni.financialFields.noticeDaysPlaceholder')}
        />
      </FormFieldWrapper>
    </>
  )
}

export default RentalFinancialFields
