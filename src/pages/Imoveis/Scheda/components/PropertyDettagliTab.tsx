import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import { usePropertyDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'
import DettagliMainFields from '@/pages/Imoveis/Scheda/components/DettagliMainFields'
import DettagliStatoFields from '@/pages/Imoveis/Scheda/components/DettagliStatoFields'

type PropertyDettagliTabProps = {
  propertyId: string
  onBack?: () => void
  onNext: () => void
}

function PropertyDettagliTab({ propertyId, onBack, onNext }: PropertyDettagliTabProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyDetailForm(propertyId, onNext)

  if (isLoading) return null

  return (
    <form noValidate onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 content-start gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <DettagliMainFields form={form} />
        <DettagliStatoFields form={form} />
      </div>

      <PropertyFormFooter
        id="property-tab-dettagli-actions"
        isSubmitting={isSubmitting}
        onBack={onBack}
      />
    </form>
  )
}

export default PropertyDettagliTab
