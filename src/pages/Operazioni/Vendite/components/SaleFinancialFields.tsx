import { useFormState, useWatch, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import InputMoney from '@/components/InputMoney'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { SaleFormValues } from '@/pages/Operazioni/Vendite/schemas/saleSchema'

type SaleFinancialFieldsProps = {
  form: UseFormReturn<SaleFormValues>
}

function SaleFinancialFields({ form }: SaleFinancialFieldsProps) {
  const { t } = useTranslation('operazioni')
  const { register, control, setValue } = form
  const { errors } = useFormState({ control })
  const finalAmount = useWatch({ control, name: 'finalAmount' })
  const downPayment = useWatch({ control, name: 'downPayment' })
  const commissionAmount = useWatch({ control, name: 'commissionAmount' })

  return (
    <>
      <div id="modal-field-finalAmount">
        <InputMoney
          name="finalAmount"
          label={t('vendite.financialFields.finalAmountLabel')}
          required
          value={finalAmount}
          setValue={(value) => setValue('finalAmount', value ?? '')}
          error={errors.finalAmount?.message}
        />
      </div>

      <div id="modal-field-downPayment">
        <InputMoney
          name="downPayment"
          label={t('vendite.financialFields.downPaymentLabel')}
          value={downPayment}
          setValue={(value) => setValue('downPayment', value)}
        />
      </div>

      <div id="modal-field-commissionAmount">
        <InputMoney
          name="commissionAmount"
          label={t('vendite.financialFields.commissionAmountLabel')}
          value={commissionAmount}
          setValue={(value) => setValue('commissionAmount', value)}
        />
      </div>

      <FormFieldWrapper
        id="modal-field-installmentsCount"
        label={t('vendite.financialFields.installmentsCountLabel')}
        error={errors.installmentsCount?.message}
      >
        <Input
          {...register('installmentsCount')}
          type="number"
          placeholder={t('vendite.financialFields.installmentsCountPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="modal-field-financialInstitution"
        label={t('vendite.financialFields.financialInstitutionLabel')}
        error={errors.financialInstitution?.message}
      >
        <Input {...register('financialInstitution')} />
      </FormFieldWrapper>
    </>
  )
}

export default SaleFinancialFields
