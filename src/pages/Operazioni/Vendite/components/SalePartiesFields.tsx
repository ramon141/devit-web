import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import {
  usePropertyControllerFind,
  usePersonControllerFind,
  usePurchaseProposalControllerFind,
  useUserControllerFind,
} from '@/api/generated/api'
import type { SaleFormValues } from '@/pages/Operazioni/Vendite/schemas/saleSchema'

type SalePartiesFieldsProps = {
  control: Control<SaleFormValues>
  errors: FieldErrors<SaleFormValues>
}

function SalePartiesFields({ control, errors }: SalePartiesFieldsProps) {
  const { data: properties } = usePropertyControllerFind({ filter: { order: ['code ASC'], limit: 200 } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: proposals } = usePurchaseProposalControllerFind({ filter: { order: ['number ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const propertyOptions = (properties ?? []).map((property) => ({
    value: property.id ?? '',
    label: `${property.code} · ${property.title}`,
  }))
  const personOptions = (people ?? []).map((person) => ({
    value: person.id ?? '',
    label: person.name,
  }))
  const proposalOptions = (proposals ?? []).map((proposal) => ({
    value: proposal.id ?? '',
    label: proposal.number,
  }))
  const userOptions = (users ?? []).map((user) => ({
    value: user.id ?? '',
    label: user.fullName,
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
        name="sellerId"
        render={({ field }) => (
          <SearchableSelect
            label="Venditore"
            value={field.value}
            onValueChange={field.onChange}
            options={personOptions}
            placeholder="Seleziona un venditore"
            searchPlaceholder="Cerca un cliente..."
            error={errors.sellerId?.message}
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
            options={personOptions}
            placeholder="Seleziona un acquirente"
            searchPlaceholder="Cerca un cliente..."
            error={errors.buyerId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="proposalId"
        render={({ field }) => (
          <SearchableSelect
            label="Proposta di origine"
            value={field.value}
            onValueChange={field.onChange}
            options={proposalOptions}
            placeholder="Nessuna"
            searchPlaceholder="Cerca per numero..."
            error={errors.proposalId?.message}
          />
        )}
      />

      <FormFieldWrapper label="Agente del venditore" error={errors.sellerAgentId?.message}>
        <Controller
          control={control}
          name="sellerAgentId"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={userOptions} placeholder="Nessuno" />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Agente dell'acquirente" error={errors.buyerAgentId?.message}>
        <Controller
          control={control}
          name="buyerAgentId"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={userOptions} placeholder="Nessuno" />
          )}
        />
      </FormFieldWrapper>
    </>
  )
}

export default SalePartiesFields
