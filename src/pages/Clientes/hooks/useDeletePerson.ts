import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPersonControllerCountQueryKey,
  getPersonControllerFindQueryKey,
  usePersonControllerDeleteById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useDeletePerson() {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deletePerson } = usePersonControllerDeleteById()

  function handleDelete(id: string) {
    const promise = deletePerson({ id })

    toastPromise(promise, {
      pending: t('useDeletePerson.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPersonControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPersonControllerCountQueryKey() })
        return t('useDeletePerson.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('useDeletePerson.error')),
    })
  }

  return { handleDelete }
}
