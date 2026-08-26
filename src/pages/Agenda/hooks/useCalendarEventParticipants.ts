import { useState } from 'react'
import type { AxiosError } from 'axios'
import {
  getCalendarEventParticipantControllerFindQueryKey,
  useCalendarEventParticipantControllerCreate,
  useCalendarEventParticipantControllerDeleteById,
  useCalendarEventParticipantControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useCalendarEventParticipants(calendarEventId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [personId, setPersonId] = useState('')

  const { data: participants } = useCalendarEventParticipantControllerFind({
    filter: { where: { calendarEventId }, include: [{ relation: 'person' }] },
  })
  const { mutateAsync: create } = useCalendarEventParticipantControllerCreate()
  const { mutateAsync: remove } = useCalendarEventParticipantControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getCalendarEventParticipantControllerFindQueryKey() })
  }

  function addParticipant() {
    if (!personId) return

    const promise = create({ data: { calendarEventId, personId } })

    toastPromise(promise, {
      pending: 'Aggiunta cliente...',
      success: () => {
        invalidate()
        setPersonId('')
        return 'Cliente collegato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il collegamento del cliente'),
    })
  }

  function removeParticipant(id: string) {
    toastPromise(remove({ id }), {
      pending: 'Rimozione cliente...',
      success: () => {
        invalidate()
        return 'Cliente rimosso con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la rimozione del cliente'),
    })
  }

  return {
    participants: participants ?? [],
    personId,
    setPersonId,
    addParticipant,
    removeParticipant,
  }
}
