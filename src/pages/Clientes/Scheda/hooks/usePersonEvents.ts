import { useCalendarEventParticipantControllerFind } from '@/api/generated/api'

export function usePersonEvents(personId: string) {
  const { data: participants, isLoading } = useCalendarEventParticipantControllerFind({
    filter: { where: { personId }, include: [{ relation: 'calendarEvent' }] },
  })

  return { participants: participants ?? [], isLoading }
}
