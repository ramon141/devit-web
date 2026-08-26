import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getHomeBannerControllerCountQueryKey,
  getHomeBannerControllerFindQueryKey,
  useHomeBannerControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteBanner() {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteBanner } = useHomeBannerControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteBanner({ id })

    toastPromise(promise, {
      pending: t('deleteBanner.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getHomeBannerControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getHomeBannerControllerCountQueryKey() })
        return t('deleteBanner.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteBanner.error')),
    })
  }

  return { handleDelete }
}
