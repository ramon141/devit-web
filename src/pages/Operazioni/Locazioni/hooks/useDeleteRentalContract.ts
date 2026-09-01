import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
  getRentalContractControllerCountQueryKey,
  getRentalContractControllerFindQueryKey,
  useRentalContractControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteRentalContract() {
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteContract } = useRentalContractControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteContract({ id })

    promisePopup(promise, {
      pending: t('locazioni.hooks.delete.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerCountQueryKey() })
        return t('locazioni.hooks.delete.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('locazioni.hooks.delete.error')),
    })
  }

  return { handleDelete }
}
