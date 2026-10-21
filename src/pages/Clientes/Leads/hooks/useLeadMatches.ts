import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getLeadPropertyControllerFindQueryKey,
  useLeadPropertyControllerFind,
  useLeadPropertyControllerUpdateById,
} from '@/api/generated/api'
import type { LeadPropertyContactStatus } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

// Imóveis ligados à richiesta (sugeridos pelo cruzamento ou manuais) e troca do andamento do contato
export function useLeadMatches(leadId?: string) {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: update } = useLeadPropertyControllerUpdateById()

  const { data, isLoading } = useLeadPropertyControllerFind(
    {
      filter: {
        where: { leadId },
        include: [{ relation: 'property' }, { relation: 'contactStatusUpdatedBy' }],
        order: ['matchScore DESC', 'matchedAt DESC'],
      },
    },
    { query: { enabled: !!leadId } }
  )

  function changeStatus(id: string, contactStatus: LeadPropertyContactStatus) {
    promisePopup(update({ id, data: { contactStatus } }), {
      pending: t('leadMatches.pendingStatus'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getLeadPropertyControllerFindQueryKey() })
        return t('leadMatches.successStatus')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('leadMatches.errorStatus')),
    })
  }

  return { matches: data ?? [], isLoading, changeStatus }
}
