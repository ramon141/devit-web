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
  contattiSchema,
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
  const { toastPromise } = useToast()
  const { mutateAsync, isPending } = usePublicLeadControllerCreate()

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

    toastPromise(promise, {
      pending: 'Invio del messaggio...',
      success: () => {
        form.reset(emptyValues)
        return 'Messaggio inviato con successo! Ti risponderemo al più presto.'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’invio del messaggio'),
    })
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
