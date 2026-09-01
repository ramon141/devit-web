import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { getLeadControllerFindQueryKey, useLeadControllerDeleteById } from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteLead() {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteLead } = useLeadControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteLead({ id })

    promisePopup(promise, {
      pending: t('useDeleteLead.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getLeadControllerFindQueryKey() })
        return t('useDeleteLead.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('useDeleteLead.error')),
    })
  }

  return { handleDelete }
}
