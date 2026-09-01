import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventControllerFindQueryKey,
  useCalendarEventControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteCalendarEvent() {
  const { t } = useTranslation('agenda')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteEvent } = useCalendarEventControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteEvent({ id })

    promisePopup(promise, {
      pending: t('agenda:toasts.delete.deleting'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getCalendarEventControllerFindQueryKey() })
        return t('agenda:toasts.delete.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.delete.error')),
    })
  }

  return { handleDelete }
}
