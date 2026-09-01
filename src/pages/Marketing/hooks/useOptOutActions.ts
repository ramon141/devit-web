import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCommunicationOptOutControllerFindQueryKey,
  useCommunicationOptOutControllerCreate,
  useCommunicationOptOutControllerDeleteById,
} from '@/api/generated/api'
import type { NewCommunicationOptOut } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useOptOutActions() {
  const { t } = useTranslation('marketing')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useCommunicationOptOutControllerCreate()
  const { mutateAsync: deleteOptOut } = useCommunicationOptOutControllerDeleteById()

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getCommunicationOptOutControllerFindQueryKey() })
  }

  function handleCreate(data: NewCommunicationOptOut, onSaved: () => void) {
    toastPromise(create({ data }), {
      pending: t('optOutForm.pending'),
      success: () => {
        invalidateList()
        onSaved()
        return t('optOutForm.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) => getErrorMessageFromRequest(error, t('optOutForm.error')),
    })
  }

  function handleDelete(id: string) {
    toastPromise(deleteOptOut({ id }), {
      pending: t('deleteOptOut.pending'),
      success: () => {
        invalidateList()
        return t('deleteOptOut.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) => getErrorMessageFromRequest(error, t('deleteOptOut.error')),
    })
  }

  return { handleCreate, handleDelete, isCreating: creating }
}
