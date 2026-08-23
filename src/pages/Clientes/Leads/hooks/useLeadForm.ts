import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
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
import { leadSchema, type LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

const emptyValues: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  firstContactAt: '',
  status: 'new',
  lossReason: '',
  notes: '',
  assignedToId: '',
}

type UseLeadFormProps = {
  lead?: Lead | null
  onSaved: () => void
}

export function useLeadForm({ lead, onSaved }: UseLeadFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useLeadControllerCreate()
  const { mutateAsync: update, isPending: updating } = useLeadControllerUpdateById()

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
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
      pending: lead ? 'Salvataggio richiesta...' : 'Creazione richiesta...',
      success: () => {
        invalidateList()
        onSaved()
        return lead ? 'Richiesta aggiornata con successo!' : 'Richiesta creata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio della richiesta'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
