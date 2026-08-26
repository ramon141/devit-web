import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
import { usePersonControllerFind } from '@/api/generated/api'
import { useCalendarEventParticipants } from '@/pages/Agenda/hooks/useCalendarEventParticipants'

type CalendarEventParticipantsManagerProps = {
  calendarEventId: string
}

function CalendarEventParticipantsManager({ calendarEventId }: CalendarEventParticipantsManagerProps) {
  const { participants, personId, setPersonId, addParticipant, removeParticipant } =
    useCalendarEventParticipants(calendarEventId)
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const personOptions = (people ?? []).map((person) => ({ value: person.id ?? '', label: person.name }))

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">Clienti/proprietari collegati</p>

      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border"
        >
          <span className="text-sm">{participant.person?.name ?? '—'}</span>
          <Button variant="ghost" size="icon-sm" onClick={() => participant.id && removeParticipant(participant.id)}>
            <XIcon className="size-4" />
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <SearchableSelect
            value={personId}
            onValueChange={setPersonId}
            options={personOptions}
            placeholder="Seleziona un cliente"
            searchPlaceholder="Cerca un cliente..."
          />
        </div>
        <Button type="button" onClick={addParticipant}>
          Aggiungi
        </Button>
      </div>
    </div>
  )
}

export default CalendarEventParticipantsManager
