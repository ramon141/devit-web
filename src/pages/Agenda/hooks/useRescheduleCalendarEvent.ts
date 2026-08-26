import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventControllerFindQueryKey,
  useCalendarEventControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useRescheduleCalendarEvent() {
  const { t } = useTranslation('agenda')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: update } = useCalendarEventControllerUpdateById()

  function reschedule(id: string, startAt: string, endAt: string) {
    const promise = update({ id, data: { startAt, endAt } })

    toastPromise(promise, {
      pending: t('agenda:toasts.reschedule.moving'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getCalendarEventControllerFindQueryKey() })
        return t('agenda:toasts.reschedule.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.reschedule.error')),
    })

    return promise
  }

  return { reschedule }
}
