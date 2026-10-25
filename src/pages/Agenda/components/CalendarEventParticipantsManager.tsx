import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PersonSelect } from '@/components/RemoteSelects'
import RemovableRow from '@/components/RemovableRow'
import { useCalendarEventParticipants } from '@/pages/Agenda/hooks/useCalendarEventParticipants'

type CalendarEventParticipantsManagerProps = {
  calendarEventId: string
}

function CalendarEventParticipantsManager({ calendarEventId }: CalendarEventParticipantsManagerProps) {
  const { t } = useTranslation('agenda')
  const { participants, personId, setPersonId, addParticipant, removeParticipant } =
    useCalendarEventParticipants(calendarEventId)

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('agenda:participantsManager.title')}</p>

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
          <PersonSelect
            value={personId}
            onValueChange={setPersonId}
            placeholder={t('agenda:participantsManager.placeholder')}
            searchPlaceholder={t('agenda:participantsManager.searchPlaceholder')}
          />
        </div>
        <Button type="button" onClick={addParticipant}>
          <PlusIcon data-icon="inline-start" />
          {t('agenda:participantsManager.add')}
        </Button>
      </div>
    </div>
  )
}

export default CalendarEventParticipantsManager
