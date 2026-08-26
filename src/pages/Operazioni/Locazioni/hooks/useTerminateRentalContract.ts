import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
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

function createTerminateRentalContractSchema(t: TFunction) {
  return z.object({
    terminationDate: z.string().min(1, t('operazioni:locazioni.terminationModal.terminationDateRequired')),
    reason: z.string().optional(),
    penaltyAmount: z.string().optional(),
    requestedBy: z.string().optional(),
  })
}

export type TerminateRentalContractFormValues = z.infer<
  ReturnType<typeof createTerminateRentalContractSchema>
>

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
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: createTermination, isPending: creating } = useContractTerminationControllerCreate()
  const { mutateAsync: updateContract, isPending: updating } = useRentalContractControllerUpdateById()

  const form = useForm<TerminateRentalContractFormValues>({
    resolver: zodResolver(createTerminateRentalContractSchema(t)),
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
      pending: t('locazioni.hooks.terminate.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        onTerminated()
        return t('locazioni.hooks.terminate.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('locazioni.hooks.terminate.error')),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
