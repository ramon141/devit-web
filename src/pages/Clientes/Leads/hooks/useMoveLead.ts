import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getLeadControllerFindQueryKey,
  useLeadControllerUpdateById,
} from '@/api/generated/api'
import type { LeadStatus } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useMoveLead() {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: updateLead } = useLeadControllerUpdateById()

  function moveLead(id: string, status: LeadStatus, kanbanPosition: number) {
    const promise = updateLead({ id, data: { status, kanbanPosition } })

    toastPromise(promise, {
      pending: t('useMoveLead.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getLeadControllerFindQueryKey() })
        return t('useMoveLead.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('useMoveLead.error')),
    })
  }

  return { moveLead }
}
