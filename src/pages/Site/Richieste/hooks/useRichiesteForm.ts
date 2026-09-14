import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { usePublicLeadControllerCreate } from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
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
  const { promisePopup } = usePromisePopup()
  const { mutateAsync, isPending } = usePublicLeadControllerCreate()
  // Key do <form>: forçar remontagem no sucesso, pois o reset do RHF não
  // limpa visualmente os inputs (ref interna do Field do base-ui prevalece)
  const [formKey, setFormKey] = useState(0)

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

    promisePopup(promise, {
      pending: t('richieste.toastPending'),
      success: () => {
        form.reset(emptyValues)
        setFormKey((key) => key + 1)
        return t('richieste.toastSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('richieste.toastError')),
    })
  }

  return {
    form,
    formKey,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
