import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRightLeftIcon } from 'lucide-react'
import { Auth } from '@/auth'
import { Button } from '@/components/ui/button'
import ResponsibleBroker from '@/components/ResponsibleBroker'
import type { PropertyWithRelations } from '@/api/generated/models'
import PropertyTransferBrokerModal from '@/pages/Imoveis/components/PropertyTransferBrokerModal'

type PropertyBrokerHeaderProps = {
  property: PropertyWithRelations
}

// Corretor responsável em destaque no topo da ficha; a gestão pode transferir
function PropertyBrokerHeader({ property }: PropertyBrokerHeaderProps) {
  const { t } = useTranslation('imoveis')
  const [transferOpen, setTransferOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ResponsibleBroker broker={property.responsibleBroker} since={property.responsibleSince} />

      {Auth.isAdmin() && (
        <>
          <Button type="button" variant="outline" size="sm" onClick={() => setTransferOpen(true)}>
            <ArrowRightLeftIcon className="size-4" />
            {t('broker.transfer.button')}
          </Button>

          <PropertyTransferBrokerModal
            open={transferOpen}
            onOpenChange={setTransferOpen}
            propertyId={property.id ?? ''}
            currentBrokerId={property.responsibleBrokerId}
          />
        </>
      )}
    </div>
  )
}

export default PropertyBrokerHeader
