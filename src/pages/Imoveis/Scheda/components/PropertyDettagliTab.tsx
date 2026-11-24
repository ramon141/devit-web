import { usePropertyDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'
import DettagliMainFields from '@/pages/Imoveis/Scheda/components/DettagliMainFields'
import DettagliStatoFields from '@/pages/Imoveis/Scheda/components/DettagliStatoFields'

type PropertyDettagliTabProps = {
  propertyId: string
  canSeeInternalNote: boolean
  onNext: () => void
}

function PropertyDettagliTab({ propertyId, canSeeInternalNote, onNext }: PropertyDettagliTabProps) {
  const { form, isLoading, onSubmit } = usePropertyDetailForm(propertyId, onNext)

  if (isLoading) return null

  return (
    <form id="property-tab-form-dettagli" noValidate onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 content-start gap-4 overflow-y-auto p-1 pb-16 sm:grid-cols-2">
        <DettagliMainFields form={form} />
        <DettagliStatoFields form={form} canSeeInternalNote={canSeeInternalNote} />
      </div>
    </form>
  )
}

export default PropertyDettagliTab
