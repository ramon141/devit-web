import PropertyFeesManager from '@/pages/Imoveis/Scheda/components/PropertyFeesManager'

type PropertyTasseTabProps = {
  propertyId: string
}

function PropertyTasseTab({ propertyId }: PropertyTasseTabProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <PropertyFeesManager propertyId={propertyId} />
    </div>
  )
}

export default PropertyTasseTab
