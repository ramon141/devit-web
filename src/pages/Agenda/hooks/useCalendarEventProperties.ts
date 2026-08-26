import { useState } from 'react'
import type { AxiosError } from 'axios'
import {
  getCalendarEventPropertyControllerFindQueryKey,
  useCalendarEventPropertyControllerCreate,
  useCalendarEventPropertyControllerDeleteById,
  useCalendarEventPropertyControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useCalendarEventProperties(calendarEventId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [propertyId, setPropertyId] = useState('')

  const { data: links } = useCalendarEventPropertyControllerFind({
    filter: { where: { calendarEventId }, include: [{ relation: 'property' }] },
  })
  const { mutateAsync: create } = useCalendarEventPropertyControllerCreate()
  const { mutateAsync: remove } = useCalendarEventPropertyControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getCalendarEventPropertyControllerFindQueryKey() })
  }

  function addProperty() {
    if (!propertyId) return

    const promise = create({ data: { calendarEventId, propertyId } })

    toastPromise(promise, {
      pending: 'Aggiunta immobile...',
      success: () => {
        invalidate()
        setPropertyId('')
        return 'Immobile collegato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il collegamento dell’immobile'),
    })
  }

  function removeProperty(id: string) {
    toastPromise(remove({ id }), {
      pending: 'Rimozione immobile...',
      success: () => {
        invalidate()
        return 'Immobile rimosso con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la rimozione dell’immobile'),
    })
  }

  return {
    links: links ?? [],
    propertyId,
    setPropertyId,
    addProperty,
    removeProperty,
  }
}
