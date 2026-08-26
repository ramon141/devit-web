import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { usePropertyCommercialForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyCommercialForm'
import CommercialActivityFields from '@/pages/Imoveis/Scheda/components/CommercialActivityFields'
import CommercialAreaFields from '@/pages/Imoveis/Scheda/components/CommercialAreaFields'
import PropertyRoomsManager from '@/pages/Imoveis/Scheda/components/PropertyRoomsManager'
import PropertyHeatingSection from '@/pages/Imoveis/Scheda/components/PropertyHeatingSection'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getAmenityOptions, getIndustrialFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyCommercialeTabProps = {
  propertyId: string
}

function PropertyCommercialeTab({ propertyId }: PropertyCommercialeTabProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyCommercialForm(propertyId)

  if (isLoading) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <CommercialActivityFields form={form} />
        <CommercialAreaFields form={form} />
        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>{t('scheda.commercialeTab.save')}</Button>
        </div>
      </form>

      <Separator className="sm:col-span-2" />
      <PropertyRoomsManager propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyHeatingSection propertyId={propertyId} />
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
  )
}

export default PropertyCommercialeTab
