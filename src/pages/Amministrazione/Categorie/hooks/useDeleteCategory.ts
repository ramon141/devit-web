import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyCategoryControllerCountQueryKey,
  getPropertyCategoryControllerFindQueryKey,
  usePropertyCategoryControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteCategory } = usePropertyCategoryControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteCategory({ id })

    toastPromise(promise, {
      pending: 'Eliminazione categoria...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPropertyCategoryControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPropertyCategoryControllerCountQueryKey() })
        return 'Categoria eliminata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione della categoria'),
    })
  }

  return { handleDelete }
}
