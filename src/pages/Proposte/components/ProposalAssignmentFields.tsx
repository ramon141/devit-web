import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LeadSelect } from '@/components/RemoteSelects'
import type { ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

type ProposalAssignmentFieldsProps = {
  control: Control<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
}

function ProposalAssignmentFields({ control, errors }: ProposalAssignmentFieldsProps) {
  const { t } = useTranslation('proposte')

  return (
    <>
      <div id="modal-field-leadId">
        <Controller
          control={control}
          name="leadId"
          render={({ field }) => (
            <LeadSelect
              label={t('assignmentFields.leadLabel')}
              value={field.value}
              onValueChange={field.onChange}
              placeholder={t('assignmentFields.leadPlaceholder')}
              searchPlaceholder={t('assignmentFields.leadSearchPlaceholder')}
              error={errors.leadId?.message}
            />
          )}
        />
      </div>
    </>
  )
}

export default ProposalAssignmentFields
