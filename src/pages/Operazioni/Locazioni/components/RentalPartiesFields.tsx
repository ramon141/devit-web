import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import {
  usePropertyControllerFind,
  usePersonControllerFind,
  useUserControllerFind,
} from '@/api/generated/api'
import type { RentalContractFormValues } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

type RentalPartiesFieldsProps = {
  control: Control<RentalContractFormValues>
  errors: FieldErrors<RentalContractFormValues>
}

function RentalPartiesFields({ control, errors }: RentalPartiesFieldsProps) {
  const { t } = useTranslation('operazioni')
  const { data: properties } = usePropertyControllerFind({ filter: { order: ['code ASC'], limit: 200 } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const propertyOptions = (properties ?? []).map((property) => ({
    value: property.id ?? '',
    label: `${property.code} · ${property.title}`,
  }))
  const personOptions = (people ?? []).map((person) => ({
    value: person.id ?? '',
    label: person.name,
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
            label={t('locazioni.partiesFields.propertyLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={propertyOptions}
            placeholder={t('locazioni.partiesFields.propertyPlaceholder')}
            searchPlaceholder={t('locazioni.partiesFields.propertySearchPlaceholder')}
            error={errors.propertyId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="ownerId"
        render={({ field }) => (
          <SearchableSelect
            label={t('locazioni.partiesFields.ownerLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={personOptions}
            placeholder={t('locazioni.partiesFields.ownerPlaceholder')}
            searchPlaceholder={t('locazioni.partiesFields.personSearchPlaceholder')}
            error={errors.ownerId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="tenantId"
        render={({ field }) => (
          <SearchableSelect
            label={t('locazioni.partiesFields.tenantLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={personOptions}
            placeholder={t('locazioni.partiesFields.tenantPlaceholder')}
            searchPlaceholder={t('locazioni.partiesFields.personSearchPlaceholder')}
            error={errors.tenantId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="ownerAgentId"
        render={({ field }) => (
          <SearchableSelect
            label={t('locazioni.partiesFields.ownerAgentLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={userOptions}
            placeholder={t('locazioni.partiesFields.noneOption')}
            searchPlaceholder={t('locazioni.partiesFields.agentSearchPlaceholder')}
            error={errors.ownerAgentId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="tenantAgentId"
        render={({ field }) => (
          <SearchableSelect
            label={t('locazioni.partiesFields.tenantAgentLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={userOptions}
            placeholder={t('locazioni.partiesFields.noneOption')}
            searchPlaceholder={t('locazioni.partiesFields.agentSearchPlaceholder')}
            error={errors.tenantAgentId?.message}
          />
        )}
      />
    </>
  )
}

export default RentalPartiesFields
