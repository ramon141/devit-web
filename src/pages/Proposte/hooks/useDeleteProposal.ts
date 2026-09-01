import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPurchaseProposalControllerCountQueryKey,
  getPurchaseProposalControllerFindQueryKey,
  usePurchaseProposalControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteProposal() {
  const { t } = useTranslation('proposte')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteProposal } = usePurchaseProposalControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteProposal({ id })

    promisePopup(promise, {
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
