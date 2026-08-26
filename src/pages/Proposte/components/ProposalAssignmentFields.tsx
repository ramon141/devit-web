import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import {
  useLeadControllerFind,
  useUserControllerFind,
} from '@/api/generated/api'
import type { ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

type ProposalAssignmentFieldsProps = {
  control: Control<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
}

function ProposalAssignmentFields({ control, errors }: ProposalAssignmentFieldsProps) {
  const { t } = useTranslation('proposte')
  const { data: leads } = useLeadControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const leadOptions = (leads ?? []).map((lead) => ({
    value: lead.id ?? '',
    label: lead.name,
  }))
  const userOptions = (users ?? []).map((user) => ({
    value: user.id ?? '',
    label: user.fullName,
  }))

  return (
    <>
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

      <Controller
        control={control}
        name="assignedToId"
        render={({ field }) => (
          <SearchableSelect
            label={t('assignmentFields.assignedToLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={userOptions}
            placeholder={t('assignmentFields.assignedToPlaceholder')}
            searchPlaceholder={t('assignmentFields.assignedToSearchPlaceholder')}
            error={errors.assignedToId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="sellerAgentId"
        render={({ field }) => (
          <SearchableSelect
            label={t('assignmentFields.sellerAgentLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={userOptions}
            placeholder={t('assignmentFields.sellerAgentPlaceholder')}
            searchPlaceholder={t('assignmentFields.sellerAgentSearchPlaceholder')}
            error={errors.sellerAgentId?.message}
          />
        )}
      />
    </>
  )
}

export default ProposalAssignmentFields
