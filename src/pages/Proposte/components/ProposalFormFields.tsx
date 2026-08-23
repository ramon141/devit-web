import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import InputMoney from '@/components/InputMoney'
import ProposalPropertyBuyerFields from '@/pages/Proposte/components/ProposalPropertyBuyerFields'
import ProposalDatesAndNotesFields from '@/pages/Proposte/components/ProposalDatesAndNotesFields'
import {
  paymentMethodOptions,
  proposalStatusOptions,
  type ProposalFormValues,
} from '@/pages/Proposte/schemas/proposalSchema'

type ProposalFormFieldsProps = {
  form: UseFormReturn<ProposalFormValues>
}

function ProposalFormFields({ form }: ProposalFormFieldsProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form
  const proposalAmount = useWatch({ control, name: 'proposalAmount' })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label="Numero" required error={errors.number?.message}>
        <Input {...register('number')} placeholder="PROP-0001" />
      </FormFieldWrapper>

      <InputMoney
        name="proposalAmount"
        label="Valore della proposta"
        required
        value={proposalAmount}
        setValue={(value) => setValue('proposalAmount', value ?? '')}
        error={errors.proposalAmount?.message}
      />

      <ProposalPropertyBuyerFields control={control} errors={errors} />

      <FormFieldWrapper label="Modalità di pagamento" required error={errors.paymentMethod?.message}>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={paymentMethodOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Stato" required error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={proposalStatusOptions} />
          )}
        />
      </FormFieldWrapper>

      <ProposalDatesAndNotesFields form={form} />
    </div>
  )
}

export default ProposalFormFields
