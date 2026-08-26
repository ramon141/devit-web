import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { usePublicLeadControllerCreate } from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import {
  getErrorMessageFromRequest,
  type ApiErrorResponse,
} from '@/utils/getErrorMessageFromRequest'
import {
  createRichiesteSchema,
  type RichiesteFormValues,
} from '@/pages/Site/Richieste/schemas/richiesteSchema'

const emptyValues: RichiesteFormValues = {
  requestType: 'search',
  desiredCity: '',
  maxBudget: '',
  name: '',
  email: '',
  phone: '',
  message: '',
  acceptTerms: false,
}

export function useRichiesteForm() {
  const { t } = useTranslation('site')
  const { toastPromise } = useToast()
  const { mutateAsync, isPending } = usePublicLeadControllerCreate()

  const richiesteSchema = useMemo(() => createRichiesteSchema(t), [t])

  const form = useForm<RichiesteFormValues>({
    resolver: zodResolver(richiesteSchema),
    defaultValues: emptyValues,
  })

  function onSubmit(values: RichiesteFormValues) {
    const promise = mutateAsync({
      data: {
        requestType: values.requestType,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        desiredCity: values.desiredCity,
        maxBudget: values.maxBudget ? Number(values.maxBudget) : undefined,
      },
    })

    toastPromise(promise, {
      pending: t('richieste.toastPending'),
      success: () => {
        form.reset(emptyValues)
        return t('richieste.toastSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('richieste.toastError')),
    })
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
