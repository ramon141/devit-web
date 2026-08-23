import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { usePropertyLandForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyLandForm'
import LandDetailFields from '@/pages/Imoveis/Scheda/components/LandDetailFields'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { landFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyTerrenoTabProps = {
  propertyId: string
}

function PropertyTerrenoTab({ propertyId }: PropertyTerrenoTabProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyLandForm(propertyId)

  if (isLoading) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <LandDetailFields form={form} />
        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>Salva dati terreno</Button>
        </div>
      </form>

      <Separator className="sm:col-span-2" />
      <PropertyFeaturesSection propertyId={propertyId} category="land" title="Altri dati" options={landFeatureOptions} />
    </div>
  )
}

export default PropertyTerrenoTab
