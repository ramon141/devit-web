import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getSaleControllerCountQueryKey,
  getSaleControllerFindQueryKey,
  useSaleControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteSale() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteSale } = useSaleControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteSale({ id })

    toastPromise(promise, {
      pending: 'Eliminazione vendita...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getSaleControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getSaleControllerCountQueryKey() })
        return 'Vendita eliminata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione della vendita'),
    })
  }

  return { handleDelete }
}
