import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import SearchableSelect from '@/components/SearchableSelect'
import { usePropertyControllerFind, usePersonControllerFind } from '@/api/generated/api'
import type { RentalContractFormValues } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

type RentalPartiesFieldsProps = {
  control: Control<RentalContractFormValues>
  errors: FieldErrors<RentalContractFormValues>
}

function RentalPartiesFields({ control, errors }: RentalPartiesFieldsProps) {
  const { data: properties } = usePropertyControllerFind({ filter: { order: ['code ASC'], limit: 200 } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })

  const propertyOptions = (properties ?? []).map((property) => ({
    value: property.id ?? '',
    label: `${property.code} · ${property.title}`,
  }))
  const personOptions = (people ?? []).map((person) => ({
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
        name="ownerId"
        render={({ field }) => (
          <SearchableSelect
            label="Proprietario"
            value={field.value}
            onValueChange={field.onChange}
            options={personOptions}
            placeholder="Seleziona un proprietario"
            searchPlaceholder="Cerca un cliente..."
            error={errors.ownerId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="tenantId"
        render={({ field }) => (
          <SearchableSelect
            label="Inquilino"
            value={field.value}
            onValueChange={field.onChange}
            options={personOptions}
            placeholder="Seleziona un inquilino"
            searchPlaceholder="Cerca un cliente..."
            error={errors.tenantId?.message}
          />
        )}
      />
    </>
  )
}

export default RentalPartiesFields
