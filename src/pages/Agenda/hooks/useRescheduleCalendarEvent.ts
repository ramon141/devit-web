import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventControllerFindQueryKey,
  useCalendarEventControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useRescheduleCalendarEvent() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: update } = useCalendarEventControllerUpdateById()

  function reschedule(id: string, startAt: string, endAt: string) {
    const promise = update({ id, data: { startAt, endAt } })

    toastPromise(promise, {
      pending: 'Spostamento impegno...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getCalendarEventControllerFindQueryKey() })
        return 'Impegno spostato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante lo spostamento dell’impegno'),
    })

    return promise
  }

  return { reschedule }
}
