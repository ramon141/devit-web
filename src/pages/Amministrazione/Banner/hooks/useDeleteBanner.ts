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
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteBanner } = useHomeBannerControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteBanner({ id })

    toastPromise(promise, {
      pending: 'Eliminazione banner...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getHomeBannerControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getHomeBannerControllerCountQueryKey() })
        return 'Banner eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione del banner'),
    })
  }

  return { handleDelete }
}
