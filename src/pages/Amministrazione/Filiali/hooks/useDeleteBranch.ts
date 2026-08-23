import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getBranchControllerCountQueryKey,
  getBranchControllerFindQueryKey,
  useBranchControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteBranch() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteBranch } = useBranchControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteBranch({ id })

    toastPromise(promise, {
      pending: 'Eliminazione filiale...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getBranchControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getBranchControllerCountQueryKey() })
        return 'Filiale eliminata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione della filiale'),
    })
  }

  return { handleDelete }
}
