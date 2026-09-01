import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyCategoryControllerCountQueryKey,
  getPropertyCategoryControllerFindQueryKey,
  usePropertyCategoryControllerDeleteById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeleteCategory() {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteCategory } = usePropertyCategoryControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deleteCategory({ id })

    promisePopup(promise, {
      pending: t('deleteCategory.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPropertyCategoryControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPropertyCategoryControllerCountQueryKey() })
        return t('deleteCategory.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('deleteCategory.error')),
    })
  }

  return { handleDelete }
}
