import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getZoneControllerCountQueryKey,
  getZoneControllerFindQueryKey,
  useZoneControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteZone() {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteZone } = useZoneControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteZone({ id })

    promisePopup(promise, {
      pending: t('deleteZone.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getZoneControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getZoneControllerCountQueryKey() })
        return t('deleteZone.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteZone.error')),
    })
  }

  return { handleDelete }
}
