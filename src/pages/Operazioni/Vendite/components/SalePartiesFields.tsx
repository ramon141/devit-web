import { Controller, type Control, type FieldErrors, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import MultiSelectField from '@/components/MultiSelectField'
import {
  usePersonControllerFind,
  usePurchaseProposalControllerFind,
  useUserControllerFind,
} from '@/api/generated/api'
import { usePropertySearchOptions } from '@/hooks/usePropertySearchOptions'
import { usePersonSearchOptions } from '@/hooks/usePersonSearchOptions'
import type { SaleFormValues } from '@/pages/Operazioni/Vendite/schemas/saleSchema'

type SalePartiesFieldsProps = {
  control: Control<SaleFormValues>
  errors: FieldErrors<SaleFormValues>
}

function SalePartiesFields({ control, errors }: SalePartiesFieldsProps) {
  const { t } = useTranslation('operazioni')
  const propertyId = useWatch({ control, name: 'propertyId' })
  const sellerId = useWatch({ control, name: 'sellerId' })
  const buyerId = useWatch({ control, name: 'buyerId' })

  const {
    options: propertyOptions,
    isLoading: isLoadingProperties,
    setSearch: setPropertySearch,
  } = usePropertySearchOptions(propertyId)
  const {
    options: sellerOptions,
    isLoading: isLoadingSellers,
    setSearch: setSellerSearch,
  } = usePersonSearchOptions(sellerId)
  const {
    options: buyerOptions,
    isLoading: isLoadingBuyers,
    setSearch: setBuyerSearch,
  } = usePersonSearchOptions(buyerId)

  // Os 200 primeiros nomes seguem valendo pra "outros vendedores/compradores"
  // e proposta: são listas auxiliares, de uso bem mais raro que os campos
  // principais acima.
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: proposals } = usePurchaseProposalControllerFind({ filter: { order: ['number ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

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
      <div id="modal-field-propertyId">
        <Controller
          control={control}
          name="propertyId"
          render={({ field }) => (
            <SearchableSelect
              label={t('vendite.partiesFields.propertyLabel')}
              value={field.value}
              onValueChange={field.onChange}
              options={propertyOptions}
              onSearchChange={setPropertySearch}
              isLoading={isLoadingProperties}
              placeholder={t('vendite.partiesFields.propertyPlaceholder')}
              searchPlaceholder={t('vendite.partiesFields.propertySearchPlaceholder')}
              error={errors.propertyId?.message}
            />
          )}
        />
      </div>

      <div id="modal-field-sellerId">
        <Controller
          control={control}
          name="sellerId"
          render={({ field }) => (
            <SearchableSelect
              label={t('vendite.partiesFields.sellerLabel')}
              value={field.value}
              onValueChange={field.onChange}
              options={sellerOptions}
              onSearchChange={setSellerSearch}
              isLoading={isLoadingSellers}
              placeholder={t('vendite.partiesFields.sellerPlaceholder')}
              searchPlaceholder={t('vendite.partiesFields.personSearchPlaceholder')}
              error={errors.sellerId?.message}
            />
          )}
        />
      </div>

      <div id="modal-field-buyerId">
        <Controller
          control={control}
          name="buyerId"
          render={({ field }) => (
            <SearchableSelect
              label={t('vendite.partiesFields.buyerLabel')}
              value={field.value}
              onValueChange={field.onChange}
              options={buyerOptions}
              onSearchChange={setBuyerSearch}
              isLoading={isLoadingBuyers}
              placeholder={t('vendite.partiesFields.buyerPlaceholder')}
              searchPlaceholder={t('vendite.partiesFields.personSearchPlaceholder')}
              error={errors.buyerId?.message}
            />
          )}
        />
      </div>

      <div id="modal-field-proposalId">
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
      </div>

      <div id="modal-field-extraSellerIds">
        <Controller
          control={control}
          name="extraSellerIds"
          render={({ field }) => (
            <MultiSelectField
              label={t('vendite.partiesFields.extraSellersLabel')}
              values={field.value ?? []}
              onChange={field.onChange}
              options={personOptions}
            />
          )}
        />
      </div>

      <div id="modal-field-extraBuyerIds">
        <Controller
          control={control}
          name="extraBuyerIds"
          render={({ field }) => (
            <MultiSelectField
              label={t('vendite.partiesFields.extraBuyersLabel')}
              values={field.value ?? []}
              onChange={field.onChange}
              options={personOptions}
            />
          )}
        />
      </div>

      <FormFieldWrapper
        id="modal-field-sellerAgentId"
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
        id="modal-field-buyerAgentId"
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
