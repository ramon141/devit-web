import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/mutator'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

const ENDPOINT = '/purchase-proposal-buyers'

// Tipo local: o controller de purchase-proposal-buyer não gera hook de find (só create/update/delete).
export type ProposalBuyer = {
  id?: string
  proposalId: string
  personId: string
  person?: { name: string }
}

function queryKey(proposalId: string) {
  return ['purchase-proposal-buyers', proposalId]
}

export function useProposalBuyers(proposalId: string) {
  const { t } = useTranslation('proposte')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()

  const { data: buyers } = useQuery({
    queryKey: queryKey(proposalId),
    enabled: !!proposalId,
    queryFn: async () => {
      const filter = { where: { proposalId }, include: [{ relation: 'person' }] }
      const { data } = await api.get<ProposalBuyer[]>(ENDPOINT, { params: { filter } })
      return data
    },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: queryKey(proposalId) })
  }

  function addBuyer(personId: string) {
    promisePopup(api.post(ENDPOINT, { proposalId, personId }), {
      pending: t('buyersManager.adding'),
      success: () => {
        invalidate()
        return t('buyersManager.addSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('buyersManager.addError')),
    })
  }

  function removeBuyer(id: string) {
    promisePopup(api.delete(`${ENDPOINT}/${id}`), {
      pending: t('buyersManager.removing'),
      success: () => {
        invalidate()
        return t('buyersManager.removeSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('buyersManager.removeError')),
    })
  }

  return { buyers: buyers ?? [], addBuyer, removeBuyer }
}
