import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyControllerCountQueryKey,
  getPropertyControllerFindQueryKey,
  usePropertyControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteProperty } = usePropertyControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteProperty({ id })

    toastPromise(promise, {
      pending: 'Eliminazione immobile...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPropertyControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPropertyControllerCountQueryKey() })
        return 'Immobile eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione dell’immobile'),
    })
  }

  return { handleDelete }
}
