import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getLeadControllerFindQueryKey,
  useLeadControllerCreate,
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

const emptyValues: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  firstContactAt: '',
  status: 'new',
  source: undefined,
  requestType: undefined,
  desiredCity: '',
  maxBudget: '',
  subject: '',
  lossReason: '',
  notes: '',
  assignedToId: '',
  purpose: undefined,
  categoryId: '',
  expiresAt: '',
  minBudget: '',
  minAreaSqm: '',
  maxAreaSqm: '',
  minRooms: '',
  maxRooms: '',
  minBedrooms: '',
  maxBedrooms: '',
  minBathrooms: '',
  maxBathrooms: '',
  neighborhoodIds: [],
}

type UseLeadFormProps = {
  lead?: Lead | null
  onSaved: () => void
}

export function useLeadForm({ lead, onSaved }: UseLeadFormProps) {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: create, isPending: creating } = useLeadControllerCreate()
  const { mutateAsync: update, isPending: updating } = useLeadControllerUpdateById()
  const { neighborhoodIds, sync } = useLeadNeighborhoods(lead?.id)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(createLeadSchema(t)),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(
      lead
        ? {
            name: lead.name,
            phone: lead.phone ?? '',
            email: lead.email ?? '',
            firstContactAt: lead.firstContactAt?.slice(0, 10) ?? '',
            status: lead.status ?? 'new',
            source: lead.source ?? undefined,
            requestType: lead.requestType ?? undefined,
            desiredCity: lead.desiredCity ?? '',
            maxBudget: lead.maxBudget != null ? String(lead.maxBudget) : '',
            subject: lead.subject ?? '',
            lossReason: lead.lossReason ?? '',
            notes: lead.notes ?? '',
            assignedToId: lead.assignedToId ?? '',
            purpose: lead.purpose ?? undefined,
            categoryId: lead.categoryId ?? '',
            expiresAt: lead.expiresAt?.slice(0, 10) ?? '',
            minBudget: lead.minBudget != null ? String(lead.minBudget) : '',
            minAreaSqm: lead.minAreaSqm != null ? String(lead.minAreaSqm) : '',
            maxAreaSqm: lead.maxAreaSqm != null ? String(lead.maxAreaSqm) : '',
            minRooms: lead.minRooms != null ? String(lead.minRooms) : '',
            maxRooms: lead.maxRooms != null ? String(lead.maxRooms) : '',
            minBedrooms: lead.minBedrooms != null ? String(lead.minBedrooms) : '',
            maxBedrooms: lead.maxBedrooms != null ? String(lead.maxBedrooms) : '',
            minBathrooms: lead.minBathrooms != null ? String(lead.minBathrooms) : '',
            maxBathrooms: lead.maxBathrooms != null ? String(lead.maxBathrooms) : '',
            neighborhoodIds,
          }
        : emptyValues
    )
  }, [lead, neighborhoodIds, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getLeadControllerFindQueryKey() })
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
      ? update({ id: lead.id, data }).then(() => sync(lead.id ?? '', selectedNeighborhoodIds))
      : create({ data }).then((created) => sync(created.id ?? '', selectedNeighborhoodIds))

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
