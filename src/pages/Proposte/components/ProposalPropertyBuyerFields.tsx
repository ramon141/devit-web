import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import { usePropertyControllerFind, usePersonControllerFind } from '@/api/generated/api'
import type { ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

type ProposalPropertyBuyerFieldsProps = {
  control: Control<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
}

function ProposalPropertyBuyerFields({ control, errors }: ProposalPropertyBuyerFieldsProps) {
  const { t } = useTranslation('proposte')
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
            label={t('propertyBuyerFields.propertyLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={propertyOptions}
            placeholder={t('propertyBuyerFields.propertyPlaceholder')}
            searchPlaceholder={t('propertyBuyerFields.propertySearchPlaceholder')}
            error={errors.propertyId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="buyerId"
        render={({ field }) => (
          <SearchableSelect
            label={t('propertyBuyerFields.buyerLabel')}
            value={field.value}
            onValueChange={field.onChange}
            options={buyerOptions}
            placeholder={t('propertyBuyerFields.buyerPlaceholder')}
            searchPlaceholder={t('propertyBuyerFields.buyerSearchPlaceholder')}
            error={errors.buyerId?.message}
          />
        )}
      />
    </>
  )
}

export default ProposalPropertyBuyerFields
