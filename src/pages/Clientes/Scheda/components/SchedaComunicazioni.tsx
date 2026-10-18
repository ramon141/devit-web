import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { usePersonCommunications } from '@/pages/Clientes/Scheda/hooks/usePersonCommunications'
import { formatDateTime } from '@/utils/formatDate'
import { stripHtml } from '@/utils/stripHtml'

type SchedaComunicazioniProps = {
  personId: string
}

function SchedaComunicazioni({ personId }: SchedaComunicazioniProps) {
  const { t } = useTranslation('clientes')
  const { logs } = usePersonCommunications(personId)

  return (
    <div id="cliente-scheda-comunicazioni" className="grid min-w-0 gap-2">
      {logs.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('schedaComunicazioni.empty')}</p>
      )}

      {logs.map((log) => (
        <div key={log.id} className="min-w-0 rounded-lg px-3 py-2 ring-1 ring-border">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary">{t(`common:communicationChannel.${log.channel}`)}</Badge>
            {log.status && (
              <Badge variant="secondary">{t(`common:communicationStatus.${log.status}`)}</Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDateTime(log.sentAt)}
            </span>
          </div>
          {log.subject && <p className="truncate text-sm font-medium">{log.subject}</p>}
          <p className="truncate text-sm">{stripHtml(log.content)}</p>
        </div>
      ))}
    </div>
  )
}

export default SchedaComunicazioni
