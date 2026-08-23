import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventControllerFindQueryKey,
  useCalendarEventControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteEvent } = useCalendarEventControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteEvent({ id })

    toastPromise(promise, {
      pending: 'Eliminazione impegno...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getCalendarEventControllerFindQueryKey() })
        return 'Impegno eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione dell’impegno'),
    })
  }

  return { handleDelete }
}
