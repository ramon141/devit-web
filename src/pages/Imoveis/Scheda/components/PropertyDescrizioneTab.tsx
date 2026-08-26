import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import PropertyAdditionalSection from '@/pages/Imoveis/Scheda/components/PropertyAdditionalSection'
import PropertyRoomsManager from '@/pages/Imoveis/Scheda/components/PropertyRoomsManager'
import PropertyHeatingSection from '@/pages/Imoveis/Scheda/components/PropertyHeatingSection'
import PropertyCadastralSection from '@/pages/Imoveis/Scheda/components/PropertyCadastralSection'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getAmenityOptions, getNeighborhoodOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyDescrizioneTabProps = {
  propertyId: string
}

function PropertyDescrizioneTab({ propertyId }: PropertyDescrizioneTabProps) {
  const { t } = useTranslation('imoveis')

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PropertyAdditionalSection propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyRoomsManager propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyHeatingSection propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyCadastralSection propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyFeaturesSection
        propertyId={propertyId}
        category="amenity"
        title={t('scheda.descrizioneTab.otherDataTitle')}
        options={getAmenityOptions(t)}
      />
      <PropertyFeaturesSection
        propertyId={propertyId}
        category="neighborhood"
        title={t('scheda.descrizioneTab.neighborhoodTitle')}
        options={getNeighborhoodOptions(t)}
      />
    </div>
  )
}

export default PropertyDescrizioneTab
