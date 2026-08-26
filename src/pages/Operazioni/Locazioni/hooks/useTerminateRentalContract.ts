import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getRentalContractControllerFindQueryKey,
  useContractTerminationControllerCreate,
  useRentalContractControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'

export const terminateRentalContractSchema = z.object({
  terminationDate: z.string().min(1, 'Inserisci la data'),
  reason: z.string().optional(),
  penaltyAmount: z.string().optional(),
  requestedBy: z.string().optional(),
})

export type TerminateRentalContractFormValues = z.infer<typeof terminateRentalContractSchema>

const emptyValues: TerminateRentalContractFormValues = {
  terminationDate: '',
  reason: '',
  penaltyAmount: '',
  requestedBy: '',
}

type UseTerminateRentalContractProps = {
  contractId?: string
  onTerminated: () => void
}

export function useTerminateRentalContract({ contractId, onTerminated }: UseTerminateRentalContractProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: createTermination, isPending: creating } = useContractTerminationControllerCreate()
  const { mutateAsync: updateContract, isPending: updating } = useRentalContractControllerUpdateById()

  const form = useForm<TerminateRentalContractFormValues>({
    resolver: zodResolver(terminateRentalContractSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(emptyValues)
  }, [contractId, form])

  async function onSubmit(values: TerminateRentalContractFormValues) {
    if (!contractId) return

    const promise = createTermination({
      data: {
        contractId,
        terminationDate: toISODateOrNull(values.terminationDate)!,
        reason: values.reason || null,
        penaltyAmount: toNumberOrNull(values.penaltyAmount),
        requestedBy: values.requestedBy || null,
      },
    }).then(() => updateContract({ id: contractId, data: { situation: 'terminated' } }))

    toastPromise(promise, {
      pending: 'Rescissione del contratto...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        onTerminated()
        return 'Contratto rescisso con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la rescissione del contratto'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
