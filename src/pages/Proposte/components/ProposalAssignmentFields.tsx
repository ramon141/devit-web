import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import {
  useLeadControllerFind,
} from '@/api/generated/api'
import type { ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

type ProposalAssignmentFieldsProps = {
  control: Control<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
}

function ProposalAssignmentFields({ control, errors }: ProposalAssignmentFieldsProps) {
  const { t } = useTranslation('proposte')
  const { data: leads } = useLeadControllerFind({ filter: { order: ['name ASC'], limit: 200 } })

  const leadOptions = (leads ?? []).map((lead) => ({
    value: lead.id ?? '',
    label: lead.name,
  }))

  return (
    <>
      <div id="modal-field-leadId">
        <Controller
          control={control}
          name="leadId"
          render={({ field }) => (
            <SearchableSelect
              label={t('assignmentFields.leadLabel')}
              value={field.value}
              onValueChange={field.onChange}
              options={leadOptions}
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
