import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledSelectField from '@/components/ControlledSelectField'
import ControlledMoney from '@/components/ControlledMoney'
import ProposalPropertyBuyerFields from '@/pages/Proposte/components/ProposalPropertyBuyerFields'
import ProposalAssignmentFields from '@/pages/Proposte/components/ProposalAssignmentFields'
import ProposalDatesAndNotesFields from '@/pages/Proposte/components/ProposalDatesAndNotesFields'
import {
  getPaymentMethodOptions,
  getProposalStatusOptions,
  type ProposalFormValues,
} from '@/pages/Proposte/schemas/proposalSchema'

type ProposalFormFieldsProps = {
  form: UseFormReturn<ProposalFormValues>
}

function ProposalFormFields({ form }: ProposalFormFieldsProps) {
  const { t } = useTranslation('proposte')
  const { register, control, setValue } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper
        label={t('formFields.numberLabel')}
        required
        error={errors.number?.message}
      >
        <Input {...register('number')} placeholder={t('formFields.numberPlaceholder')} />
      </FormFieldWrapper>

      <ControlledMoney
        control={control}
        setValue={setValue}
        name="proposalAmount"
        label={t('formFields.amountLabel')}
        required
        error={errors.proposalAmount?.message}
      />

      <ProposalPropertyBuyerFields control={control} errors={errors} />

      <ControlledSelectField
        control={control}
        name="paymentMethod"
        label={t('formFields.paymentMethodLabel')}
        required
        options={getPaymentMethodOptions(t)}
        error={errors.paymentMethod?.message}
      />

      <ControlledSelectField
        control={control}
        name="status"
        label={t('formFields.statusLabel')}
        required
        options={getProposalStatusOptions(t)}
        error={errors.status?.message}
      />

      <ProposalAssignmentFields control={control} errors={errors} />

      <ProposalDatesAndNotesFields form={form} />
    </div>
  )
}

export default ProposalFormFields
