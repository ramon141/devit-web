import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getBranchControllerCountQueryKey,
  getBranchControllerFindQueryKey,
  useBranchControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteBranch() {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteBranch } = useBranchControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteBranch({ id })

    promisePopup(promise, {
      pending: t('deleteBranch.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getBranchControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getBranchControllerCountQueryKey() })
        return t('deleteBranch.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteBranch.error')),
    })
  }

  return { handleDelete }
}
