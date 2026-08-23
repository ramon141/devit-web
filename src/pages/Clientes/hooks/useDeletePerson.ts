import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPersonControllerCountQueryKey,
  getPersonControllerFindQueryKey,
  usePersonControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeletePerson() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deletePerson } = usePersonControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deletePerson({ id })

    toastPromise(promise, {
      pending: 'Eliminazione cliente...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPersonControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPersonControllerCountQueryKey() })
        return 'Cliente eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione del cliente'),
    })
  }

  return { handleDelete }
}
