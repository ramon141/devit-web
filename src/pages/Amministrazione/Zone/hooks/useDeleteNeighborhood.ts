import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getNeighborhoodControllerCountQueryKey,
  getNeighborhoodControllerFindQueryKey,
  useNeighborhoodControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteNeighborhood() {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteNeighborhood } = useNeighborhoodControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteNeighborhood({ id })

    promisePopup(promise, {
      pending: t('deleteNeighborhood.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getNeighborhoodControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getNeighborhoodControllerCountQueryKey() })
        return t('deleteNeighborhood.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteNeighborhood.error')),
    })
  }

  return { handleDelete }
}
