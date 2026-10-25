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
    <div className="flex min-w-0 items-center gap-3 text-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BadgeCheckIcon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t('broker.label')}</p>
        <p className="truncate font-semibold leading-tight">{formatBroker(broker)}</p>
        {since && <p className="text-xs text-muted-foreground">{t('broker.since', { date: formatDateTime(since) })}</p>}
      </div>
    </div>
  )
}

export default ResponsibleBroker
