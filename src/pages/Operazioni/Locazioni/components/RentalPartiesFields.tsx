import { Controller, type Control, type FieldErrors, type UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import PartyListManager from '@/components/PartyListManager'
import {
  usePropertyControllerFind,
  usePersonControllerFind,
  useUserControllerFind,
} from '@/api/generated/api'
import type { RentalContractFormValues } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

type RentalPartiesFieldsProps = {
  control: Control<RentalContractFormValues>
  errors: FieldErrors<RentalContractFormValues>
  setValue: UseFormSetValue<RentalContractFormValues>
  ownerIds: string[]
  setOwnerIds: (ids: string[]) => void
  tenantIds: string[]
  setTenantIds: (ids: string[]) => void
}

function RentalPartiesFields({
  control,
  errors,
  setValue,
  ownerIds,
  setOwnerIds,
  tenantIds,
  setTenantIds,
}: RentalPartiesFieldsProps) {
  const { t } = useTranslation('operazioni')
  const { data: properties } = usePropertyControllerFind({ filter: { order: ['code ASC'], limit: 200 } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  function updateOwnerIds(ids: string[]) {
    setOwnerIds(ids)
    setValue('ownerId', ids.filter(Boolean)[0] ?? '', { shouldValidate: true })
  }

  function updateTenantIds(ids: string[]) {
    setTenantIds(ids)
    setValue('tenantId', ids.filter(Boolean)[0] ?? '', { shouldValidate: true })
  }

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

      <PartyListManager
        label={t('locazioni.partiesFields.ownerLabel')}
        options={personOptions}
        personIds={ownerIds}
        onChange={updateOwnerIds}
        placeholder={t('locazioni.partiesFields.ownerPlaceholder')}
        addLabel={t('locazioni.partiesFields.addOwner')}
      />
      {errors.ownerId?.message && (
        <p className="text-sm text-destructive sm:col-span-2">{errors.ownerId.message}</p>
      )}

      <PartyListManager
        label={t('locazioni.partiesFields.tenantLabel')}
        options={personOptions}
        personIds={tenantIds}
        onChange={updateTenantIds}
        placeholder={t('locazioni.partiesFields.tenantPlaceholder')}
        addLabel={t('locazioni.partiesFields.addTenant')}
      />
      {errors.tenantId?.message && (
        <p className="text-sm text-destructive sm:col-span-2">{errors.tenantId.message}</p>
      )}

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
