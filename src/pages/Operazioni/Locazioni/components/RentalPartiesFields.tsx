import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import SelectField from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
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

      <FormFieldWrapper
        label={t('locazioni.partiesFields.ownerAgentLabel')}
        error={errors.ownerAgentId?.message}
      >
        <Controller
          control={control}
          name="ownerAgentId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={userOptions}
              placeholder={t('locazioni.partiesFields.noneOption')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('locazioni.partiesFields.tenantAgentLabel')}
        error={errors.tenantAgentId?.message}
      >
        <Controller
          control={control}
          name="tenantAgentId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={userOptions}
              placeholder={t('locazioni.partiesFields.noneOption')}
            />
          )}
        />
      </FormFieldWrapper>
    </>
  )
}

export default RentalPartiesFields
