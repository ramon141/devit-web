import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyControllerFindByIdQueryKey,
  getPropertyControllerFindQueryKey,
  usePropertyBrokerControllerTransfer,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import {
  createTransferBrokerSchema,
  type TransferBrokerFormValues,
} from '@/pages/Imoveis/schemas/transferBrokerSchema'

const emptyValues: TransferBrokerFormValues = { newBrokerId: '', reason: '' }

type UseTransferBrokerProps = {
  open: boolean
  propertyId: string
  onSaved: () => void
}

export function useTransferBroker({ open, propertyId, onSaved }: UseTransferBrokerProps) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: transfer, isPending } = usePropertyBrokerControllerTransfer()
  const schema = useMemo(() => createTransferBrokerSchema(t), [t])

  const form = useForm<TransferBrokerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) form.reset(emptyValues)
  }, [open, form])

  function onSubmit(values: TransferBrokerFormValues) {
    promisePopup(transfer({ id: propertyId, data: values }), {
      pending: t('broker.transfer.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPropertyControllerFindByIdQueryKey(propertyId) })
        queryClient.invalidateQueries({ queryKey: getPropertyControllerFindQueryKey() })
        onSaved()

        return t('broker.transfer.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) => getErrorMessageFromRequest(error),
    })
  }

  return { form, isSubmitting: isPending, onSubmit: form.handleSubmit(onSubmit) }
}
