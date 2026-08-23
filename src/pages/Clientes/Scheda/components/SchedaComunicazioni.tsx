import dayjs from 'dayjs'
import { Badge } from '@/components/ui/badge'
import { usePersonCommunications } from '@/pages/Clientes/Scheda/hooks/usePersonCommunications'

type SchedaComunicazioniProps = {
  personId: string
}

function SchedaComunicazioni({ personId }: SchedaComunicazioniProps) {
  const { logs } = usePersonCommunications(personId)

  return (
    <div className="grid gap-2">
      {logs.length === 0 && (
        <p className="text-sm text-muted-foreground">Nessuna comunicazione registrata.</p>
      )}

      {logs.map((log) => (
        <div key={log.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary">{log.channel}</Badge>
            <Badge variant="secondary">{log.status}</Badge>
            <span className="text-xs text-muted-foreground">
              {dayjs(log.sentAt).format('DD/MM/YYYY HH:mm')}
            </span>
          </div>
          <p className="truncate text-sm">{log.content}</p>
        </div>
      ))}
    </div>
  )
}

export default SchedaComunicazioni
