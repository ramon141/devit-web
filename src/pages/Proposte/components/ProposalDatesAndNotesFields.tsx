import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

type ProposalDatesAndNotesFieldsProps = {
  form: UseFormReturn<ProposalFormValues>
}

function ProposalDatesAndNotesFields({ form }: ProposalDatesAndNotesFieldsProps) {
  const { t } = useTranslation('proposte')
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <>
      <FormFieldWrapper
        label={t('datesAndNotesFields.proposalDateLabel')}
        required
        error={errors.proposalDate?.message}
      >
        <Input {...register('proposalDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('datesAndNotesFields.validUntilLabel')}
        error={errors.validUntil?.message}
      >
        <Input {...register('validUntil')} type="date" />
      </FormFieldWrapper>

      <Controller
        control={control}
        name="financed"
        render={({ field }) => (
          <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('datesAndNotesFields.financedLabel')}
          </label>
        )}
      />

      <div className="sm:col-span-2">
        <FormFieldWrapper
          label={t('datesAndNotesFields.paymentTermsLabel')}
          error={errors.paymentTerms?.message}
        >
          <Textarea {...register('paymentTerms')} rows={2} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper
          label={t('datesAndNotesFields.rejectionReasonLabel')}
          error={errors.rejectionReason?.message}
        >
          <Input {...register('rejectionReason')} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper
          label={t('datesAndNotesFields.notesLabel')}
          error={errors.notes?.message}
        >
          <Textarea {...register('notes')} rows={2} />
        </FormFieldWrapper>
      </div>
    </>
  )
}

export default ProposalDatesAndNotesFields
