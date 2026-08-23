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
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteUser } = useUserControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteUser({ id })

    toastPromise(promise, {
      pending: 'Eliminazione utente...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getUserControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getUserControllerCountQueryKey() })
        return 'Utente eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione dell’utente'),
    })
  }

  return { handleDelete }
}
