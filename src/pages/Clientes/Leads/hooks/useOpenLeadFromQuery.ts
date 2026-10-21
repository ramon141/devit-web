import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import type { LeadWithRelations } from '@/api/generated/models'
import { LEAD_ID_SEARCH_PARAM } from '@/constants/notifications'

// Link vindo de um aviso (?leadId=...) abre a richiesta assim que o quadro carrega
export function useOpenLeadFromQuery(
  leads: LeadWithRelations[],
  onOpen: (lead: LeadWithRelations) => void
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const leadId = searchParams.get(LEAD_ID_SEARCH_PARAM)

  useEffect(() => {
    if (!leadId) return

    const lead = leads.find((item) => item.id === leadId)

    if (!lead) return

    onOpen(lead)

    setSearchParams(
      (params) => {
        params.delete(LEAD_ID_SEARCH_PARAM)
        return params
      },
      { replace: true }
    )
  }, [leadId, leads, onOpen, setSearchParams])
}
