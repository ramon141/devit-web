import { useTranslation } from 'react-i18next'
import { usePersonEvents } from '@/pages/Clientes/Scheda/hooks/usePersonEvents'
import { formatDateTime } from '@/utils/formatDate'

type SchedaAgendaProps = {
  personId: string
}

function SchedaAgenda({ personId }: SchedaAgendaProps) {
  const { t } = useTranslation('clientes')
  const { participants } = usePersonEvents(personId)

  return (
    <div className="grid gap-2">
      {participants.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('schedaAgenda.empty')}</p>
      )}

      {participants.map((participant) => (
        <div key={participant.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
          <p className="text-sm font-medium">{participant.calendarEvent?.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(participant.calendarEvent?.startAt)}
          </p>
        </div>
      ))}
    </div>
  )
}

export default SchedaAgenda
