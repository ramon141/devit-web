import { useTranslation } from 'react-i18next'
import { BadgeCheckIcon } from 'lucide-react'
import type { User } from '@/api/generated/models'
import { formatBroker } from '@/utils/formatBroker'
import { formatDateTime } from '@/utils/formatDate'

type ResponsibleBrokerProps = {
  broker?: User | null
  since?: string | null
}

// Destaque do corretor responsável pelo imóvel (ficha, cartões e mapa)
function ResponsibleBroker({ broker, since }: ResponsibleBrokerProps) {
  const { t } = useTranslation('imoveis')

  return (
    <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm ring-1 ring-primary/30">
      <BadgeCheckIcon className="size-4 shrink-0 text-primary" />

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{t('broker.label')}</p>
        <p className="truncate font-semibold">{formatBroker(broker)}</p>
        {since && <p className="text-xs text-muted-foreground">{t('broker.since', { date: formatDateTime(since) })}</p>}
      </div>
    </div>
  )
}

export default ResponsibleBroker
