import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormEvent } from 'react'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledInput from '@/components/ControlledInput'
import ControlledSelectField from '@/components/ControlledSelectField'
import SearchableSelect from '@/components/SearchableSelect'
import { COUNTRY_OPTIONS, PROPERTY_CITY_OPTIONS } from '@/constants/cities'
import PropertyNeighborhoodField from '@/pages/Imoveis/components/PropertyNeighborhoodField'
import PropertyLocationDetailSection from '@/pages/Imoveis/Scheda/components/PropertyLocationDetailSection'
import { usePropertyLocationDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyLocationDetailForm'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyLocationTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  propertyId?: string
  onBack?: () => void
}

function PropertyLocationTab({ form, onSubmit, isSubmitting, propertyId, onBack }: PropertyLocationTabProps) {
  const { t } = useTranslation('imoveis')
  const { control } = form
  const { errors } = useFormState({ control })
  const locationDetail = usePropertyLocationDetailForm(propertyId ?? '')

  // Um único "Próximo" salva o form principal e os detalhes de localização juntos
  function handleSubmit(event: FormEvent) {
    locationDetail.onSubmit(event)
    onSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <ControlledSelectField
          id="property-field-country"
          control={control}
          name="country"
          label={t('locationTab.countryLabel')}
          options={COUNTRY_OPTIONS}
          placeholder={t('locationTab.countryPlaceholder')}
          error={errors.country?.message}
        />

        <div id="property-field-city">
          <Controller
            control={control}
            name="city"
            render={({ field }) => {
              // A lista fixa só cobre os comuni "atendidos"; imóveis fora
              // dela (importados, zona vesuviana) ficavam com o campo
              // mostrando vazio mesmo tendo cidade salva no banco.
              const options =
                field.value && !PROPERTY_CITY_OPTIONS.some((option) => option.value === field.value)
                  ? [{ value: field.value, label: field.value }, ...PROPERTY_CITY_OPTIONS]
                  : PROPERTY_CITY_OPTIONS

              return (
                <SearchableSelect
                  label={t('locationTab.cityLabel')}
                  required
                  value={field.value}
                  onValueChange={field.onChange}
                  options={options}
                  creatable
                  onCreate={field.onChange}
                  placeholder={t('locationTab.cityPlaceholder')}
                  error={errors.city?.message}
                />
              )
            }}
          />
        </div>

        <FormFieldWrapper id="property-field-region" label={t('locationTab.regionLabel')} error={errors.region?.message}>
          <ControlledInput control={control} name="region" placeholder={t('locationTab.regionPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-postalCode" label={t('locationTab.postalCodeLabel')} error={errors.postalCode?.message}>
          <ControlledInput control={control} name="postalCode" placeholder={t('locationTab.postalCodePlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-street" label={t('locationTab.streetLabel')} error={errors.street?.message}>
          <ControlledInput control={control} name="street" placeholder={t('locationTab.streetPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-number" label={t('locationTab.numberLabel')} error={errors.number?.message}>
          <ControlledInput control={control} name="number" placeholder={t('locationTab.numberPlaceholder')} />
        </FormFieldWrapper>

        <PropertyNeighborhoodField form={form} error={errors.neighborhoodId?.message} />

        <FormFieldWrapper id="property-field-complement" label={t('locationTab.complementLabel')} error={errors.complement?.message}>
          <ControlledInput control={control} name="complement" placeholder={t('locationTab.complementPlaceholder')} />
        </FormFieldWrapper>

        {!locationDetail.isLoading && <PropertyLocationDetailSection form={locationDetail.form} />}
      </div>

      <PropertyFormFooter
        id="property-tab-localizzazione-actions"
        isSubmitting={isSubmitting || locationDetail.isSubmitting}
        onBack={onBack}
      />
    </form>
  )
}

export default PropertyLocationTab
