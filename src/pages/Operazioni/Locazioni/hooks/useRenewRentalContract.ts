import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getRentalContractControllerFindQueryKey,
  useRentalContractRenewControllerRenew,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'

export const renewRentalContractSchema = z.object({
  newEndDate: z.string().min(1, 'Inserisci la nuova data di fine'),
  newAmount: z.string().optional(),
  note: z.string().optional(),
})

export type RenewRentalContractFormValues = z.infer<typeof renewRentalContractSchema>

const emptyValues: RenewRentalContractFormValues = {
  newEndDate: '',
  newAmount: '',
  note: '',
}

type UseRenewRentalContractProps = {
  contractId?: string
  onRenewed: () => void
}

export function useRenewRentalContract({ contractId, onRenewed }: UseRenewRentalContractProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: renew, isPending } = useRentalContractRenewControllerRenew()

  const form = useForm<RenewRentalContractFormValues>({
    resolver: zodResolver(renewRentalContractSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(emptyValues)
  }, [contractId, form])

  function onSubmit(values: RenewRentalContractFormValues) {
    if (!contractId) return

    const data = {
      newEndDate: toISODateOrNull(values.newEndDate)!,
      newAmount: toNumberOrNull(values.newAmount) ?? undefined,
      note: values.note || undefined,
    }

    const promise = renew({ id: contractId, data })

    toastPromise(promise, {
      pending: 'Proroga del contratto...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        onRenewed()
        return 'Contratto prorogato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la proroga del contratto'),
    })
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
