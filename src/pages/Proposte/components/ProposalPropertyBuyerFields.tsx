import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import SearchableSelect from '@/components/SearchableSelect'
import { usePropertyControllerFind, usePersonControllerFind } from '@/api/generated/api'
import type { ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

type ProposalPropertyBuyerFieldsProps = {
  control: Control<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
}

function ProposalPropertyBuyerFields({ control, errors }: ProposalPropertyBuyerFieldsProps) {
  const { data: properties } = usePropertyControllerFind({ filter: { order: ['code ASC'], limit: 200 } })
  const { data: buyers } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })

  const propertyOptions = (properties ?? []).map((property) => ({
    value: property.id ?? '',
    label: `${property.code} · ${property.title}`,
  }))
  const buyerOptions = (buyers ?? []).map((person) => ({
    value: person.id ?? '',
    label: person.name,
  }))

  return (
    <>
      <Controller
        control={control}
        name="propertyId"
        render={({ field }) => (
          <SearchableSelect
            label="Immobile"
            value={field.value}
            onValueChange={field.onChange}
            options={propertyOptions}
            placeholder="Seleziona un immobile"
            searchPlaceholder="Cerca per codice o titolo..."
            error={errors.propertyId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="buyerId"
        render={({ field }) => (
          <SearchableSelect
            label="Acquirente"
            value={field.value}
            onValueChange={field.onChange}
            options={buyerOptions}
            placeholder="Seleziona un acquirente"
            searchPlaceholder="Cerca un cliente..."
            error={errors.buyerId?.message}
          />
        )}
      />
    </>
  )
}

export default ProposalPropertyBuyerFields
