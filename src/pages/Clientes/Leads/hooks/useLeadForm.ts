import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getLeadControllerFindQueryKey,
  getLeadPropertyControllerFindQueryKey,
  useLeadControllerCreate,
  useLeadMatchControllerRun,
  useLeadControllerUpdateById,
} from '@/api/generated/api'
import type { Lead } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { useLeadNeighborhoods } from '@/pages/Clientes/Leads/hooks/useLeadNeighborhoods'
import { buildLeadCriteriaPayload } from '@/pages/Clientes/Leads/schemas/leadCriteriaPayload'
import { createLeadSchema, type LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'
import { emptyLeadFormValues, leadToFormValues } from '@/pages/Clientes/Leads/schemas/leadFormValues'

type UseLeadFormProps = {
  open?: boolean
  lead?: Lead | null
  onSaved: () => void
}

export function useLeadForm({ open, lead, onSaved }: UseLeadFormProps) {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: create, isPending: creating } = useLeadControllerCreate()
  const { mutateAsync: update, isPending: updating } = useLeadControllerUpdateById()
  const { mutateAsync: runMatch } = useLeadMatchControllerRun()
  const { neighborhoodIds, sync } = useLeadNeighborhoods(lead?.id)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(createLeadSchema(t)),
    defaultValues: emptyLeadFormValues,
  })

  useEffect(() => {
    form.reset(lead ? leadToFormValues(lead, neighborhoodIds) : emptyLeadFormValues)
  }, [lead, neighborhoodIds, form, open])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getLeadControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getLeadPropertyControllerFindQueryKey() })
  }

  // Depois de gravar richiesta e zonas, cruza com os imóveis disponíveis
  async function syncAndMatch(leadId: string, selectedNeighborhoodIds: string[]) {
    await sync(leadId, selectedNeighborhoodIds)
    await runMatch({ id: leadId })
  }

  function onSubmit(values: LeadFormValues) {
    const { neighborhoodIds: selectedNeighborhoodIds, ...leadValues } = values
    const cleaned = emptyStringsToNull(leadValues)

    const data = {
      ...cleaned,
      firstContactAt: toISODateOrNull(values.firstContactAt),
      expiresAt: toISODateOrNull(values.expiresAt),
      maxBudget: toNumberOrNull(values.maxBudget),
      ...buildLeadCriteriaPayload(values),
    }

    const promise = lead?.id
      ? update({ id: lead.id, data }).then(() => syncAndMatch(lead.id ?? '', selectedNeighborhoodIds))
      : create({ data }).then((created) => syncAndMatch(created.id ?? '', selectedNeighborhoodIds))

    promisePopup(promise, {
      pending: lead ? t('useLeadForm.pendingUpdate') : t('useLeadForm.pendingCreate'),
      success: () => {
        invalidateList()
        onSaved()
        return lead ? t('useLeadForm.successUpdate') : t('useLeadForm.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('useLeadForm.error')),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
