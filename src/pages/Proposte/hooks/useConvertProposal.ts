import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { api } from '@/api/mutator'
import {
  getPurchaseProposalControllerFindQueryKey,
  getPurchaseProposalControllerCountQueryKey,
} from '@/api/generated/api'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useConvertProposal() {
  const { t } = useTranslation('proposte')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { toastPromise } = useToast()

  function convert(id: string) {
    const promise = api.post(`/purchase-proposals/${id}/convert-to-sale`)

    toastPromise(promise, {
      pending: t('convert.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerCountQueryKey() })
        navigate(`${CRM_BASE_PATH}/operazioni/vendite`)
        return t('convert.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('convert.error')),
    })
  }

  return { convert }
}
