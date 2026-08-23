import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getLeadControllerFindQueryKey, useLeadControllerDeleteById } from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteLead() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteLead } = useLeadControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteLead({ id })

    toastPromise(promise, {
      pending: 'Eliminazione richiesta...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getLeadControllerFindQueryKey() })
        return 'Richiesta eliminata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione della richiesta'),
    })
  }

  return { handleDelete }
}
