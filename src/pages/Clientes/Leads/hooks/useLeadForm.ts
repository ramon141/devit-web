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
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'
import { createLeadSchema, type LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

const emptyValues: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  firstContactAt: '',
  status: 'new',
  source: undefined,
  lossReason: '',
  notes: '',
  assignedToId: '',
}

type UseLeadFormProps = {
  lead?: Lead | null
  onSaved: () => void
}

export function useLeadForm({ lead, onSaved }: UseLeadFormProps) {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useLeadControllerCreate()
  const { mutateAsync: update, isPending: updating } = useLeadControllerUpdateById()

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
            lossReason: lead.lossReason ?? '',
            notes: lead.notes ?? '',
            assignedToId: lead.assignedToId ?? '',
          }
        : emptyValues
    )
  }, [lead, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getLeadControllerFindQueryKey() })
  }

  function onSubmit(values: LeadFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = { ...cleaned, firstContactAt: toISODateOrNull(values.firstContactAt) }

    const promise = lead?.id ? update({ id: lead.id, data }) : create({ data })

    toastPromise(promise, {
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
