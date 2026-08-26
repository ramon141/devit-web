import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SalePartiesFields from '@/pages/Operazioni/Vendite/components/SalePartiesFields'
import type { SaleFormValues } from '@/pages/Operazioni/Vendite/schemas/saleSchema'

type SaleGeneralStepFieldsProps = {
  form: UseFormReturn<SaleFormValues>
}

function SaleGeneralStepFields({ form }: SaleGeneralStepFieldsProps) {
  const { t } = useTranslation('operazioni')
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label={t('vendite.generalStepFields.numberLabel')} required error={errors.number?.message}>
        <Input {...register('number')} placeholder={t('vendite.generalStepFields.numberPlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('vendite.generalStepFields.saleDateLabel')}
        required
        error={errors.saleDate?.message}
      >
        <Input {...register('saleDate')} type="date" />
      </FormFieldWrapper>

      <SalePartiesFields control={control} errors={errors} />
    </div>
  )
}

export default SaleGeneralStepFields
