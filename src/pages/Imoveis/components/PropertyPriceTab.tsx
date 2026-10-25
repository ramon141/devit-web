import { useEffect } from 'react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormEvent } from 'react'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import InputMoney from '@/components/InputMoney'
import PropertyPriceDetailSection from '@/pages/Imoveis/Scheda/components/PropertyPriceDetailSection'
import { usePropertyPriceDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyPriceDetailForm'
import { PropertyPurpose } from '@/api/generated/models'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyPriceTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  propertyId?: string
  onBack?: () => void
}

function PropertyPriceTab({ form, onSubmit, isSubmitting, propertyId, onBack }: PropertyPriceTabProps) {
  const { t } = useTranslation('imoveis')
  const { control, setValue, formState } = form
  const { errors } = formState
  const setPrice = (name: 'salePrice' | 'rentPrice' | 'condoFee', value?: string) =>
    setValue(name, value, { shouldValidate: true })
  const salePrice = useWatch({ control, name: 'salePrice' })
  const rentPrice = useWatch({ control, name: 'rentPrice' })
  const condoFee = useWatch({ control, name: 'condoFee' })
  const purpose = useWatch({ control, name: 'purpose' })
  const showSalePrice = purpose !== PropertyPurpose.rent
  const showRentPrice = purpose !== PropertyPurpose.sale

  // O preço que a finalidade não admite some do formulário e do envio
  useEffect(() => {
    if (!showSalePrice) setValue('salePrice', undefined)
    if (!showRentPrice) setValue('rentPrice', undefined)
  }, [showSalePrice, showRentPrice, setValue])

  const priceDetail = usePropertyPriceDetailForm(propertyId ?? '')

  // Um único "Próximo" salva o form principal e as opções de preço juntos
  function handleSubmit(event: FormEvent) {
    priceDetail.onSubmit(event)
    onSubmit(event)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 content-start gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        {showSalePrice && (
          <div id="property-field-salePrice">
            <InputMoney
              name="salePrice"
              label={t('priceTab.salePriceLabel')}
              value={salePrice}
              setValue={(value) => setPrice('salePrice', value)}
              error={errors.salePrice?.message}
            />
          </div>
        )}

        {showRentPrice && (
          <div id="property-field-rentPrice">
            <InputMoney
              name="rentPrice"
              label={t('priceTab.rentPriceLabel')}
              value={rentPrice}
              setValue={(value) => setPrice('rentPrice', value)}
              error={errors.rentPrice?.message}
            />
          </div>
        )}

        <div id="property-field-condoFee">
          <InputMoney
            name="condoFee"
            label={t('priceTab.condoFeeLabel')}
            value={condoFee}
            setValue={(value) => setPrice('condoFee', value)}
            error={errors.condoFee?.message}
          />
        </div>

        {!priceDetail.isLoading && <PropertyPriceDetailSection form={priceDetail.form} />}
      </div>

      <PropertyFormFooter
        id="property-tab-prezzo-actions"
        isSubmitting={isSubmitting || priceDetail.isSubmitting}
        onBack={onBack}
      />
    </form>
  )
}

export default PropertyPriceTab
