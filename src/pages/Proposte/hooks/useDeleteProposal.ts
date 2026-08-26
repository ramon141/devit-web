import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPurchaseProposalControllerCountQueryKey,
  getPurchaseProposalControllerFindQueryKey,
  usePurchaseProposalControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteProposal() {
  const { t } = useTranslation('proposte')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteProposal } = usePurchaseProposalControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteProposal({ id })

    toastPromise(promise, {
      pending: t('deleteProposal.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerCountQueryKey() })
        return t('deleteProposal.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteProposal.error')),
    })
  }

  return { handleDelete }
}
