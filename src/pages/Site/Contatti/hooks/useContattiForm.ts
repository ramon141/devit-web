import { useMemo } from 'react'
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
  createContattiSchema,
  type ContattiFormValues,
} from '@/pages/Site/Contatti/schemas/contattiSchema'

const emptyValues: ContattiFormValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  acceptPrivacy: false,
}

export function useContattiForm() {
  const { t } = useTranslation('site')
  const { promisePopup } = usePromisePopup()
  const { mutateAsync, isPending } = usePublicLeadControllerCreate()

  const contattiSchema = useMemo(() => createContattiSchema(t), [t])

  const form = useForm<ContattiFormValues>({
    resolver: zodResolver(contattiSchema),
    defaultValues: emptyValues,
  })

  function onSubmit(values: ContattiFormValues) {
    const promise = mutateAsync({
      data: {
        requestType: 'contact',
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        message: values.message,
      },
    })

    promisePopup(promise, {
      pending: t('contatti.toastPending'),
      success: () => {
        form.reset(emptyValues)
        return t('contatti.toastSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('contatti.toastError')),
    })
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
