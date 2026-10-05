import { Controller, type Control, type FieldErrors, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import { usePropertySearchOptions } from '@/hooks/usePropertySearchOptions'
import { usePersonSearchOptions } from '@/hooks/usePersonSearchOptions'
import type { ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

type ProposalPropertyBuyerFieldsProps = {
  control: Control<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
}

function ProposalPropertyBuyerFields({ control, errors }: ProposalPropertyBuyerFieldsProps) {
  const { t } = useTranslation('proposte')
  const propertyId = useWatch({ control, name: 'propertyId' })
  const buyerId = useWatch({ control, name: 'buyerId' })

  const {
    options: propertyOptions,
    isLoading: isLoadingProperties,
    setSearch: setPropertySearch,
  } = usePropertySearchOptions(propertyId)

  const {
    options: buyerOptions,
    isLoading: isLoadingBuyers,
    setSearch: setBuyerSearch,
  } = usePersonSearchOptions(buyerId)

  return (
    <>
      <div id="modal-field-propertyId">
        <Controller
          control={control}
          name="propertyId"
          render={({ field }) => (
            <SearchableSelect
              label={t('propertyBuyerFields.propertyLabel')}
              value={field.value}
              onValueChange={field.onChange}
              options={propertyOptions}
              onSearchChange={setPropertySearch}
              isLoading={isLoadingProperties}
              placeholder={t('propertyBuyerFields.propertyPlaceholder')}
              searchPlaceholder={t('propertyBuyerFields.propertySearchPlaceholder')}
              error={errors.propertyId?.message}
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
              label={t('propertyBuyerFields.buyerLabel')}
              value={field.value}
              onValueChange={field.onChange}
              options={buyerOptions}
              onSearchChange={setBuyerSearch}
              isLoading={isLoadingBuyers}
              placeholder={t('propertyBuyerFields.buyerPlaceholder')}
              searchPlaceholder={t('propertyBuyerFields.buyerSearchPlaceholder')}
              error={errors.buyerId?.message}
            />
          )}
        />
      </div>
    </>
  )
}

export default ProposalPropertyBuyerFields
