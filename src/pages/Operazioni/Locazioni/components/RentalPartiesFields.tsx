import { Controller, type Control, type FieldErrors, type UseFormSetValue, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import PartyListManager from '@/components/PartyListManager'
import { usePropertySearchOptions } from '@/hooks/usePropertySearchOptions'
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
  const propertyId = useWatch({ control, name: 'propertyId' })
  const {
    options: propertyOptions,
    isLoading: isLoadingProperties,
    setSearch: setPropertySearch,
  } = usePropertySearchOptions(propertyId)

  function updateOwnerIds(ids: string[]) {
    setOwnerIds(ids)
    setValue('ownerId', ids.filter(Boolean)[0] ?? '', { shouldValidate: true })
  }

  function updateTenantIds(ids: string[]) {
    setTenantIds(ids)
    setValue('tenantId', ids.filter(Boolean)[0] ?? '', { shouldValidate: true })
  }

  return (
    <>
      <div id="modal-field-propertyId">
        <Controller
          control={control}
          name="propertyId"
          render={({ field }) => (
            <SearchableSelect
              label={t('locazioni.partiesFields.propertyLabel')}
              required
              value={field.value}
              onValueChange={field.onChange}
              options={propertyOptions}
              onSearchChange={setPropertySearch}
              isLoading={isLoadingProperties}
              placeholder={t('locazioni.partiesFields.propertyPlaceholder')}
              searchPlaceholder={t('locazioni.partiesFields.propertySearchPlaceholder')}
              error={errors.propertyId?.message}
            />
          )}
        />
      </div>

      <div id="modal-field-ownerIds">
        <PartyListManager
          label={t('locazioni.partiesFields.ownerLabel')}
          required
          personIds={ownerIds}
          onChange={updateOwnerIds}
          placeholder={t('locazioni.partiesFields.ownerPlaceholder')}
          addLabel={t('locazioni.partiesFields.addOwner')}
        />
        {errors.ownerId?.message && (
          <p className="text-sm text-destructive sm:col-span-2">{errors.ownerId.message}</p>
        )}
      </div>

      <div id="modal-field-tenantIds">
        <PartyListManager
          label={t('locazioni.partiesFields.tenantLabel')}
          required
          personIds={tenantIds}
          onChange={updateTenantIds}
          placeholder={t('locazioni.partiesFields.tenantPlaceholder')}
          addLabel={t('locazioni.partiesFields.addTenant')}
        />
        {errors.tenantId?.message && (
          <p className="text-sm text-destructive sm:col-span-2">{errors.tenantId.message}</p>
        )}
      </div>
    </>
  )
}

export default RentalPartiesFields
