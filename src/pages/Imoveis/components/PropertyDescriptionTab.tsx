import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormEvent } from 'react'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import { Separator } from '@/components/ui/separator'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledInput from '@/components/ControlledInput'
import ControlledTextarea from '@/components/ControlledTextarea'
import PropertyDescrizioneTab from '@/pages/Imoveis/Scheda/components/PropertyDescrizioneTab'
import { usePropertyAdditionalForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyAdditionalForm'
import { usePropertyHeatingForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyHeatingForm'
import { usePropertyCadastralForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyCadastralForm'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyDescriptionTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  propertyId?: string
  onBack?: () => void
}

function PropertyDescriptionTab({ form, onSubmit, isSubmitting, propertyId, onBack }: PropertyDescriptionTabProps) {
  const { t } = useTranslation('imoveis')
  const { control } = form
  const { errors } = useFormState({ control })

  const additional = usePropertyAdditionalForm(propertyId ?? '')
  const heating = usePropertyHeatingForm(propertyId ?? '')
  const cadastral = usePropertyCadastralForm(propertyId ?? '')

  // Um único "Próximo" salva o form principal e as seções extras juntos
  function handleSubmit(event: FormEvent) {
    additional.onSubmit(event)
    heating.onSubmit(event)
    cadastral.onSubmit(event)
    onSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <FormFieldWrapper id="property-field-areaSqm" label={t('descriptionTab.areaLabel')} error={errors.areaSqm?.message}>
          <ControlledInput control={control} name="areaSqm" type="number" placeholder="90" />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-bedrooms" label={t('descriptionTab.bedroomsLabel')} error={errors.bedrooms?.message}>
          <ControlledInput control={control} name="bedrooms" type="number" placeholder="2" />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-bathrooms" label={t('descriptionTab.bathroomsLabel')} error={errors.bathrooms?.message}>
          <ControlledInput control={control} name="bathrooms" type="number" placeholder="1" />
        </FormFieldWrapper>

        <FormFieldWrapper id="property-field-parkingSpots" label={t('descriptionTab.parkingLabel')} error={errors.parkingSpots?.message}>
          <ControlledInput control={control} name="parkingSpots" type="number" placeholder="1" />
        </FormFieldWrapper>

        <div className="sm:col-span-2">
          <FormFieldWrapper id="property-field-description" label={t('descriptionTab.descriptionLabel')} error={errors.description?.message}>
            <ControlledTextarea control={control} name="description" rows={4} />
          </FormFieldWrapper>
        </div>

        <Separator className="sm:col-span-2" />
        <div className="sm:col-span-2">
          <PropertyDescrizioneTab
            propertyId={propertyId ?? ''}
            additionalForm={additional.form}
            heatingForm={heating.form}
            cadastralForm={cadastral.form}
            isLoadingDetail={additional.isLoading || heating.isLoading || cadastral.isLoading}
          />
        </div>
      </div>

      <PropertyFormFooter
        id="property-tab-descrizione-actions"
        isSubmitting={isSubmitting || additional.isSubmitting || heating.isSubmitting || cadastral.isSubmitting}
        onBack={onBack}
      />
    </form>
  )
}

export default PropertyDescriptionTab
