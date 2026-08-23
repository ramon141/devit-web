import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { usePropertyCommercialForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyCommercialForm'
import CommercialActivityFields from '@/pages/Imoveis/Scheda/components/CommercialActivityFields'
import CommercialAreaFields from '@/pages/Imoveis/Scheda/components/CommercialAreaFields'
import PropertyRoomsManager from '@/pages/Imoveis/Scheda/components/PropertyRoomsManager'
import PropertyHeatingSection from '@/pages/Imoveis/Scheda/components/PropertyHeatingSection'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { amenityOptions, industrialFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyCommercialeTabProps = {
  propertyId: string
}

function PropertyCommercialeTab({ propertyId }: PropertyCommercialeTabProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyCommercialForm(propertyId)

  if (isLoading) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <CommercialActivityFields form={form} />
        <CommercialAreaFields form={form} />
        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>Salva dati commerciali</Button>
        </div>
      </form>

      <Separator className="sm:col-span-2" />
      <PropertyRoomsManager propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyHeatingSection propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyFeaturesSection propertyId={propertyId} category="amenity" title="Altri dati" options={amenityOptions} />
      <PropertyFeaturesSection propertyId={propertyId} category="industrial" title="Impianti" options={industrialFeatureOptions} />
    </div>
  )
}

export default PropertyCommercialeTab
