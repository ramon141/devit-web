import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { z } from 'zod'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getRentalContractControllerFindQueryKey,
  useRentalContractRenewControllerRenew,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

function createRenewRentalContractSchema(t: TFunction, currentEndDate?: string | null) {
  return z
    .object({
      newEndDate: z.string().min(1, t('operazioni:locazioni.renewModal.newEndDateRequired')),
      newAmount: z.string().optional(),
      note: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      const isNotAfterCurrent =
        currentEndDate &&
        values.newEndDate &&
        !dayjs(values.newEndDate).isAfter(dayjs(currentEndDate), 'day')

      if (isNotAfterCurrent) {
        ctx.addIssue({
          code: 'custom',
          path: ['newEndDate'],
          message: t('operazioni:locazioni.renewModal.newEndNotAfterCurrent'),
        })
      }

      if (values.newAmount && Number(values.newAmount) <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['newAmount'],
          message: t('operazioni:locazioni.renewModal.newAmountPositive'),
        })
      }
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
  currentEndDate?: string | null
  onRenewed: () => void
}

export function useRenewRentalContract({ contractId, currentEndDate, onRenewed }: UseRenewRentalContractProps) {
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: renew, isPending } = useRentalContractRenewControllerRenew()

  const form = useForm<RenewRentalContractFormValues>({
    resolver: zodResolver(createRenewRentalContractSchema(t, currentEndDate)),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(emptyValues)
  }, [contractId, form])

  function onSubmit(values: RenewRentalContractFormValues) {
    if (!contractId) return

    const data = {
      newEndDate: values.newEndDate,
      newAmount: toNumberOrNull(values.newAmount) ?? undefined,
      note: values.note || undefined,
    }

    const promise = renew({ id: contractId, data })

    promisePopup(promise, {
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
