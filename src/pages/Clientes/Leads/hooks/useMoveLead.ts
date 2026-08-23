import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getLeadControllerFindQueryKey,
  useLeadControllerUpdateById,
} from '@/api/generated/api'
import type { LeadStatus } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useMoveLead() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: updateLead } = useLeadControllerUpdateById()

  function moveLead(id: string, status: LeadStatus) {
    const promise = updateLead({ id, data: { status } })

    toastPromise(promise, {
      pending: 'Spostamento richiesta...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getLeadControllerFindQueryKey() })
        return 'Richiesta spostata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante lo spostamento della richiesta'),
    })
  }

  return { moveLead }
}
