import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getRentalContractControllerCountQueryKey,
  getRentalContractControllerFindQueryKey,
  useRentalContractControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteRentalContract() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteContract } = useRentalContractControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteContract({ id })

    toastPromise(promise, {
      pending: 'Eliminazione contratto...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerCountQueryKey() })
        return 'Contratto eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione del contratto'),
    })
  }

  return { handleDelete }
}
