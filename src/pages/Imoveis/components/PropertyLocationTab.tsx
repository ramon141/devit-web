import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormEvent } from 'react'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledInput from '@/components/ControlledInput'
import ControlledSelectField from '@/components/ControlledSelectField'
import { COUNTRY_OPTIONS, PROPERTY_CITY_OPTIONS } from '@/constants/cities'
import PropertyNeighborhoodField from '@/pages/Imoveis/components/PropertyNeighborhoodField'
import PropertyLocationDetailSection from '@/pages/Imoveis/Scheda/components/PropertyLocationDetailSection'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyLocationTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  propertyId?: string
}

function PropertyLocationTab({ form, onSubmit, isSubmitting, propertyId }: PropertyLocationTabProps) {
  const { t } = useTranslation('imoveis')
  const { control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <ControlledSelectField
          id="property-field-country"
          control={control}
          name="country"
          label={t('locationTab.countryLabel')}
          options={COUNTRY_OPTIONS}
          placeholder={t('locationTab.countryPlaceholder')}
          error={errors.country?.message}
        />

        <ControlledSelectField
          id="property-field-city"
          control={control}
          name="city"
          label={t('locationTab.cityLabel')}
          options={PROPERTY_CITY_OPTIONS}
          placeholder={t('locationTab.cityPlaceholder')}
          required
          error={errors.city?.message}
        />

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

      <PropertyFormFooter id="property-tab-localizzazione-actions" isSubmitting={isSubmitting} />
      </form>

      <PropertyLocationDetailSection propertyId={propertyId ?? ''} />
    </div>
  )
}

export default PropertyLocationTab
