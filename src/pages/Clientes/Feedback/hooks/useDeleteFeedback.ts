import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getClientFeedbackControllerCountQueryKey,
  getClientFeedbackControllerFindQueryKey,
  useClientFeedbackControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteFeedback() {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteFeedback } = useClientFeedbackControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteFeedback({ id })

    promisePopup(promise, {
      pending: t('useDeleteFeedback.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getClientFeedbackControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getClientFeedbackControllerCountQueryKey() })
        return t('useDeleteFeedback.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('useDeleteFeedback.error')),
    })
  }

  return { handleDelete }
}
