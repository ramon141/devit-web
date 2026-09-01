import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCommunicationTemplateControllerCountQueryKey,
  getCommunicationTemplateControllerFindQueryKey,
  useCommunicationTemplateControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteTemplate() {
  const { t } = useTranslation('marketing')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteTemplate } = useCommunicationTemplateControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteTemplate({ id })

    toastPromise(promise, {
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
