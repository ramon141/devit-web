import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCommunicationTemplateControllerCountQueryKey,
  getCommunicationTemplateControllerFindQueryKey,
  useCommunicationTemplateControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteTemplate() {
  const { t } = useTranslation('marketing')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteTemplate } = useCommunicationTemplateControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteTemplate({ id })

    promisePopup(promise, {
      pending: t('deleteTemplate.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getCommunicationTemplateControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getCommunicationTemplateControllerCountQueryKey() })
        return t('deleteTemplate.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteTemplate.error')),
    })
  }

  return { handleDelete }
}
