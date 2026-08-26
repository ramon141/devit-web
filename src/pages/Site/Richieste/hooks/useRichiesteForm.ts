import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { AxiosError } from 'axios'
import { usePublicLeadControllerCreate } from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import {
  getErrorMessageFromRequest,
  type ApiErrorResponse,
} from '@/utils/getErrorMessageFromRequest'
import {
  richiesteSchema,
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
  const { toastPromise } = useToast()
  const { mutateAsync, isPending } = usePublicLeadControllerCreate()

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
      pending: 'Invio della richiesta...',
      success: () => {
        form.reset(emptyValues)
        return 'Richiesta inviata con successo! Ti contatteremo al più presto.'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’invio della richiesta'),
    })
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
