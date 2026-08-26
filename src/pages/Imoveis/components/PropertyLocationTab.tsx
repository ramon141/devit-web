import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledInput from '@/components/ControlledInput'
import PropertyLocationDetailSection from '@/pages/Imoveis/Scheda/components/PropertyLocationDetailSection'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyLocationTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: () => void
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
        <FormFieldWrapper label={t('locationTab.countryLabel')} error={errors.country?.message}>
          <ControlledInput control={control} name="country" placeholder={t('locationTab.countryPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locationTab.cityLabel')} required error={errors.city?.message}>
          <ControlledInput control={control} name="city" placeholder={t('locationTab.cityPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locationTab.regionLabel')} error={errors.region?.message}>
          <ControlledInput control={control} name="region" placeholder={t('locationTab.regionPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locationTab.postalCodeLabel')} error={errors.postalCode?.message}>
          <ControlledInput control={control} name="postalCode" placeholder={t('locationTab.postalCodePlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locationTab.streetLabel')} error={errors.street?.message}>
          <ControlledInput control={control} name="street" placeholder={t('locationTab.streetPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locationTab.numberLabel')} error={errors.number?.message}>
          <ControlledInput control={control} name="number" placeholder={t('locationTab.numberPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locationTab.neighborhoodLabel')} error={errors.neighborhood?.message}>
          <ControlledInput control={control} name="neighborhood" placeholder={t('locationTab.neighborhoodPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locationTab.complementLabel')} error={errors.complement?.message}>
          <ControlledInput control={control} name="complement" placeholder={t('locationTab.complementPlaceholder')} />
        </FormFieldWrapper>

        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {t('locationTab.save')}
          </Button>
        </div>
      </form>

      {propertyId && <PropertyLocationDetailSection propertyId={propertyId} />}
    </div>
  )
}

export default PropertyLocationTab
