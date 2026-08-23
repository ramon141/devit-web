import { Separator } from '@/components/ui/separator'
import PropertyAdditionalSection from '@/pages/Imoveis/Scheda/components/PropertyAdditionalSection'
import PropertyRoomsManager from '@/pages/Imoveis/Scheda/components/PropertyRoomsManager'
import PropertyHeatingSection from '@/pages/Imoveis/Scheda/components/PropertyHeatingSection'
import PropertyCadastralSection from '@/pages/Imoveis/Scheda/components/PropertyCadastralSection'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { amenityOptions, neighborhoodOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyDescrizioneTabProps = {
  propertyId: string
}

function PropertyDescrizioneTab({ propertyId }: PropertyDescrizioneTabProps) {
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
        title="Altri dati"
        options={amenityOptions}
      />
      <PropertyFeaturesSection
        propertyId={propertyId}
        category="neighborhood"
        title="Caratteristiche di zona"
        options={neighborhoodOptions}
      />
    </div>
  )
}

export default PropertyDescrizioneTab
