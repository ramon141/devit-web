import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyControllerCountQueryKey,
  getPropertyControllerFindQueryKey,
  usePropertyControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteProperty() {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteProperty } = usePropertyControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteProperty({ id })

    toastPromise(promise, {
      pending: t('toasts.deleteProperty.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPropertyControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPropertyControllerCountQueryKey() })
        return t('toasts.deleteProperty.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.deleteProperty.error')),
    })
  }

  return { handleDelete }
}
