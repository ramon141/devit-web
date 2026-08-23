import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { usePropertyIndustrialForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyIndustrialForm'
import IndustrialDetailFields from '@/pages/Imoveis/Scheda/components/IndustrialDetailFields'
import PropertyIndustrialAreasManager from '@/pages/Imoveis/Scheda/components/PropertyIndustrialAreasManager'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { industrialFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyIndustrialeTabProps = {
  propertyId: string
}

function PropertyIndustrialeTab({ propertyId }: PropertyIndustrialeTabProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyIndustrialForm(propertyId)

  if (isLoading) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <IndustrialDetailFields form={form} />
        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>Salva dati industriali</Button>
        </div>
      </form>

      <Separator className="sm:col-span-2" />
      <PropertyIndustrialAreasManager propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyFeaturesSection propertyId={propertyId} category="industrial" title="Altri dati" options={industrialFeatureOptions} />
    </div>
  )
}

export default PropertyIndustrialeTab
