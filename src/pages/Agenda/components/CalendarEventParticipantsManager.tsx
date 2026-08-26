import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
import RemovableRow from '@/components/RemovableRow'
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
        <RemovableRow
          key={participant.id}
          onRemove={() => participant.id && removeParticipant(participant.id)}
        >
          <span className="text-sm">{participant.person?.name ?? '—'}</span>
        </RemovableRow>
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
