import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
  getSaleControllerCountQueryKey,
  getSaleControllerFindQueryKey,
  useSaleControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteSale() {
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteSale } = useSaleControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteSale({ id })

    toastPromise(promise, {
      pending: t('vendite.hooks.delete.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getSaleControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getSaleControllerCountQueryKey() })
        return t('vendite.hooks.delete.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('vendite.hooks.delete.error')),
    })
  }

  return { handleDelete }
}
