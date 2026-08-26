import { Controller, type Control, type FieldErrors } from 'react-hook-form'
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
            label="Lead di origine"
            value={field.value}
            onValueChange={field.onChange}
            options={leadOptions}
            placeholder="Nessuno"
            searchPlaceholder="Cerca un lead..."
            error={errors.leadId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="assignedToId"
        render={({ field }) => (
          <SearchableSelect
            label="Responsabile"
            value={field.value}
            onValueChange={field.onChange}
            options={userOptions}
            placeholder="Nessuno"
            searchPlaceholder="Cerca un utente..."
            error={errors.assignedToId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="sellerAgentId"
        render={({ field }) => (
          <SearchableSelect
            label="Agente venditore"
            value={field.value}
            onValueChange={field.onChange}
            options={userOptions}
            placeholder="Nessuno"
            searchPlaceholder="Cerca un utente..."
            error={errors.sellerAgentId?.message}
          />
        )}
      />
    </>
  )
}

export default ProposalAssignmentFields
