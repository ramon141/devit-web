import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
import RemovableRow from '@/components/RemovableRow'
import { usePersonControllerFind } from '@/api/generated/api'
import type { DraftParticipant } from '@/pages/Agenda/hooks/useCalendarEventDraft'

type CalendarEventParticipantsDraftManagerProps = {
  participants: DraftParticipant[]
  onAdd: (participant: DraftParticipant) => void
  onRemove: (personId: string) => void
}

function CalendarEventParticipantsDraftManager({
  participants,
  onAdd,
  onRemove,
}: CalendarEventParticipantsDraftManagerProps) {
  const { t } = useTranslation('agenda')
  const [personId, setPersonId] = useState('')
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const personOptions = (people ?? []).map((person) => ({ value: person.id ?? '', label: person.name }))

  function handleAdd() {
    const person = people?.find((item) => item.id === personId)
    if (!person?.id) return

    onAdd({ personId: person.id, personName: person.name })
    setPersonId('')
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('agenda:participantsManager.title')}</p>

      {participants.map((participant) => (
        <RemovableRow key={participant.personId} onRemove={() => onRemove(participant.personId)}>
          <span className="text-sm">{participant.personName}</span>
        </RemovableRow>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <SearchableSelect
            value={personId}
            onValueChange={setPersonId}
            options={personOptions}
            placeholder={t('agenda:participantsManager.placeholder')}
            searchPlaceholder={t('agenda:participantsManager.searchPlaceholder')}
          />
        </div>
        <Button type="button" onClick={handleAdd}>
          {t('agenda:participantsManager.add')}
        </Button>
      </div>
    </div>
  )
}

export default CalendarEventParticipantsDraftManager
