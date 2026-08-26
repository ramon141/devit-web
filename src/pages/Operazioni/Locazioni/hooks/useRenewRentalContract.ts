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
  useRentalContractRenewControllerRenew,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'

function createRenewRentalContractSchema(t: TFunction) {
  return z.object({
    newEndDate: z.string().min(1, t('operazioni:locazioni.renewModal.newEndDateRequired')),
    newAmount: z.string().optional(),
    note: z.string().optional(),
  })
}

export type RenewRentalContractFormValues = z.infer<ReturnType<typeof createRenewRentalContractSchema>>

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
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: renew, isPending } = useRentalContractRenewControllerRenew()

  const form = useForm<RenewRentalContractFormValues>({
    resolver: zodResolver(createRenewRentalContractSchema(t)),
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
      pending: t('locazioni.hooks.renew.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        onRenewed()
        return t('locazioni.hooks.renew.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('locazioni.hooks.renew.error')),
    })
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
