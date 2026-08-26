import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePropertyDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'
import DettagliMainFields from '@/pages/Imoveis/Scheda/components/DettagliMainFields'
import DettagliStatoFields from '@/pages/Imoveis/Scheda/components/DettagliStatoFields'

type PropertyDettagliTabProps = {
  propertyId: string
}

function PropertyDettagliTab({ propertyId }: PropertyDettagliTabProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyDetailForm(propertyId)

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <DettagliMainFields form={form} />
      <DettagliStatoFields form={form} />

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {t('scheda.dettagliTab.save')}
        </Button>
      </div>
    </form>
  )
}

export default PropertyDettagliTab
