import dayjs from 'dayjs'
import { usePersonEvents } from '@/pages/Clientes/Scheda/hooks/usePersonEvents'

type SchedaAgendaProps = {
  personId: string
}

function SchedaAgenda({ personId }: SchedaAgendaProps) {
  const { participants } = usePersonEvents(personId)

  return (
    <div className="grid gap-2">
      {participants.length === 0 && (
        <p className="text-sm text-muted-foreground">Nessun impegno collegato.</p>
      )}

      {participants.map((participant) => (
        <div key={participant.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
          <p className="text-sm font-medium">{participant.calendarEvent?.title}</p>
          <p className="text-xs text-muted-foreground">
            {participant.calendarEvent?.startAt &&
              dayjs(participant.calendarEvent.startAt).format('DD/MM/YYYY HH:mm')}
          </p>
        </div>
      ))}
    </div>
  )
}

export default SchedaAgenda
