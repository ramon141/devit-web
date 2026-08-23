import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPurchaseProposalControllerCountQueryKey,
  getPurchaseProposalControllerFindQueryKey,
  usePurchaseProposalControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteProposal() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteProposal } = usePurchaseProposalControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteProposal({ id })

    toastPromise(promise, {
      pending: 'Eliminazione proposta...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerCountQueryKey() })
        return 'Proposta eliminata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione della proposta'),
    })
  }

  return { handleDelete }
}
