import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import { usePropertyCommercialForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyCommercialForm'
import { usePropertyHeatingForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyHeatingForm'
import CommercialActivityFields from '@/pages/Imoveis/Scheda/components/CommercialActivityFields'
import CommercialAreaFields from '@/pages/Imoveis/Scheda/components/CommercialAreaFields'
import PropertyRoomsManager from '@/pages/Imoveis/Scheda/components/PropertyRoomsManager'
import PropertyHeatingSection from '@/pages/Imoveis/Scheda/components/PropertyHeatingSection'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getAmenityOptions, getIndustrialFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyCommercialeTabProps = {
  propertyId: string
  onBack?: () => void
  onNext: () => void
}

function PropertyCommercialeTab({ propertyId, onBack, onNext }: PropertyCommercialeTabProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyCommercialForm(propertyId)
  const heating = usePropertyHeatingForm(propertyId)

  // Um único "Próximo" grava os dados comerciais e o aquecimento juntos
  function handleSubmit(event: FormEvent) {
    heating.onSubmit(event)
    onSubmit(event)
    onNext()
  }

  if (isLoading || heating.isLoading) return null

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <CommercialActivityFields form={form} />
        <CommercialAreaFields form={form} />

        <Separator className="sm:col-span-2" />
        <PropertyHeatingSection form={heating.form} />

        <Separator className="sm:col-span-2" />
        <PropertyRoomsManager propertyId={propertyId} />

        <Separator className="sm:col-span-2" />
        <PropertyFeaturesSection
          propertyId={propertyId}
          category="amenity"
          title={t('scheda.commercialeTab.otherDataTitle')}
          options={getAmenityOptions(t)}
        />
        <PropertyFeaturesSection
          propertyId={propertyId}
          category="industrial"
          title={t('scheda.commercialeTab.systemsTitle')}
          options={getIndustrialFeatureOptions(t)}
        />
      </div>

      <PropertyFormFooter
        id="property-tab-commerciale-actions"
        isSubmitting={isSubmitting || heating.isSubmitting}
        onBack={onBack}
      />
    </form>
  )
}

export default PropertyCommercialeTab
