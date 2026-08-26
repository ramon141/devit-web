import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('operazioni')
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
            label={t('vendite.partiesFields.propertyLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={propertyOptions}
            placeholder={t('vendite.partiesFields.propertyPlaceholder')}
            searchPlaceholder={t('vendite.partiesFields.propertySearchPlaceholder')}
            error={errors.propertyId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="sellerId"
        render={({ field }) => (
          <SearchableSelect
            label={t('vendite.partiesFields.sellerLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={personOptions}
            placeholder={t('vendite.partiesFields.sellerPlaceholder')}
            searchPlaceholder={t('vendite.partiesFields.personSearchPlaceholder')}
            error={errors.sellerId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="buyerId"
        render={({ field }) => (
          <SearchableSelect
            label={t('vendite.partiesFields.buyerLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={personOptions}
            placeholder={t('vendite.partiesFields.buyerPlaceholder')}
            searchPlaceholder={t('vendite.partiesFields.personSearchPlaceholder')}
            error={errors.buyerId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="proposalId"
        render={({ field }) => (
          <SearchableSelect
            label={t('vendite.partiesFields.proposalLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={proposalOptions}
            placeholder={t('vendite.partiesFields.proposalPlaceholder')}
            searchPlaceholder={t('vendite.partiesFields.proposalSearchPlaceholder')}
            error={errors.proposalId?.message}
          />
        )}
      />

      <FormFieldWrapper
        label={t('vendite.partiesFields.sellerAgentLabel')}
        error={errors.sellerAgentId?.message}
      >
        <Controller
          control={control}
          name="sellerAgentId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={userOptions}
              placeholder={t('vendite.partiesFields.noneOption')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('vendite.partiesFields.buyerAgentLabel')}
        error={errors.buyerAgentId?.message}
      >
        <Controller
          control={control}
          name="buyerAgentId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={userOptions}
              placeholder={t('vendite.partiesFields.noneOption')}
            />
          )}
        />
      </FormFieldWrapper>
    </>
  )
}

export default SalePartiesFields
