import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getUserControllerCountQueryKey,
  getUserControllerFindQueryKey,
  useUserControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteUser() {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteUser } = useUserControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteUser({ id })

    toastPromise(promise, {
      pending: t('deleteUser.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getUserControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getUserControllerCountQueryKey() })
        return t('deleteUser.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteUser.error')),
    })
  }

  return { handleDelete }
}
